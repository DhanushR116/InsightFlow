from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session                                    #type: ignore

from app.core.auth_dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)
from app.services.audit_log_service import create_audit_log
from app.services.customer_service import (
    create_customer,
    delete_customer,
    get_customer_by_email,
    get_customer_by_id,
    get_customers,
    update_customer,
)


router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"],
)


@router.get("/", response_model=list[CustomerResponse])
def list_customers(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_customers(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
    )


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


@router.post(
    "/",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_customer = get_customer_by_email(
        db=db,
        email=customer_data.email,
    )

    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer with this email already exists",
        )

    customer = create_customer(
        db=db,
        name=customer_data.name,
        email=customer_data.email,
        phone=customer_data.phone,
    )

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="CREATE",
        entity_type="CUSTOMER",
        entity_id=customer.id,
        description=f"Customer '{customer.name}' created successfully",
    )

    return customer


@router.patch(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_existing_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    if customer_data.email is not None:
        existing_customer = get_customer_by_email(
            db=db,
            email=customer_data.email,
        )

        if (
            existing_customer
            and existing_customer.id != customer.id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Customer with this email already exists",
            )

    updated_customer = update_customer(
        db=db,
        customer=customer,
        name=customer_data.name,
        email=customer_data.email,
        phone=customer_data.phone,
    )

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="UPDATE",
        entity_type="CUSTOMER",
        entity_id=updated_customer.id,
        description=f"Customer '{updated_customer.name}' updated successfully",
    )

    return updated_customer


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    deleted_customer_id = customer.id
    deleted_customer_name = customer.name

    delete_customer(
        db=db,
        customer=customer,
    )

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="DELETE",
        entity_type="CUSTOMER",
        entity_id=deleted_customer_id,
        description=f"Customer '{deleted_customer_name}' deleted successfully",
    )

    return None