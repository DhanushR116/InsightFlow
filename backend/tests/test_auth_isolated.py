
from app.core.security import hash_password, verify_password


def test_password_hash_verifies_correct_password():
    password = "InsightFlow_Test_Password_123!"
    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash)


def test_password_hash_rejects_wrong_password():
    password_hash = hash_password("InsightFlow_Test_Password_123!")

    assert not verify_password(
        "Wrong_Test_Password_456!",
        password_hash,
    )