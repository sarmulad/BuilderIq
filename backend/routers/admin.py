from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User, Submission, Incentive, AuditLog, ScraperLog
from email_service import email_service
from uuid import UUID
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

def verify_admin(user_id: UUID, db: Session) -> bool:
    """Verify user has admin role"""
    user = db.query(User).filter(User.id == user_id).first()
    return user and user.role == "admin"

@router.get("/submissions")
async def list_submissions(
    db: Session = Depends(get_db),
    user_id: UUID = None,
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """List pending submissions for moderation"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    query = db.query(Submission)
    
    if status:
        query = query.filter(Submission.status == status)
    else:
        query = query.filter(Submission.status == "pending")
    
    total = query.count()
    submissions = query.order_by(Submission.created_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "items": [
            {
                "id": str(s.id),
                "type": s.type,
                "value": s.value,
                "description": s.description,
                "status": s.status,
                "user_email": s.user.email,
                "created_at": s.created_at.isoformat()
            }
            for s in submissions
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.post("/submissions/{submission_id}/approve")
async def approve_submission(
    submission_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Approve user submission and create incentive"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Create incentive from submission
    incentive = Incentive(
        builder_id=submission.builder_id,
        community_id=submission.community_id,
        type=submission.type,
        value=submission.value,
        description=submission.description,
        is_active=True
    )
    db.add(incentive)
    
    # Update submission
    submission.status = "approved"
    submission.approved_at = datetime.utcnow()
    submission.approved_by_id = user_id
    
    # Log audit
    audit_log = AuditLog(
        user_id=user_id,
        action="submission_approved",
        entity_type="submission",
        entity_id=submission_id,
        new_data={"incentive_id": str(incentive.id)}
    )
    db.add(audit_log)
    db.commit()
    
    # Send approval email
    email_service.send_submission_approved_email(submission.user, {
        "type": submission.type,
        "description": submission.description
    })
    
    return {"message": "Submission approved", "incentive_id": str(incentive.id)}

@router.post("/submissions/{submission_id}/reject")
async def reject_submission(
    submission_id: UUID,
    user_id: UUID,
    reason: str,
    db: Session = Depends(get_db)
):
    """Reject user submission"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission.status = "rejected"
    submission.rejection_reason = reason
    submission.updated_at = datetime.utcnow()
    
    # Log audit
    audit_log = AuditLog(
        user_id=user_id,
        action="submission_rejected",
        entity_type="submission",
        entity_id=submission_id,
        new_data={"reason": reason}
    )
    db.add(audit_log)
    db.commit()
    
    # Send rejection email
    email_service.send_submission_rejected_email(submission.user, reason)
    
    return {"message": "Submission rejected"}

@router.get("/analytics")
async def get_analytics(user_id: UUID, db: Session = Depends(get_db)):
    """Get platform analytics"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return {
        "total_users": db.query(User).count(),
        "active_users": db.query(User).filter(User.is_active == True).count(),
        "total_incentives": db.query(Incentive).count(),
        "pending_submissions": db.query(Submission).filter(Submission.status == "pending").count(),
        "approved_submissions": db.query(Submission).filter(Submission.status == "approved").count(),
        "total_builders": db.query(Builder).count(),
    }

@router.get("/scraper-logs")
async def get_scraper_logs(
    user_id: UUID,
    skip: int = Query(0),
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    """Get scraper execution logs"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    logs = db.query(ScraperLog).order_by(
        ScraperLog.started_at.desc()
    ).offset(skip).limit(limit).all()
    
    total = db.query(ScraperLog).count()
    
    return {
        "items": [
            {
                "id": str(log.id),
                "builder_id": str(log.builder_id),
                "status": log.status,
                "items_scraped": log.items_scraped,
                "items_created": log.items_created,
                "items_updated": log.items_updated,
                "error_message": log.error_message,
                "started_at": log.started_at.isoformat(),
                "completed_at": log.completed_at.isoformat() if log.completed_at else None
            }
            for log in logs
        ],
        "total": total
    }

@router.post("/trigger-scraper/{builder_id}")
async def trigger_scraper(builder_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    """Manually trigger scraper for a specific builder"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from scraper.tasks import scrape_builder
    builder = db.query(Builder).filter(Builder.id == builder_id).first()
    if not builder:
        raise HTTPException(status_code=404, detail="Builder not found")
    
    # Trigger async scraping task
    task = scrape_builder.delay(str(builder_id), builder.name)
    
    # Log audit
    audit_log = AuditLog(
        user_id=user_id,
        action="scraper_triggered",
        entity_type="builder",
        entity_id=builder_id
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Scraper triggered", "task_id": task.id}

@router.get("/audit-logs")
async def get_audit_logs(
    user_id: UUID,
    skip: int = Query(0),
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    """Get audit logs for admin actions"""
    if not verify_admin(user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    logs = db.query(AuditLog).order_by(
        AuditLog.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    total = db.query(AuditLog).count()
    
    return {
        "items": [
            {
                "id": str(log.id),
                "user_id": str(log.user_id) if log.user_id else None,
                "action": log.action,
                "entity_type": log.entity_type,
                "entity_id": str(log.entity_id) if log.entity_id else None,
                "created_at": log.created_at.isoformat()
            }
            for log in logs
        ],
        "total": total
    }
