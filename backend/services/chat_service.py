from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Sequence
from uuid import uuid4

try:
    from openai import APIError, OpenAI
except ImportError:  # pragma: no cover - library missing
    OpenAI = None  # type: ignore
    APIError = Exception  # type: ignore
from sqlmodel import Session, select

from ..db.database import SessionLocal
from ..models.chat import ChatMessage
from ..models.user import User

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "Eres un asistente estructurado, conciso y tecnico, especializado en generacion de SaaS y modulos web."
)


@dataclass
class ChatGenerationResult:
    reply: str
    conversation_id: str
    reply_message_id: int
    user_message_id: int
    model: str
    response_id: Optional[str]
    usage: Optional[Dict[str, int]]
    finish_reason: Optional[str]
    is_mock: bool


class OpenAIChatClient:
    """Thin HTTP client for the OpenAI Chat Completions API."""

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout: float = 30.0,
        temperature: float = 0.3,
    ) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.base_url = (base_url or os.getenv("OPENAI_BASE_URL") or "https://api.openai.com/v1").rstrip("/")
        self.model = model or os.getenv("OPENAI_CHAT_MODEL") or "gpt-4o-mini"
        self.timeout = timeout
        self.temperature = temperature
        dry_run_flag = os.getenv("OPENAI_DRY_RUN") or os.getenv("DRY_RUN")
        self.dry_run = not self.api_key or (dry_run_flag and dry_run_flag.lower() in {"1", "true", "yes"})
        if self.api_key and OpenAI:
            client_kwargs = {"api_key": self.api_key, "base_url": self.base_url}
            self.client = OpenAI(**client_kwargs)
        else:
            self.client = None
        if self.client is None:
            self.dry_run = True

    def generate_reply(
        self,
        prompt: str,
        history: Sequence[Dict[str, str]],
        *,
        user_email: Optional[str] = None,
    ) -> Dict[str, object]:
        """Generate a reply using OpenAI; falls back to heuristics when dry-run or on failure."""
        if self.dry_run or not self.client:
            return self._mock_response(prompt, reason="dry_run")

        payload = {
            "model": self.model,
            "temperature": self.temperature,
            "messages": [{"role": "system", "content": SYSTEM_PROMPT}, *history, {"role": "user", "content": prompt}],
        }

        request_kwargs = {"timeout": self.timeout}
        if user_email:
            request_kwargs["user"] = user_email

        try:
            response = self.client.chat.completions.create(
                **payload,
                **request_kwargs,
            )
        except APIError as exc:
            logger.warning("OpenAI chat request failed; falling back to heuristic reply: %s", exc, exc_info=True)
            return self._mock_response(prompt, reason="http_error")
        except Exception as exc:  # noqa: BLE001
            logger.warning("Unexpected OpenAI failure; falling back to heuristic reply: %s", exc, exc_info=True)
            return self._mock_response(prompt, reason="unexpected_error")

        choices = getattr(response, "choices", None) or []
        if not choices:
            logger.warning("OpenAI chat response contained no choices; using heuristic.")
            return self._mock_response(prompt, reason="empty_choices")

        choice = choices[0]
        message_block = getattr(choice, "message", None) or {}
        content = (getattr(message_block, "content", None) or message_block.get("content") or "").strip()
        if not content:
            logger.warning("OpenAI chat response without content; using heuristic.")
            return self._mock_response(prompt, reason="empty_content")

        return {
            "content": content,
            "model": getattr(response, "model", None) or self.model,
            "response_id": getattr(response, "id", None),
            "usage": self._usage_to_dict(getattr(response, "usage", None)),
            "finish_reason": getattr(choice, "finish_reason", None),
            "is_mock": False,
        }

    @staticmethod
    def _usage_to_dict(usage_obj: Optional[object]) -> Optional[Dict[str, int]]:
        if not usage_obj:
            return None
        if isinstance(usage_obj, dict):
            return {k: int(v) for k, v in usage_obj.items() if isinstance(v, (int, float))}
        data = {}
        for attr in ("prompt_tokens", "completion_tokens", "total_tokens"):
            value = getattr(usage_obj, attr, None)
            if value is not None:
                data[attr] = int(value)
        return data or None

    def _mock_response(self, prompt: str, *, reason: str) -> Dict[str, object]:
        content = self._heuristic_suggestion(prompt)
        return {
            "content": content,
            "model": f"{self.model}-mock",
            "response_id": None,
            "usage": None,
            "finish_reason": reason,
            "is_mock": True,
        }

    @staticmethod
    def _heuristic_suggestion(prompt: str) -> str:
        text = prompt.lower()
        if not prompt.strip():
            return "Please share a short description of the app or workflow you want to build."
        if any(keyword in text for keyword in ("curso", "course", "academy", "lesson")):
            return "Consider adding payments, structured lessons, and progress tracking for your course platform."
        if any(keyword in text for keyword in ("auth", "login", "signup", "registro", "oauth")):
            return "Add email and password auth with reusable forms, plus social providers if needed."
        if any(keyword in text for keyword in ("dashboard", "analytics", "metric", "kpi")):
            return "Design a dashboard with key metrics, recent activity, and filters tailored to your users."
        if any(keyword in text for keyword in ("chat", "assistant", "ai", "copilot")):
            return "Offer an AI assistant to refine requirements and automate onboarding tasks."
        return f"Start by naming the project and outlining the main user journey for: \"{prompt.strip()[:80]}\"."


class ChatService:
    """Business logic for chat interactions."""

    def __init__(self, client: Optional[OpenAIChatClient] = None, *, history_limit: int = 8) -> None:
        self.client = client or OpenAIChatClient()
        self.history_limit = history_limit

    def reply_to_message(
        self,
        session: Session,
        user: User,
        message: str,
        *,
        conversation_id: Optional[str] = None,
    ) -> ChatGenerationResult:
        text = (message or "").strip()
        if not text:
            raise ValueError("Message cannot be empty.")

        convo_id = conversation_id or str(uuid4())
        history_records = self._load_history(session, user.id, convo_id)
        history_payload = [{"role": record.role, "content": record.content} for record in history_records]
        completion = self.client.generate_reply(text, history_payload, user_email=user.email)

        now = datetime.utcnow()
        user_message = ChatMessage(
            user_id=user.id,
            email=user.email,
            conversation_id=convo_id,
            role="user",
            content=text,
            model=None,
            response_id=None,
            timestamp=now,
        )
        assistant_message = ChatMessage(
            user_id=user.id,
            email=user.email,
            conversation_id=convo_id,
            role="assistant",
            content=completion["content"],
            model=str(completion.get("model") or self.client.model),
            response_id=completion.get("response_id"),
            timestamp=datetime.utcnow(),
        )

        session.add(user_message)
        session.add(assistant_message)
        session.commit()
        session.refresh(user_message)
        session.refresh(assistant_message)

        return ChatGenerationResult(
            reply=assistant_message.content,
            conversation_id=convo_id,
            reply_message_id=assistant_message.id,
            user_message_id=user_message.id,
            model=assistant_message.model or self.client.model,
            response_id=assistant_message.response_id,
            usage=completion.get("usage"),
            finish_reason=completion.get("finish_reason"),
            is_mock=bool(completion.get("is_mock")),
        )

    def _load_history(self, session: Session, user_id: int, conversation_id: str) -> List[ChatMessage]:
        statement = (
            select(ChatMessage)
            .where(ChatMessage.user_id == user_id, ChatMessage.conversation_id == conversation_id)
            .order_by(ChatMessage.timestamp.desc())
            .limit(self.history_limit)
        )
        records = list(session.exec(statement))
        records.reverse()
        return records


# Default singleton used by API routes
chat_service = ChatService()


def process_chat_message(user_prompt: str, user_email: str) -> Dict[str, str]:
    """Process a standalone chat prompt, persist messages, and return structured JSON."""
    text = (user_prompt or "").strip()
    if not text:
        raise ValueError("Message cannot be empty.")

    api_key = os.getenv("OPENAI_API_KEY")
    completion = None
    answer = ""
    model_name = "gpt-4o-mini"
    response_id: Optional[str] = None

    if OpenAI and api_key:
        client = OpenAI(api_key=api_key)
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un asistente estructurado, conciso y tecnico, especializado en generacion de SaaS y modulos web.",
                    },
                    {"role": "user", "content": text},
                ],
                temperature=0.7,
                max_tokens=400,
            )
        except APIError as exc:
            logger.warning("OpenAI API error during process_chat_message: %s", exc, exc_info=True)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Unexpected error contacting OpenAI: %s", exc, exc_info=True)

    if completion and getattr(completion, "choices", None):
        choice = completion.choices[0]
        message_obj = getattr(choice, "message", None)
        raw_content = getattr(message_obj, "content", None) if message_obj else None
        answer = (raw_content or "").strip()
        if not answer:
            answer = chat_service.client._heuristic_suggestion(text)  # type: ignore[attr-defined]
        model_name = getattr(completion, "model", None) or model_name
        response_id = getattr(completion, "id", None)
    else:
        fallback = chat_service.client.generate_reply(text, [], user_email=user_email)
        answer = fallback["content"]
        model_name = str(fallback.get("model") or model_name)
        response_id = fallback.get("response_id")

    conversation_id = str(uuid4())
    user_timestamp = datetime.utcnow()
    assistant_timestamp = datetime.utcnow()

    session = SessionLocal()
    try:
        user_record = session.exec(select(User).where(User.email == user_email)).first()
        user_id = user_record.id if user_record else None
        session.add_all(
            [
                ChatMessage(
                    email=user_email,
                    role="user",
                    content=text,
                    timestamp=user_timestamp,
                    conversation_id=conversation_id,
                    user_id=user_id,
                ),
                ChatMessage(
                    email=user_email,
                    role="assistant",
                    content=answer,
                    timestamp=assistant_timestamp,
                    conversation_id=conversation_id,
                    model=model_name,
                    response_id=response_id,
                    user_id=user_id,
                ),
            ]
        )
        session.commit()
    finally:
        session.close()

    return {"user": text, "assistant": answer, "timestamp": assistant_timestamp.isoformat()}
