from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session              #type: ignore

from app.core.auth_dependencies import get_current_user
from app.db.dependencies import get_db
from app.schemas.analytics import DashboardAnalytics
from app.services.analytics_service import get_dashboard_analytics


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get(
    "/dashboard",
    response_model=DashboardAnalytics,
)
def dashboard_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_dashboard_analytics(db)