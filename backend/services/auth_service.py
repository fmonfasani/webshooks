from sqlmodel import Session, select
from fastapi import HTTPException, status
from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.jwt_handler import create_access_token
from ..utils.security import get_password_hash, verify_password


def create_user(session: Session, data: UserCreate) -> str:
    exists = session.exec(select(User).where(User.email == data.email)).first()
    print("📩 data recibido:", data)
    print("📩 password:", data.password, type(data.password))
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(email=data.email, hashed_password=get_password_hash(data.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    token = create_access_token(user.email)
    return token


def authenticate_user(session: Session, email: str, password: str) -> str:
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user.email)
    return token

