from decimal import Decimal

from sqlalchemy import func                 #type: ignore
from sqlalchemy.orm import Session          #type: ignore

from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product


def get_dashboard_analytics(db: Session):
    total_customers = (
        db.query(func.count(Customer.id))
        .scalar()
        or 0
    )

    total_products = (
        db.query(func.count(Product.id))
        .scalar()
        or 0
    )

    total_orders = (
        db.query(func.count(Order.id))
        .scalar()
        or 0
    )

    total_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .scalar()
        or Decimal("0.00")
    )

    total_inventory = (
        db.query(func.coalesce(func.sum(Product.stock), 0))
        .scalar()
        or 0
    )

    inventory = (
        db.query(
            Product.name,
            Product.stock,
        )
        .order_by(Product.id)
        .all()
    )

    revenue = (
        db.query(
            Order.id,
            Order.total_amount,
        )
        .order_by(Order.id)
        .all()
    )

    return {
        "total_customers": total_customers,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_inventory": total_inventory,
        "inventory": [
            {
                "name": name,
                "stock": stock,
            }
            for name, stock in inventory
        ],
        "revenue": [
            {
                "order_id": order_id,
                "total_amount": total_amount,
            }
            for order_id, total_amount in revenue
        ],
    }