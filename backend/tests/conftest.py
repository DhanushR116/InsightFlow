import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

# --------------------------------------------------
# 1. Verify DATABASE_URL is provided before app imports
# --------------------------------------------------

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is missing. Set it to insightflow_test_db "
        "before running tests."
    )

# --------------------------------------------------
# 2. Import the application after reading the environment
# --------------------------------------------------

from app.main import app
from app.db.dependencies import get_db
from app.db.database import SessionLocal, engine
from app.models.role import Role
from app.models.user import User
from app.core.security import hash_password


EXPECTED_TEST_DB = "insightflow_test_db"


# --------------------------------------------------
# 3. Safety check: block tests against the main database
# --------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
def verify_test_database():
    """Ensure the test session connects only to the test database."""

    if engine.url.database != EXPECTED_TEST_DB:
        raise RuntimeError(
            f"Tests blocked! Expected database "
            f"'{EXPECTED_TEST_DB}', but engine is configured for "
            f"'{engine.url.database}'."
        )

    with engine.connect() as connection:
        actual_database = connection.execute(
            text("SELECT DATABASE()")
        ).scalar()

    if actual_database != EXPECTED_TEST_DB:
        raise RuntimeError(
            f"Tests blocked! Expected database "
            f"'{EXPECTED_TEST_DB}', but connected to "
            f"'{actual_database}'."
        )


# --------------------------------------------------
# 4. Generate unique customer emails for tests
# --------------------------------------------------

@pytest.fixture
def unique_email():
    """Generate a unique email for each test."""

    return f"cust_{uuid.uuid4().hex}@example.com"


# --------------------------------------------------
# 5. Configure the FastAPI test client
# --------------------------------------------------

@pytest.fixture
def client():
    """Prepare the test user and provide a FastAPI test client."""

    db: Session = SessionLocal()

    username = "testuser"
    email = "testuser@example.com"

    try:
        # Find the user role or create it if missing.
        role = db.query(Role).filter(
            Role.name == "user"
        ).first()

        if role is None:
            role = Role(name="user")
            db.add(role)
            db.commit()
            db.refresh(role)

        # Find the test user.
        user = db.query(User).filter(
            User.username == username
        ).first()

        # Create the test user if it doesn't exist.
        if user is None:
            user = User(
                username=username,
                email=email,
                password_hash=hash_password(
                    "TestPassword123!"
                ),
                role_id=role.id,
            )
            db.add(user)

        # Otherwise, update its test credentials.
        else:
            user.email = email
            user.password_hash = hash_password(
                "TestPassword123!"
            )
            user.role_id = role.id

        db.commit()

    finally:
        db.close()

    # Override the application's database dependency.
    def override_get_db():
        test_db = SessionLocal()

        try:
            yield test_db
        finally:
            test_db.close()

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as test_client:
            yield test_client

    finally:
        # Remove dependency overrides after the test.
        app.dependency_overrides.clear()
