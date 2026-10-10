
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint_returns_success():
    response = client.get("/health")

    assert response.status_code == 200


def test_health_endpoint_returns_json():
    response = client.get("/health")

    assert response.headers["content-type"].startswith(
        "application/json"
    )

    assert response.json() is not None