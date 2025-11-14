from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, UUID, ForeignKey, ARRAY, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    company_name = Column(String(255))
    phone = Column(String(20))
    role = Column(String(50), default="user")
    subscription_tier = Column(String(50), default="free")
    subscription_started_at = Column(DateTime)
    subscription_expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("EmailSubscription", back_populates="user", cascade="all, delete-orphan")
    saved_searches = relationship("SavedSearch", back_populates="user", cascade="all, delete-orphan")

class Builder(Base):
    __tablename__ = "builders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    logo_url = Column(String(500))
    website_url = Column(String(500))
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    data_source = Column(String(50), default="scraper")
    last_scraped_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    communities = relationship("Community", back_populates="builder", cascade="all, delete-orphan")
    incentives = relationship("Incentive", back_populates="builder", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="builder", cascade="all, delete-orphan")

class Community(Base):
    __tablename__ = "communities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(10))
    county = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String(50), default="active")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    builder = relationship("Builder", back_populates="communities")
    incentives = relationship("Incentive", back_populates="community", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="community", cascade="all, delete-orphan")

class Incentive(Base):
    __tablename__ = "incentives"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    community_id = Column(UUID(as_uuid=True), ForeignKey("communities.id"), nullable=False)
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    type = Column(String(100), nullable=False)
    value = Column(Float)
    value_type = Column(String(50))
    description = Column(Text)
    lender_requirements = Column(Text)
    conditions = Column(Text)
    expiration_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    scraped_at = Column(DateTime)
    
    # Relationships
    builder = relationship("Builder", back_populates="incentives")
    community = relationship("Community", back_populates="incentives")
    favorites = relationship("Favorite", back_populates="incentive", cascade="all, delete-orphan")

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    community_id = Column(UUID(as_uuid=True), ForeignKey("communities.id"), nullable=False)
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    address = Column(String(500))
    lot_number = Column(String(50))
    model_name = Column(String(255))
    square_feet = Column(Integer)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    garage_spaces = Column(Integer)
    status = Column(String(50), default="available")
    price = Column(Float)
    estimated_completion = Column(DateTime)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    builder = relationship("Builder", back_populates="inventory")
    community = relationship("Community", back_populates="inventory")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    incentive_id = Column(UUID(as_uuid=True), ForeignKey("incentives.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    incentive = relationship("Incentive", back_populates="favorites")

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    builder_id = Column(UUID(as_uuid=True), ForeignKey("builders.id"), nullable=False)
    community_id = Column(UUID(as_uuid=True), ForeignKey("communities.id"))
    type = Column(String(100), nullable=False)
    value = Column(Float)
    description = Column(Text)
    status = Column(String(50), default="pending")
    rejection_reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = Column(DateTime)
    approved_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Relationships
    user = relationship("User", back_populates="submissions")

class EmailSubscription(Base):
    __tablename__ = "email_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    subscription_type = Column(String(50), default="weekly")
    builders_filter = Column(ARRAY(String))
    cities_filter = Column(ARRAY(String))
    last_sent_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")

class SavedSearch(Base):
    __tablename__ = "saved_searches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    filters = Column(JSON, nullable=False)
    is_alert_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="saved_searches")
