from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, EmailSubscription, Incentive
from email_service import email_service
from uuid import UUID
from datetime import datetime, timedelta

router = APIRouter(prefix="/email")

@router.post("/subscribe")
async def subscribe_to_emails(
    user_id: UUID,
    subscription_type: str,  # daily, weekly, never
    builders_filter: list = None,
    cities_filter: list = None,
    db: Session = Depends(get_db)
):
    """Subscribe user to email digests"""
    subscription = db.query(EmailSubscription).filter(
        EmailSubscription.user_id == user_id
    ).first()
    
    if subscription:
        subscription.subscription_type = subscription_type
        subscription.builders_filter = builders_filter or []
        subscription.cities_filter = cities_filter or []
        subscription.updated_at = datetime.utcnow()
    else:
        subscription = EmailSubscription(
            user_id=user_id,
            subscription_type=subscription_type,
            builders_filter=builders_filter or [],
            cities_filter=cities_filter or []
        )
        db.add(subscription)
    
    db.commit()
    return {"message": "Subscription updated"}

@router.post("/send-digest")
async def send_weekly_digest(db: Session = Depends(get_db)):
    """Send weekly digests to all subscribed users"""
    subscriptions = db.query(EmailSubscription).filter(
        EmailSubscription.subscription_type == "weekly",
        (EmailSubscription.last_sent_at.is_(None)) | 
        (EmailSubscription.last_sent_at < datetime.utcnow() - timedelta(days=7))
    ).all()
    
    sent_count = 0
    for subscription in subscriptions:
        user = subscription.user
        
        # Get recent incentives matching filters
        incentives_query = db.query(Incentive).filter(
            Incentive.is_active == True,
            Incentive.created_at >= datetime.utcnow() - timedelta(days=7)
        )
        
        if subscription.builders_filter:
            incentives_query = incentives_query.filter(
                Incentive.builder_id.in_(subscription.builders_filter)
            )
        
        incentives = incentives_query.limit(20).all()
        
        if incentives and email_service.send_weekly_digest(user, incentives):
            subscription.last_sent_at = datetime.utcnow()
            db.commit()
            sent_count += 1
    
    return {"message": f"Sent {sent_count} digests"}
