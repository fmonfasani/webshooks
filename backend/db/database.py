from sqlmodel import SQLModel, Session, create_engine

SQLITE_URL = "sqlite:///./backend/app.db"
engine = create_engine(SQLITE_URL, echo=False, connect_args={"check_same_thread": False})


def init_db():
    SQLModel.metadata.create_all(engine)


def SessionLocal() -> Session:
    """Return a new Session bound to the engine."""
    return Session(engine)


def get_session():
    with Session(engine) as session:
        yield session
