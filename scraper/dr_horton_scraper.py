from base_scraper import BaseScraper
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DRHortonScraper(BaseScraper):
    BASE_URL = "https://www.drhorton.com"
    
    def scrape_communities(self) -> List[Dict[str, Any]]:
        """Scrape D.R. Horton communities"""
        try:
            soup = self.fetch_page(f"{self.BASE_URL}/communities")
            if not soup:
                return []
            
            communities = []
            # Parse community listings
            for community_card in soup.find_all('div', class_='community-card'):
                name = community_card.find('h3')
                if name:
                    communities.append({
                        'name': name.text.strip(),
                        'city': community_card.find(class_='city')?.text.strip() or '',
                        'state': community_card.find(class_='state')?.text.strip() or '',
                    })
            
            logger.info(f"Scraped {len(communities)} D.R. Horton communities")
            return communities
        except Exception as e:
            logger.error(f"Error scraping D.R. Horton communities: {str(e)}")
            return []
    
    def scrape_incentives(self, community_url: str) -> List[Dict[str, Any]]:
        """Scrape incentives from community page"""
        try:
            soup = self.fetch_page(community_url)
            if not soup:
                return []
            
            incentives = []
            # Parse incentive sections
            for incentive_block in soup.find_all('div', class_='incentive'):
                incentive_type = incentive_block.find(class_='incentive-type')?.text.strip()
                incentive_value = incentive_block.find(class_='incentive-value')?.text.strip()
                
                if incentive_type and incentive_value:
                    incentives.append({
                        'type': incentive_type,
                        'value': self._parse_value(incentive_value),
                        'description': incentive_block.find(class_='incentive-desc')?.text.strip() or '',
                    })
            
            return incentives
        except Exception as e:
            logger.error(f"Error scraping incentives: {str(e)}")
            return []
    
    def scrape_inventory(self, community_url: str) -> List[Dict[str, Any]]:
        """Scrape QMI homes from community page"""
        try:
            soup = self.fetch_page(community_url)
            if not soup:
                return []
            
            inventory = []
            # Parse inventory listings
            for home_card in soup.find_all('div', class_='home-card'):
                address = home_card.find(class_='home-address')?.text.strip()
                price = home_card.find(class_='home-price')?.text.strip()
                beds = home_card.find(class_='beds')?.text.strip()
                
                if address:
                    inventory.append({
                        'address': address,
                        'price': self._parse_value(price) if price else None,
                        'bedrooms': int(beds.split()[0]) if beds else None,
                        'status': 'available',
                    })
            
            return inventory
        except Exception as e:
            logger.error(f"Error scraping inventory: {str(e)}")
            return []
    
    @staticmethod
    def _parse_value(value_str: str) -> float | None:
        """Parse currency values from strings"""
        try:
            # Remove common currency symbols and separators
            cleaned = value_str.replace('$', '').replace(',', '').strip()
            # Handle ranges (e.g., "10,000 - 15,000")
            if '-' in cleaned:
                values = [float(v.strip()) for v in cleaned.split('-')]
                return sum(values) / len(values)  # Return average
            return float(cleaned)
        except:
            return None
