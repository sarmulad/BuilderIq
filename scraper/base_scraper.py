from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import logging
import json
from config import settings
from database import SessionLocal
from models import Community, Incentive, Inventory, Builder, ScraperLog
import httpx
import asyncio

logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    """Base scraper with common functionality for all builders"""
    
    def __init__(self, builder_id: str, builder_name: str):
        self.builder_id = builder_id
        self.builder_name = builder_name
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.timeout = settings.SCRAPER_TIMEOUT
        self.max_retries = settings.MAX_RETRIES

    @abstractmethod
    def scrape_communities(self) -> List[Dict[str, Any]]:
        """Scrape community data from builder website"""
        pass

    @abstractmethod
    def scrape_incentives(self, community_url: str) -> List[Dict[str, Any]]:
        """Scrape incentive data for a community"""
        pass

    @abstractmethod
    def scrape_inventory(self, community_url: str) -> List[Dict[str, Any]]:
        """Scrape inventory/QMI homes data"""
        pass

    def fetch_page(self, url: str, retries: int = 0) -> Optional[BeautifulSoup]:
        """Fetch and parse HTML page with retry logic and error handling"""
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except requests.exceptions.Timeout:
            if retries < self.max_retries:
                logger.warning(f"Timeout retry {retries + 1} for {url}")
                return self.fetch_page(url, retries + 1)
            logger.error(f"Timeout after {self.max_retries} retries: {url}")
            return None
        except requests.exceptions.RequestException as e:
            if retries < self.max_retries:
                logger.warning(f"Request retry {retries + 1} for {url}: {str(e)}")
                return self.fetch_page(url, retries + 1)
            logger.error(f"Failed to fetch {url}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching {url}: {str(e)}")
            return None

    async def normalize_with_ai(self, raw_text: str, context: str = "incentive") -> Dict[str, Any]:
        """Use OpenAI to intelligently normalize messy builder marketing text"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            prompt = f"""You are an expert real estate data extraction system. 
            Extract and normalize the following builder marketing text into structured JSON.
            
            Context: {context}
            Text: {raw_text}
            
            For incentives, extract:
            - type (e.g., "Rate Buydown", "Closing Costs", "Bonus", "Free Upgrade", "QMI Discount")
            - value (numeric only)
            - value_type (e.g., "percent", "dollar", "points", "years")
            - description (clear summary)
            - conditions (any terms/limitations)
            - expiration_date (if mentioned, ISO format or null)
            - lender_requirements (if mentioned)
            
            Return ONLY valid JSON, no markdown:
            {{"type": "...", "value": 123.45, "value_type": "...", "description": "...", "conditions": "...", "expiration_date": null, "lender_requirements": "..."}}
            """
            
            response = await client.messages.create(
                model="gpt-4-turbo-preview",
                max_tokens=500,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse response
            content = response.content[0].text.strip()
            result = json.loads(content)
            return result
            
        except Exception as e:
            logger.error(f"AI normalization error: {str(e)}")
            return {}

    def normalize_incentive(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize raw incentive data to standard format"""
        return {
            'type': raw_data.get('type', 'Other'),
            'value': raw_data.get('value'),
            'value_type': raw_data.get('value_type', 'dollar'),
            'description': raw_data.get('description', ''),
            'lender_requirements': raw_data.get('lender_requirements'),
            'conditions': raw_data.get('conditions'),
            'expiration_date': raw_data.get('expiration_date'),
        }

    def parse_currency(self, value_str: str) -> Optional[float]:
        """Parse currency values from strings"""
        if not value_str:
            return None
        try:
            # Remove common currency symbols and separators
            cleaned = value_str.replace('$', '').replace(',', '').strip()
            # Handle percentage
            if '%' in cleaned:
                cleaned = cleaned.replace('%', '').strip()
            # Handle ranges (e.g., "10,000 - 15,000")
            if '-' in cleaned:
                values = [float(v.strip()) for v in cleaned.split('-')]
                return sum(values) / len(values)
            return float(cleaned)
        except (ValueError, AttributeError):
            return None

    def sync_to_database(self, communities: List[Dict], incentives: List[Dict], inventory: List[Dict]) -> tuple:
        """Sync scraped data to database with upsert logic"""
        db = SessionLocal()
        created = 0
        updated = 0

        try:
            # Sync communities
            for comm_data in communities:
                if not comm_data.get('name'):
                    continue
                    
                community = db.query(Community).filter(
                    Community.builder_id == self.builder_id,
                    Community.name == comm_data['name']
                ).first()

                if community:
                    for key, value in comm_data.items():
                        if value is not None:
                            setattr(community, key, value)
                    community.updated_at = datetime.utcnow()
                    updated += 1
                else:
                    comm_data['builder_id'] = self.builder_id
                    community = Community(**comm_data)
                    db.add(community)
                    created += 1

            db.commit()

            # Sync incentives
            for incentive_data in incentives:
                if not incentive_data.get('type'):
                    continue
                    
                incentive = db.query(Incentive).filter(
                    Incentive.builder_id == self.builder_id,
                    Incentive.type == incentive_data.get('type'),
                    Incentive.community_id == incentive_data.get('community_id')
                ).first()

                if incentive:
                    for key, value in incentive_data.items():
                        if value is not None:
                            setattr(incentive, key, value)
                    incentive.updated_at = datetime.utcnow()
                    incentive.scraped_at = datetime.utcnow()
                    updated += 1
                else:
                    incentive_data['builder_id'] = self.builder_id
                    incentive_data['scraped_at'] = datetime.utcnow()
                    incentive = Incentive(**incentive_data)
                    db.add(incentive)
                    created += 1

            db.commit()

            # Sync inventory
            for inv_data in inventory:
                if not inv_data.get('address'):
                    continue
                    
                inventory_item = db.query(Inventory).filter(
                    Inventory.builder_id == self.builder_id,
                    Inventory.address == inv_data.get('address')
                ).first()

                if inventory_item:
                    for key, value in inv_data.items():
                        if value is not None:
                            setattr(inventory_item, key, value)
                    inventory_item.updated_at = datetime.utcnow()
                    updated += 1
                else:
                    inv_data['builder_id'] = self.builder_id
                    inventory_item = Inventory(**inv_data)
                    db.add(inventory_item)
                    created += 1

            db.commit()
            logger.info(f"Database sync: {created} created, {updated} updated")
            return created, updated

        except Exception as e:
            db.rollback()
            logger.error(f"Database sync error: {str(e)}")
            raise
        finally:
            db.close()
