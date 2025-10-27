from datetime import datetime
from typing import List, Optional
from sqlmodel import Session, select
from ..models.project import Project
from ..models.user import User
from ..schemas.project import ProjectCreate, ProjectUpdate


def list_projects(session: Session, owner: User) -> List[Project]:
    return list(session.exec(select(Project).where(Project.owner_id == owner.id)))


def create_project(session: Session, owner: User, data: ProjectCreate) -> Project:
    proj = Project(name=data.name, owner_id=owner.id)
    session.add(proj)
    session.commit()
    session.refresh(proj)
    return proj


def get_project(session: Session, owner: User, project_id: int) -> Optional[Project]:
    proj = session.get(Project, project_id)
    if proj and proj.owner_id == owner.id:
        return proj
    return None


def update_project(session: Session, owner: User, project_id: int, data: ProjectUpdate) -> Optional[Project]:
    proj = get_project(session, owner, project_id)
    if not proj:
        return None
    if data.name is not None:
        proj.name = data.name
    proj.updated_at = datetime.utcnow()
    session.add(proj)
    session.commit()
    session.refresh(proj)
    return proj


def delete_project(session: Session, owner: User, project_id: int) -> bool:
    proj = get_project(session, owner, project_id)
    if not proj:
        return False
    session.delete(proj)
    session.commit()
    return True

