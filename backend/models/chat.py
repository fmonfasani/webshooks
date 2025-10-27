from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class ChatMessage(SQLModel, table=True):
    """Stored chat message associated with a user conversation."""

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    role: str = Field(index=True)
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    conversation_id: Optional[str] = Field(default=None, index=True)
    model: Optional[str] = Field(default=None, index=True)
    response_id: Optional[str] = Field(default=None, index=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
