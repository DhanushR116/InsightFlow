
from uuid import uuid4
from decimal import Decimal

from tests.test_customers import get_auth_headers


def unique_name(prefix="Test"):
    return f"{prefix} {uuid4().hex}"


def create_customer(client, headers):
    response = client.post(
        "/api/customers/",
        headers=headers,
        json={
            "name": unique_name("Customer"),
            "email": f"{uuid4().hex}@example.com",
            "phone": "9876543210",
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def create_product(client, headers, price="100.00", stock=10):
    response = client.post(
        "/api/products/",
        headers=headers,
        json={
            "name": unique_name("Product"),
            "price": price,
            "stock": stock,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def create_order(client, headers, customer_id, items):
    return client.post(
        "/api/orders/",
        headers=headers,
        json={
            "customer_id": customer_id,
            "items": items,
        },
    )


def test_create_order_calculates_total_and_reduces_stock(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)
    product = create_product(client, headers, price="25.50", stock=10)

    response = create_order(
        client,
        headers,
        customer["id"],
        [{"product_id": product["id"], "quantity": 3}],
    )

    assert response.status_code == 200, response.text
    data = response.json()

    assert data["customer_id"] == customer["id"]
    assert Decimal(data["total_amount"]) == Decimal("76.50")
    assert len(data["items"]) == 1
    assert data["items"][0]["product_id"] == product["id"]
    assert data["items"][0]["quantity"] == 3
    assert Decimal(data["items"][0]["unit_price"]) == Decimal("25.50")

    product_response = client.get(
        f"/api/products/{product['id']}",
        headers=headers,
    )
    assert product_response.status_code == 200
    assert product_response.json()["stock"] == 7


def test_create_order_rejects_missing_customer(client):
    headers = get_auth_headers(client)
    product = create_product(client, headers)

    response = create_order(
        client,
        headers,
        99999999,
        [{"product_id": product["id"], "quantity": 1}],
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Customer not found"


def test_create_order_rejects_missing_product(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)

    response = create_order(
        client,
        headers,
        customer["id"],
        [{"product_id": 99999999, "quantity": 1}],
    )

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_create_order_rejects_insufficient_stock(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)
    product = create_product(client, headers, stock=2)

    response = create_order(
        client,
        headers,
        customer["id"],
        [{"product_id": product["id"], "quantity": 3}],
    )

    assert response.status_code == 400
    assert "Insufficient stock" in response.json()["detail"]

    product_response = client.get(
        f"/api/products/{product['id']}",
        headers=headers,
    )
    assert product_response.status_code == 200
    assert product_response.json()["stock"] == 2


def test_create_order_rejects_empty_items(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)

    response = create_order(
        client,
        headers,
        customer["id"],
        [],
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Order must contain at least one item"


def test_create_order_rejects_zero_quantity(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)
    product = create_product(client, headers)

    response = create_order(
        client,
        headers,
        customer["id"],
        [{"product_id": product["id"], "quantity": 0}],
    )

    assert response.status_code == 422


def test_list_orders(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)
    product = create_product(client, headers)

    create_response = create_order(
        client,
        headers,
        customer["id"],
        [{"product_id": product["id"], "quantity": 1}],
    )
    assert create_response.status_code == 200, create_response.text

    response = client.get("/api/orders/", headers=headers)

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert any(
        order["id"] == create_response.json()["id"]
        for order in response.json()
    )


def test_get_order_by_id(client):
    headers = get_auth_headers(client)
    customer = create_customer(client, headers)
    product = create_product(client, headers)

    create_response = create_order(
        client,
        headers,
        customer["id"],
        [{"product_id": product["id"], "quantity": 1}],
    )
    assert create_response.status_code == 200, create_response.text

    order_id = create_response.json()["id"]
    response = client.get(
        f"/api/orders/{order_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == order_id


def test_get_missing_order_returns_404(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/api/orders/99999999",
        headers=headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Order not found"


def test_order_endpoints_require_authentication(client):
    response = client.get("/api/orders/")

    assert response.status_code == 401
