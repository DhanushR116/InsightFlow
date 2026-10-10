from sqlalchemy.orm import Session

from app.models.product import Product


def get_product_by_id(
    db: Session,
    product_id: int,
) -> Product | None:
    return (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
) -> list[Product]:
    query = db.query(Product)

    if search:
        search_value = f"%{search}%"
        query = query.filter(
            Product.name.ilike(search_value)
        )

    return (
        query
        .order_by(Product.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_product(
    db: Session,
    name: str,
    price,
    stock: int,
) -> Product:
    product = Product(
        name=name,
        price=price,
        stock=stock,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def update_product(
    db: Session,
    product: Product,
    name: str | None = None,
    price=None,
    stock: int | None = None,
) -> Product:

    if name is not None:
        product.name = name

    if price is not None:
        product.price = price

    if stock is not None:
        product.stock = stock

    db.commit()
    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product: Product,
) -> None:
    db.delete(product)
    db.commit()