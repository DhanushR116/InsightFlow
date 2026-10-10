from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session                      #type: ignore

from app.core.auth_dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.audit_log import AuditLogResponse
from app.services.audit_log_query_service import get_audit_logs


router = APIRouter(
    prefix="/api/audit-logs",
    tags=["Audit Logs"],
)


@router.get(
    "/",
    response_model=list[AuditLogResponse],
)
def list_audit_logs(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_audit_logs(
        db=db,
        skip=skip,
        limit=limit,
    )