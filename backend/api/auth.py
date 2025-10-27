from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..db.database import get_session
from ..schemas.user import UserCreate, UserRead, TokenResponse
from ..models.user import User
from ..services.auth_service import create_user, authenticate_user
from ..utils.security import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup(data: UserCreate, session: Session = Depends(get_session)):
    token = create_user(session, data)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/signin", response_model=TokenResponse)
def signin(data: UserCreate, session: Session = Depends(get_session)):
    token = authenticate_user(session, data.email, data.password)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return user

