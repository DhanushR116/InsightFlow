from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.exception_handlers import (
    general_exception_handler,
    validation_exception_handler,)
from app.api.routes.auth import router as auth_router
from app.api.routes.customers import router as customer_router
from app.core.auth_dependencies import get_current_user, require_admin
from app.models.user import User
from app.api.routes.orders import router as order_router
from app.api.routes.products import router as product_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.audit_logs import router as audit_logs_router


app = FastAPI(title="InsightFlow API")

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    Exception,
    general_exception_handler,
)

app = FastAPI(title="InsightFlow API")

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    Exception,
    general_exception_handler,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(product_router)
app.include_router(analytics_router)
app.include_router(audit_logs_router)


@app.get("/")
def home():
    return {"message": "Welcome to InsightFlow API"}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "InsightFlow",
    }


@app.get("/api/protected")
def protected_route(
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "You are authenticated",
        "username": current_user.username,
        "role_id": current_user.role_id,
    }


@app.get("/api/admin-only")
def admin_only_route(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "You have admin access",
        "username": current_user.username,
        "role_id": current_user.role_id,
    }