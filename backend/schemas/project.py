from typing import Optional
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str


class ProjectUpdate(BaseModel):
    name: Optional[str] = None


class ProjectRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

