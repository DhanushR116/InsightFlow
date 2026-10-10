from decimal import Decimal

from pydantic import BaseModel


class InventoryItem(BaseModel):
    name: str
    stock: int


class RevenueItem(BaseModel):
    order_id: int
    total_amount: Decimal


class DashboardAnalytics(BaseModel):
    total_customers: int
    total_products: int
    total_orders: int
    total_revenue: Decimal
    total_inventory: int
    inventory: list[InventoryItem]
    revenue: list[RevenueItem]