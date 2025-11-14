from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Incentive, Community, Builder, Inventory
from schemas import MarketingContentResponse
from uuid import UUID
from typing import Optional
import openai
from config import settings

router = APIRouter(prefix="/marketing")

openai.api_key = settings.OPENAI_API_KEY

@router.post("/generate/{incentive_id}", response_model=MarketingContentResponse)
async def generate_marketing_content(
    incentive_id: UUID,
    db: Session = Depends(get_db)
):
    """Generate platform-specific marketing content for an incentive"""
    
    # Fetch the incentive with all related data
    incentive = db.query(Incentive).filter(Incentive.id == incentive_id).first()
    if not incentive:
        raise HTTPException(status_code=404, detail="Incentive not found")
    
    community = db.query(Community).filter(Community.id == incentive.community_id).first()
    builder = db.query(Builder).filter(Builder.id == incentive.builder_id).first()
    
    # Get sample inventory from this community
    inventory = db.query(Inventory).filter(
        Inventory.community_id == community.id
    ).first()
    
    # Build context for AI
    context = f"""
    Builder: {builder.name}
    Community: {community.name}
    Location: {community.city}, {community.state}
    Incentive Type: {incentive.type}
    Incentive Value: ${incentive.value:,.0f} if incentive.value else 'varies'
    Description: {incentive.description}
    Lender Requirements: {incentive.lender_requirements or 'None'}
    Expiration: {incentive.expiration_date.strftime('%B %d, %Y') if incentive.expiration_date else 'Limited time'}
    """
    
    if inventory:
        context += f"""
    Sample Home: {inventory.plan_name}
    Price: ${inventory.price:,.0f}
    Bedrooms: {inventory.bedrooms}
    Bathrooms: {inventory.bathrooms}
    Square Feet: {inventory.square_feet:,.0f}
    """
    
    # Generate content for each platform using OpenAI
    try:
        # Instagram Post (visual, hashtags, brief)
        instagram_response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional real estate social media marketer. Create engaging, visual-focused Instagram content with appropriate hashtags."},
                {"role": "user", "content": f"Create an Instagram post for this builder incentive:\n{context}\n\nMake it engaging, use emojis, include 5-10 relevant hashtags. Keep it under 150 words."}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        # Facebook Post (detailed, community-focused)
        facebook_response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional real estate marketer. Create detailed, community-focused Facebook posts."},
                {"role": "user", "content": f"Create a Facebook post for this builder incentive:\n{context}\n\nMake it informative, friendly, and include a clear call-to-action. 150-200 words."}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        # LinkedIn Post (professional, value-focused)
        linkedin_response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional real estate marketer. Create professional, value-focused LinkedIn posts."},
                {"role": "user", "content": f"Create a LinkedIn post for this builder incentive:\n{context}\n\nMake it professional, focus on investment value and market opportunity. 100-150 words."}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        # Twitter/X Post (concise, attention-grabbing)
        twitter_response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional real estate marketer. Create concise, attention-grabbing Twitter/X posts."},
                {"role": "user", "content": f"Create a Twitter/X post for this builder incentive:\n{context}\n\nMake it concise (under 280 characters), attention-grabbing, include 2-3 hashtags."}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        # Email Template (professional, detailed)
        email_response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional real estate marketer. Create professional email templates."},
                {"role": "user", "content": f"Create an email template for this builder incentive:\n{context}\n\nInclude subject line, greeting, body with bullet points highlighting key benefits, and professional closing. 200-300 words."}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return MarketingContentResponse(
            incentive_id=str(incentive_id),
            instagram=instagram_response.choices[0].message.content.strip(),
            facebook=facebook_response.choices[0].message.content.strip(),
            linkedin=linkedin_response.choices[0].message.content.strip(),
            twitter=twitter_response.choices[0].message.content.strip(),
            email=email_response.choices[0].message.content.strip(),
            property_details={
                "builder": builder.name,
                "community": community.name,
                "location": f"{community.city}, {community.state}",
                "incentive_type": incentive.type,
                "incentive_value": float(incentive.value) if incentive.value else None,
                "expiration": incentive.expiration_date.isoformat() if incentive.expiration_date else None
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")
