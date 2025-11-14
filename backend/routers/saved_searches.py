from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import SavedSearch, User
from schemas import SavedSearchCreate, SavedSearchResponse
from security import get_current_user
from uuid import UUID
from typing import List

router = APIRouter(prefix="/saved-searches")

@router.post("/", response_model=SavedSearchResponse)
async def create_saved_search(
    search_data: SavedSearchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_search = SavedSearch(
        user_id=current_user.id,
        name=search_data.name,
        filters=search_data.filters,
        is_alert_enabled=search_data.is_alert_enabled
    )
    db.add(saved_search)
    db.commit()
    db.refresh(saved_search)
    return saved_search

@router.get("/", response_model=List[SavedSearchResponse])
async def list_saved_searches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    searches = db.query(SavedSearch).filter(
        SavedSearch.user_id == current_user.id
    ).all()
    return searches

@router.delete("/{search_id}")
async def delete_saved_search(
    search_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    search = db.query(SavedSearch).filter(
        SavedSearch.id == search_id,
        SavedSearch.user_id == current_user.id
    ).first()
    
    if not search:
        raise HTTPException(status_code=404, detail="Saved search not found")
    
    db.delete(search)
    db.commit()
    return {"message": "Saved search deleted"}
