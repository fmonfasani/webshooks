from sqlalchemy import Column, Integer, String, JSON
from backend.db.database import Base

class Planning(Base):
    __tablename__ = "planning"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    description = Column(String)
    plan_data = Column(JSON)
