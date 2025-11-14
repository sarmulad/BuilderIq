from base_scraper import BaseScraper
from typing import List, Dict, Any
import logging
import re
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class LennarScraper(BaseScraper):
    """Scraper for Lennar homes Indiana"""
    
    BASE_URL = "https://www.lennar.com/new-homes/indiana"
    PROMO_URLS = [
        "https://www.lennar.com/new-homes/indiana/indianapolis/promo/indlen_bf125",
        "https://www.lennar.com/new-homes/indiana/indianapolis/promo/indlen_newnow25",
    ]
    
    def scrape_communities(self) -> List[Dict[str, Any]]:
        """Scrape all Lennar communities in Indiana"""
        try:
            communities = []
            
            # Scrape from search page
            soup = self.fetch_page(f"{self.BASE_URL}/indianapolis")
            if not soup:
                return communities
            
            # Extract community data from page
            community_sections = soup.find_all('div', class_=re.compile('community|community-card'))
            
            for section in community_sections:
                try:
                    name_elem = section.find(['h2', 'h3', 'a'])
                    if name_elem:
                        name = name_elem.get_text(strip=True)
                        
                        # Extract city from various possible locations
                        city_elem = section.find(class_=re.compile('city|location'))
                        city = city_elem.get_text(strip=True) if city_elem else "Indianapolis"
                        
                        communities.append({
                            'name': name,
                            'city': city,
                            'state': 'IN',
                            'status': 'active'
                        })
                except Exception as e:
                    logger.warning(f"Error parsing community: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(communities)} Lennar communities")
            return communities
            
        except Exception as e:
            logger.error(f"Error scraping Lennar communities: {str(e)}")
            return []
    
    def scrape_incentives(self, community_url: str = None) -> List[Dict[str, Any]]:
        """Scrape Lennar promotions and incentives"""
        try:
            incentives = []
            
            # Scrape all promotion pages
            for promo_url in self.PROMO_URLS:
                soup = self.fetch_page(promo_url)
                if not soup:
                    continue
                
                # Extract main promotion blocks
                promo_blocks = soup.find_all(['div', 'section'], class_=re.compile('promo|incentive|offer'))
                
                for block in promo_blocks:
                    try:
                        # Get promotion text
                        text = block.get_text(separator=' ', strip=True)
                        
                        # Look for specific patterns
                        if 'rate' in text.lower() or 'apr' in text.lower():
                            rate_match = re.search(r'(\d+\.?\d*)\s*%.*?$$(\d+\.?\d*)\s*%\s*APR$$', text)
                            if rate_match:
                                incentives.append({
                                    'type': 'Rate Buydown',
                                    'value': float(rate_match.group(1)),
                                    'value_type': 'percent',
                                    'description': f"{rate_match.group(1)}% Rate ({rate_match.group(2)}% APR)",
                                    'conditions': self._extract_conditions(text),
                                    'expiration_date': self._extract_expiration(text)
                                })
                        
                        if 'closing' in text.lower() or '$' in text:
                            dollar_match = re.search(r'\$(\d+,?\d*)', text)
                            if dollar_match:
                                value = int(dollar_match.group(1).replace(',', ''))
                                incentives.append({
                                    'type': 'Closing Costs' if 'closing' in text.lower() else 'Bonus',
                                    'value': value,
                                    'value_type': 'dollar',
                                    'description': text[:150],
                                    'conditions': self._extract_conditions(text),
                                    'expiration_date': self._extract_expiration(text)
                                })
                        
                        if 'washer' in text.lower() or 'dryer' in text.lower():
                            incentives.append({
                                'type': 'Free Upgrade',
                                'value': 1200,
                                'value_type': 'dollar',
                                'description': 'Free Washer & Dryer',
                                'conditions': self._extract_conditions(text),
                                'expiration_date': self._extract_expiration(text)
                            })
                    except Exception as e:
                        logger.warning(f"Error parsing incentive block: {str(e)}")
                        continue
            
            logger.info(f"Scraped {len(incentives)} Lennar incentives")
            return incentives
            
        except Exception as e:
            logger.error(f"Error scraping Lennar incentives: {str(e)}")
            return []
    
    def scrape_inventory(self, community_url: str = None) -> List[Dict[str, Any]]:
        """Scrape Lennar QMI homes"""
        try:
            inventory = []
            
            soup = self.fetch_page(f"{self.BASE_URL}/indianapolis/promo/indlen_bf125")
            if not soup:
                return inventory
            
            # Find home listings
            home_cards = soup.find_all(['div', 'article'], class_=re.compile('home|property|listing'))
            
            for card in home_cards:
                try:
                    # Extract address
                    address_elem = card.find(class_=re.compile('address|location'))
                    address = address_elem.get_text(strip=True) if address_elem else None
                    
                    if not address:
                        continue
                    
                    # Extract price
                    price_elem = card.find(class_=re.compile('price|cost'))
                    price_text = price_elem.get_text(strip=True) if price_elem else None
                    price = self.parse_currency(price_text) if price_text else None
                    
                    # Extract bedrooms/bathrooms
                    text = card.get_text(separator=' ', strip=True)
                    bed_match = re.search(r'(\d+)\s*(?:bed|br|bedroom)', text, re.I)
                    bath_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:bath|ba|bathroom)', text, re.I)
                    
                    # Extract square footage
                    sqft_match = re.search(r'(\d+,?\d*)\s*(?:sq\.?ft|sqft)', text, re.I)
                    
                    inventory.append({
                        'address': address,
                        'price': price,
                        'bedrooms': int(bed_match.group(1)) if bed_match else None,
                        'bathrooms': float(bath_match.group(1)) if bath_match else None,
                        'square_feet': int(sqft_match.group(1).replace(',', '')) if sqft_match else None,
                        'status': 'available',
                        'city': 'Indianapolis',
                        'state': 'IN'
                    })
                except Exception as e:
                    logger.warning(f"Error parsing home card: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(inventory)} Lennar homes")
            return inventory
            
        except Exception as e:
            logger.error(f"Error scraping Lennar inventory: {str(e)}")
            return []
    
    def _extract_conditions(self, text: str) -> str:
        """Extract conditions from promotional text"""
        if 'select' in text.lower():
            return "Available on select homes"
        if 'purchase agreement' in text.lower():
            return "Requires signed purchase agreement"
        return None
    
    def _extract_expiration(self, text: str) -> datetime:
        """Extract expiration date from text"""
        try:
            # Look for date patterns like "11/30/25" or "November 30, 2025"
            date_patterns = [
                r'(\d{1,2})/(\d{1,2})/(\d{2,4})',  # MM/DD/YY
                r'([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})',  # Month DD, YYYY
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, text)
                if match:
                    # Try parsing
                    pass
        except:
            pass
        
        return None
