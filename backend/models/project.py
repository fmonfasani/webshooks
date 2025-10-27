from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    owner_id: int = Field(foreign_key="user.id")

    owner: "User" = Relationship(back_populates="projects")


from .user import User  # noqa: E402

