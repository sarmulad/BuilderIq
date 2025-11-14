from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from database import get_db
from models import Incentive, Favorite, Community, Builder, Inventory
from schemas import IncentiveResponse, PaginatedResponse, FilterStats
from uuid import UUID
from typing import Optional, List
from cache import cache
from datetime import datetime, timedelta
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/incentives")

@router.get("/", response_model=PaginatedResponse)
async def list_incentives(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Search in description, community name, city"),
    builder_id: Optional[str] = Query(None),
    builders: Optional[List[str]] = Query(None),
    city: Optional[str] = Query(None),
    cities: Optional[List[str]] = Query(None),
    incentive_type: Optional[str] = Query(None),
    incentive_types: Optional[List[str]] = Query(None),
    min_value: Optional[float] = Query(None, ge=0),
    max_value: Optional[float] = Query(None, ge=0),
    expiring_soon: Optional[bool] = Query(None),
    has_lender: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_sqft: Optional[int] = Query(None, ge=0),
    max_sqft: Optional[int] = Query(None, ge=0),
    bedrooms: Optional[int] = Query(None, ge=0),
    bathrooms: Optional[int] = Query(None, ge=0),
    sort_by: Optional[str] = Query("created_at", regex="^(created_at|value|expiration_date)$"),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(24, ge=1, le=100)
):
    # Generate cache key from all parameters
    cache_key = f"incentives:{search}:{builder_id}:{builders}:{city}:{cities}:{incentive_type}:{incentive_types}:{min_value}:{max_value}:{expiring_soon}:{has_lender}:{min_price}:{max_price}:{min_sqft}:{max_sqft}:{bedrooms}:{bathrooms}:{sort_by}:{sort_order}:{skip}:{limit}"
    
    # Try cache first
    cached_result = cache.get(cache_key)
    if cached_result:
        return cached_result
    
    # Base query with joins
    query = db.query(Incentive).join(Community).join(Builder).filter(Incentive.is_active == True)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Incentive.description.ilike(search_term),
                Community.name.ilike(search_term),
                Community.city.ilike(search_term),
                Builder.name.ilike(search_term)
            )
        )
    
    if builder_id:
        query = query.filter(Incentive.builder_id == UUID(builder_id))
    if builders:
        builder_uuids = [UUID(bid) for bid in builders]
        query = query.filter(Incentive.builder_id.in_(builder_uuids))
    
    if city:
        query = query.filter(Community.city.ilike(f"%{city}%"))
    if cities:
        city_filters = [Community.city.ilike(f"%{c}%") for c in cities]
        query = query.filter(or_(*city_filters))
    
    if incentive_type:
        query = query.filter(Incentive.type.ilike(f"%{incentive_type}%"))
    if incentive_types:
        type_filters = [Incentive.type.ilike(f"%{t}%") for t in incentive_types]
        query = query.filter(or_(*type_filters))
    
    if min_value is not None:
        query = query.filter(Incentive.value >= min_value)
    if max_value is not None:
        query = query.filter(Incentive.value <= max_value)
    
    if expiring_soon:
        thirty_days_from_now = datetime.utcnow() + timedelta(days=30)
        query = query.filter(
            and_(
                Incentive.expiration_date.isnot(None),
                Incentive.expiration_date <= thirty_days_from_now
            )
        )
    
    if has_lender is not None:
        if has_lender:
            query = query.filter(Incentive.lender_requirements.isnot(None))
        else:
            query = query.filter(Incentive.lender_requirements.is_(None))
    
    if any([min_price, max_price, min_sqft, max_sqft, bedrooms, bathrooms]):
        query = query.join(Inventory, Inventory.community_id == Community.id)
        
        if min_price is not None:
            query = query.filter(Inventory.price >= min_price)
        if max_price is not None:
            query = query.filter(Inventory.price <= max_price)
        if min_sqft is not None:
            query = query.filter(Inventory.square_feet >= min_sqft)
        if max_sqft is not None:
            query = query.filter(Inventory.square_feet <= max_sqft)
        if bedrooms is not None:
            query = query.filter(Inventory.bedrooms >= bedrooms)
        if bathrooms is not None:
            query = query.filter(Inventory.bathrooms >= bathrooms)
    
    if sort_by == "value":
        order_column = Incentive.value
    elif sort_by == "expiration_date":
        order_column = Incentive.expiration_date
    else:
        order_column = Incentive.created_at
    
    if sort_order == "asc":
        query = query.order_by(order_column.asc())
    else:
        query = query.order_by(order_column.desc())
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    result = PaginatedResponse(
        items=[IncentiveResponse.from_orm(item) for item in items],
        total=total,
        skip=skip,
        limit=limit
    )
    
    # Cache for 1 hour (3600 seconds)
    cache.set(cache_key, result.dict(), ttl=3600)
    
    return result

@router.get("/{incentive_id}", response_model=IncentiveResponse)
async def get_incentive(incentive_id: UUID, db: Session = Depends(get_db)):
    incentive = db.query(Incentive).filter(Incentive.id == incentive_id).first()
    if not incentive:
        raise HTTPException(status_code=404, detail="Incentive not found")
    return IncentiveResponse.from_orm(incentive)

@router.post("/{incentive_id}/favorite")
async def add_favorite(incentive_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.incentive_id == incentive_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited")
    
    favorite = Favorite(user_id=user_id, incentive_id=incentive_id)
    db.add(favorite)
    db.commit()
    
    return {"message": "Added to favorites"}

@router.delete("/{incentive_id}/favorite/{user_id}")
async def remove_favorite(incentive_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.incentive_id == incentive_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}

@router.get("/stats", response_model=FilterStats)
async def get_filter_stats(
    db: Session = Depends(get_db),
    builder_id: Optional[str] = Query(None),
    city: Optional[str] = Query(None)
):
    query = db.query(Incentive).filter(Incentive.is_active == True)
    
    if builder_id:
        query = query.filter(Incentive.builder_id == UUID(builder_id))
    if city:
        query = query.join(Community).filter(Community.city.ilike(f"%{city}%"))
    
    total = query.count()
    
    # Get builder distribution
    builder_stats = db.query(
        Builder.id, Builder.name, func.count(Incentive.id).label('count')
    ).join(Incentive).filter(Incentive.is_active == True).group_by(Builder.id, Builder.name).all()
    
    # Get city distribution
    city_stats = db.query(
        Community.city, func.count(Incentive.id).label('count')
    ).join(Incentive).filter(Incentive.is_active == True).group_by(Community.city).all()
    
    # Get type distribution
    type_stats = db.query(
        Incentive.type, func.count(Incentive.id).label('count')
    ).filter(Incentive.is_active == True).group_by(Incentive.type).all()
    
    # Average value
    avg_value = db.query(func.avg(Incentive.value)).filter(
        Incentive.is_active == True,
        Incentive.value.isnot(None)
    ).scalar()
    
    # Expiring soon count
    thirty_days = datetime.utcnow() + timedelta(days=30)
    expiring_count = query.filter(
        Incentive.expiration_date.isnot(None),
        Incentive.expiration_date <= thirty_days
    ).count()
    
    return FilterStats(
        total_incentives=total,
        builders=[{"id": str(b.id), "name": b.name, "count": b.count} for b in builder_stats],
        cities=[{"name": c.city, "count": c.count} for c in city_stats if c.city],
        types=[{"name": t.type, "count": t.count} for t in type_stats],
        avg_value=float(avg_value) if avg_value else None,
        expiring_soon_count=expiring_count
    )

@router.get("/export")
async def export_incentives(
    db: Session = Depends(get_db),
    builder_id: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    incentive_type: Optional[str] = Query(None)
):
    query = db.query(Incentive).join(Community).join(Builder).filter(Incentive.is_active == True)
    
    if builder_id:
        query = query.filter(Incentive.builder_id == UUID(builder_id))
    if city:
        query = query.filter(Community.city.ilike(f"%{city}%"))
    if incentive_type:
        query = query.filter(Incentive.type.ilike(f"%{incentive_type}%"))
    
    incentives = query.all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow([
        'Builder', 'Community', 'City', 'State', 'Type', 'Value',
        'Description', 'Lender Requirements', 'Expiration Date', 'Created At'
    ])
    
    for inc in incentives:
        writer.writerow([
            inc.builder.name,
            inc.community.name,
            inc.community.city,
            inc.community.state,
            inc.type,
            inc.value,
            inc.description,
            inc.lender_requirements,
            inc.expiration_date.isoformat() if inc.expiration_date else '',
            inc.created_at.isoformat()
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=incentives.csv"}
    )
