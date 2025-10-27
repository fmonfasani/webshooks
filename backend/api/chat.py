from typing import Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlmodel import Session

from ..db.database import get_session
from ..models.user import User
from ..services.chat_service import ChatGenerationResult, chat_service
from ..utils.security import get_current_user


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User message to send to the assistant.")
    conversation_id: Optional[str] = Field(
        default=None,
        description="Existing conversation identifier; omit to start a new thread.",
    )


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    reply_message_id: int
    user_message_id: int
    model: str
    response_id: Optional[str] = None
    usage: Optional[Dict[str, int]] = None
    finish_reason: Optional[str] = None
    is_mock: bool = False


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/ask", response_model=ChatResponse)
def ask(
    body: ChatRequest,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
) -> ChatResponse:
    try:
        result: ChatGenerationResult = chat_service.reply_to_message(
            session,
            user,
            body.message,
            conversation_id=body.conversation_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return ChatResponse(
        reply=result.reply,
        conversation_id=result.conversation_id,
        reply_message_id=result.reply_message_id,
        user_message_id=result.user_message_id,
        model=result.model,
        response_id=result.response_id,
        usage=result.usage,
        finish_reason=result.finish_reason,
        is_mock=result.is_mock,
    )
