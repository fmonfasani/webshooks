from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from ..db.database import get_session
from ..schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from ..models.user import User
from ..services.project_service import list_projects, create_project, get_project, update_project, delete_project
from ..utils.security import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectRead])
def get_projects(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    return list_projects(session, user)


@router.post("/", response_model=ProjectRead)
def add_project(data: ProjectCreate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    return create_project(session, user, data)


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    proj = get_project(session, user, project_id)
    if not proj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return proj


@router.put("/{project_id}", response_model=ProjectRead)
def edit_project(project_id: int, data: ProjectUpdate, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    proj = update_project(session, user, project_id, data)
    if not proj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return proj


@router.delete("/{project_id}")
def remove_project(project_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    ok = delete_project(session, user, project_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return {"ok": True}

