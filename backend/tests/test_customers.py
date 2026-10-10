import uuid
def get_auth_headers(client):
    response = client.post(
        "/api/auth/login",
        json={
            "username": "testuser",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200
    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_create_customer(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": "Test Customer",
            "email": f"customer.{uuid.uuid4().hex}@example.com",
            "phone": "9876543210",
        },
    )


    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Customer"
    assert data["email"].startswith("customer.")
    assert data["email"].endswith("@example.com")
    assert data["phone"] == "9876543210"
    assert "id" in data


def test_list_customers(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/api/customers/",
        headers=headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_missing_customer_returns_404(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/api/customers/99999999",
        headers=headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Customer not found"


def test_create_customer_rejects_duplicate_email(client):
    headers = get_auth_headers(client)
    email = f"duplicate.{uuid.uuid4().hex}@example.com"

    first_response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": "First Customer",
            "email": email,
        },
    )

    print("FIRST CREATE ERROR:", first_response.json())
    assert first_response.status_code == 201

    second_response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": "Second Customer",
            "email": email,
        },
    )

    assert second_response.status_code == 400
    assert second_response.json()["detail"] == (
        "Customer with this email already exists"
    )


def test_customer_endpoints_require_authentication(client):
    response = client.get("/api/customers/")

    assert response.status_code == 401


def test_update_customer(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": "Customer Before Update",
            "email": f"update.{uuid.uuid4().hex}@example.com",
        },
    )
    assert create_response.status_code == 201
    customer_id = create_response.json()["id"]

    update_response = client.patch(
        f"/api/customers/{customer_id}",
        headers=headers,
        json={"name": "Customer After Update"},
    )

    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Customer After Update"


def test_delete_customer(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": "Customer To Delete",
            "email": "customer.delete@example.com",
        },
    )
    assert create_response.status_code == 201
    customer_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/customers/{customer_id}",
        headers=headers,
    )
    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/customers/{customer_id}",
        headers=headers,
    )
    assert get_response.status_code == 404


def test_create_customer_rejects_invalid_email(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": "Invalid Email Customer",
            "email": "not-an-email",
        },
    )

    assert response.status_code == 422
