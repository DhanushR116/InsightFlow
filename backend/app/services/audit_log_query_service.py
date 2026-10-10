from sqlalchemy.orm import Session      #type: ignore

from app.models.audit_log import AuditLog


def get_audit_logs(
    db: Session,
    skip: int = 0,
    limit: int = 50,
) -> list[AuditLog]:
    return (
        db.query(AuditLog)
        .order_by(AuditLog.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )