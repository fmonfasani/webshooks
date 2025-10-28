from backend.models.planning import Planning
from backend.db.database import SessionLocal

def save_plan(data: dict):
    db = SessionLocal()
    plan = Planning(**data)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan
