from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, UUID, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class ScraperLog(Base):
    __tablename__ = "scraper_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    builder_id = Column(UUID(as_uuid=True), nullable=False)
    status = Column(String(50), default="pending")
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    items_created = Column(Integer, default=0)
    items_updated = Column(Integer, default=0)
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Builder(Base):
    __tablename__ = "builders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    website_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    last_scraped_at = Column(DateTime)

class Community(Base):
    __tablename__ = "communities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    city = Column(String(100))
    state = Column(String(50))
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Incentive(Base):
    __tablename__ = "incentives"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    community_id = Column(UUID(as_uuid=True), ForeignKey("communities.id"))
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    type = Column(String(100), nullable=False)
    value = Column(Float)
    value_type = Column(String(50))
    description = Column(Text)
    conditions = Column(Text)
    lender_requirements = Column(Text)
    expiration_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    scraped_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    community_id = Column(UUID(as_uuid=True), ForeignKey("communities.id"))
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    address = Column(String(500))
    price = Column(Float)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    square_feet = Column(Integer)
    status = Column(String(50), default="available")
    city = Column(String(100))
    state = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
