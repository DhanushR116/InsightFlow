from sqlalchemy.orm import Session

from app.models.customer import Customer


def get_customer_by_id(
    db: Session,
    customer_id: int,
) -> Customer | None:
    return (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )


def get_customer_by_email(
    db: Session,
    email: str,
) -> Customer | None:
    return (
        db.query(Customer)
        .filter(Customer.email == email)
        .first()
    )


def get_customers(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
) -> list[Customer]:
    query = db.query(Customer)

    if search:
        search_value = f"%{search}%"

        query = query.filter(
            (Customer.name.ilike(search_value))
            | (Customer.email.ilike(search_value))
        )

    return (
        query
        .order_by(Customer.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_customer(
    db: Session,
    name: str,
    email: str,
    phone: str | None = None,
) -> Customer:
    customer = Customer(
        name=name,
        email=email,
        phone=phone,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def update_customer(
    db: Session,
    customer: Customer,
    name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
) -> Customer:
    if name is not None:
        customer.name = name

    if email is not None:
        customer.email = email

    if phone is not None:
        customer.phone = phone

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(
    db: Session,
    customer: Customer,
) -> None:
    db.delete(customer)
    db.commit()