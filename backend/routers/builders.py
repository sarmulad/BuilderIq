from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Builder

router = APIRouter(prefix="/builders")

@router.get("/")
async def list_builders(db: Session = Depends(get_db)):
    builders = db.query(Builder).filter(Builder.is_active == True).all()
    return [{"id": str(b.id), "name": b.name, "slug": b.slug} for b in builders]
