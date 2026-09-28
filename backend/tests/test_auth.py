from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_register_user(client: TestClient, db_session: Session):
    response = client.post(
        "/api/auth/register",
        json={"name": "New User", "email": "new@example.com", "password": "newpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "id" in data

def test_login_user(client: TestClient, test_user):
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient, test_user):
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_access_protected_route_no_token(client: TestClient):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
