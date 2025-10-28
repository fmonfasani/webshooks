from pydantic import BaseModel
from typing import List, Dict, Any

class PlanningBase(BaseModel):
    project_name: str
    description: str
    plan_data: Dict[str, Any]

class PlanningCreate(PlanningBase):
    pass

class PlanningResponse(PlanningBase):
    id: int
    class Config:
        orm_mode = True
