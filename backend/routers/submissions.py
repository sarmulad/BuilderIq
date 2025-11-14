from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/submissions")

@router.post("/")
async def create_submission(db: Session = Depends(get_db)):
    pass
