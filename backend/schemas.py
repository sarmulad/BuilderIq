from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    role: str
    subscription_tier: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Incentive schemas
class IncentiveBase(BaseModel):
    type: str
    value: Optional[float] = None
    value_type: Optional[str] = None
    description: Optional[str] = None
    lender_requirements: Optional[str] = None
    conditions: Optional[str] = None
    expiration_date: Optional[datetime] = None

class IncentiveCreate(IncentiveBase):
    community_id: UUID
    builder_id: UUID

class BuilderSummary(BaseModel):
    id: UUID
    name: str
    logo_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class CommunitySummary(BaseModel):
    id: UUID
    name: str
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    
    class Config:
        from_attributes = True

class IncentiveResponse(IncentiveBase):
    id: UUID
    community_id: UUID
    builder_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    builder: Optional[BuilderSummary] = None
    community: Optional[CommunitySummary] = None
    
    class Config:
        from_attributes = True

# Pagination
class PaginationParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(20, ge=1, le=100)

class PaginatedResponse(BaseModel):
    items: List
    total: int
    skip: int
    limit: int

# Saved search schemas
class SavedSearchCreate(BaseModel):
    name: str
    filters: dict
    is_alert_enabled: bool = False

class SavedSearchResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    filters: dict
    is_alert_enabled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Filter stats schema
class FilterStats(BaseModel):
    total_incentives: int
    builders: List[dict]
    cities: List[dict]
    types: List[dict]
    avg_value: Optional[float] = None
    expiring_soon_count: int

# Marketing content response schema
class MarketingContentResponse(BaseModel):
    incentive_id: str
    instagram: str
    facebook: str
    linkedin: str
    twitter: str
    email: str
    property_details: dict
