
from uuid import uuid4

from tests.test_customers import get_auth_headers


def unique_product_name(prefix="Test Product"):
    return f"{prefix} {uuid4().hex}"


def test_create_product(client):
    headers = get_auth_headers(client)
    name = unique_product_name()

    response = client.post(
        "/api/products/",
        headers=headers,
        json={
            "name": name,
            "price": "99.99",
            "stock": 10,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == name
    assert float(data["price"]) == 99.99
    assert data["stock"] == 10
    assert "id" in data


def test_list_products(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/api/products/",
        headers=headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_product(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/api/products/",
        headers=headers,
        json={
            "name": unique_product_name(),
            "price": "49.50",
            "stock": 5,
        },
    )
    assert create_response.status_code == 201
    product_id = create_response.json()["id"]

    response = client.get(
        f"/api/products/{product_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == product_id


def test_get_missing_product_returns_404(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/api/products/99999999",
        headers=headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_update_product(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/api/products/",
        headers=headers,
        json={
            "name": unique_product_name(),
            "price": "20.00",
            "stock": 5,
        },
    )
    assert create_response.status_code == 201
    product_id = create_response.json()["id"]

    updated_name = unique_product_name("Updated Product")

    response = client.patch(
        f"/api/products/{product_id}",
        headers=headers,
        json={
            "name": updated_name,
            "price": "25.00",
            "stock": 8,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == updated_name
    assert float(data["price"]) == 25.00
    assert data["stock"] == 8


def test_delete_product(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/api/products/",
        headers=headers,
        json={
            "name": unique_product_name(),
            "price": "10.00",
            "stock": 2,
        },
    )
    assert create_response.status_code == 201
    product_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/products/{product_id}",
        headers=headers,
    )
    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/products/{product_id}",
        headers=headers,
    )
    assert get_response.status_code == 404


def test_product_endpoints_require_authentication(client):
    response = client.get("/api/products/")

    assert response.status_code == 401


def test_create_product_rejects_zero_or_negative_price(client):
    headers = get_auth_headers(client)

    for price in ("0", "-10.00"):
        response = client.post(
            "/api/products/",
            headers=headers,
            json={
                "name": unique_product_name(),
                "price": price,
                "stock": 5,
            },
        )

        assert response.status_code == 422


def test_create_product_rejects_negative_stock(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/api/products/",
        headers=headers,
        json={
            "name": unique_product_name(),
            "price": "10.00",
            "stock": -1,
        },
    )

    assert response.status_code == 422