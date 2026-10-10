from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session                  #type: ignore

from app.core.auth_dependencies import get_current_user
from app.db.dependencies import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import (
    create_order,
    list_orders,
    get_order,
)


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"],
)


@router.post(
    "/",
    response_model=OrderResponse,
)
def create_new_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = create_order(
        db=db,
        order_data=order_data,
    )

    return order


@router.get(
    "/",
    response_model=list[OrderResponse],
)
def get_orders(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return list_orders(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{order_id}",
    response_model=OrderResponse,
)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_order(
        db=db,
        order_id=order_id,
    )