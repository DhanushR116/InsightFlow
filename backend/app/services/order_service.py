from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload      #type: ignore

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def create_order(
    db: Session,
    order_data: OrderCreate,
) -> Order:
    # 1. Check that the customer exists
    customer = (
        db.query(Customer)
        .filter(Customer.id == order_data.customer_id)
        .first()
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    # 2. Prevent empty orders
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )

    total_amount = Decimal("0.00")
    order_items_data = []

    # 3. Validate products and stock
    for item_data in order_data.items:
        product = (
            db.query(Product)
            .filter(Product.id == item_data.product_id)
            .first()
        )

        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item_data.product_id} not found",
            )

        if item_data.quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Insufficient stock for product "
                    f"{product.name}. Available stock: {product.stock}"
                ),
            )

        # 4. Backend calculates the item total
        item_total = product.price * item_data.quantity
        total_amount += item_total

        order_items_data.append(
            {
                "product": product,
                "quantity": item_data.quantity,
                "unit_price": product.price,
            }
        )

    # 5. Create the order
    order = Order(
        customer_id=customer.id,
        total_amount=total_amount,
    )

    db.add(order)
    db.flush()

    # 6. Create order items and reduce stock
    for item_data in order_items_data:
        product = item_data["product"]

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
        )

        db.add(order_item)

        product.stock -= item_data["quantity"]

    # 7. Commit the complete transaction
    db.commit()
    db.refresh(order)

    return order

def list_orders(
    db: Session,
    skip: int = 0,
    limit: int = 20,
) -> list[Order]:
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items)
        )
        .order_by(Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return orders


def get_order(
    db: Session,
    order_id: int,
) -> Order:
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items)
        )
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return order