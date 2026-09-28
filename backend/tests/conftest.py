import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from typing import Generator

# Set testing environment variables
os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite:///./test_digital_diary.db"

from app.main import app
from app.core.database import Base, get_db
from app.core.security import get_password_hash

# Import all models to register with Base
from app.models.user import User
from app.models.diary import DiaryEntry
from app.models.tag import Tag
from app.models.settings import UserSettings

# Use file-based SQLite for testing to avoid memory threading issues
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_digital_diary.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from sqlalchemy import text

@pytest.fixture(scope="function")
def db_session() -> Generator:
    print("\n--- Creating tables ---")
    print("Tables in metadata:", Base.metadata.tables.keys())
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    print("SQLite tables:", db.execute(text("SELECT name FROM sqlite_master WHERE type='table';")).fetchall())
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client() -> Generator:
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db_session) -> User:
    user = User(
        name="Test User",
        email="test@example.com",
        password_hash=get_password_hash("testpassword123")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def test_user2(db_session) -> User:
    user = User(
        name="Second User",
        email="second@example.com",
        password_hash=get_password_hash("testpassword123")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def user_token_headers(client: TestClient, test_user: User) -> dict:
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123",
    }
    r = client.post("/api/auth/login", json=login_data)
    tokens = r.json()
    return {"Authorization": f"Bearer {tokens['access_token']}"}

@pytest.fixture(scope="function")
def user2_token_headers(client: TestClient, test_user2: User) -> dict:
    login_data = {
        "email": "second@example.com",
        "password": "testpassword123",
    }
    r = client.post("/api/auth/login", json=login_data)
    tokens = r.json()
    return {"Authorization": f"Bearer {tokens['access_token']}"}
