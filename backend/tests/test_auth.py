
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)



def test_login_rejects_wrong_password(client):
    response = client.post(
        "/api/auth/login",
        json={
            "username": "testuser",
            "password": "definitely_wrong_password_123",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_login_rejects_missing_credentials(client):
    response = client.post("/api/auth/login", json={})

    assert response.status_code == 422


def test_protected_endpoint_rejects_missing_token(client):
    response = client.get("/api/protected")

    assert response.status_code == 401


def test_successful_login_returns_access_token(client):
    response = client.post(
        "/api/auth/login",
        json={
            "username": "testuser",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["access_token"]
    assert data["token_type"].lower() == "bearer"


def test_me_endpoint_accepts_valid_token(client):
    login_response = client.post(
        "/api/auth/login",
        json={
            "username": "testuser",
            "password": "TestPassword123!",
        },
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["username"] == "testuser"