from base_scraper import BaseScraper
from typing import List, Dict, Any
import logging
import re
from datetime import datetime

logger = logging.getLogger(__name__)

class ArborHomesScraper(BaseScraper):
    """Scraper for Arbor Homes Indiana"""
    
    BASE_URL = "https://www.yourarborhome.com"
    INCENTIVES_URL = "https://www.yourarborhome.com/indianapolis-incentives"
    
    def scrape_communities(self) -> List[Dict[str, Any]]:
        """Scrape Arbor Homes communities"""
        try:
            communities = []
            
            soup = self.fetch_page(f"{self.BASE_URL}/new-homes/indiana/indianapolis")
            if not soup:
                return communities
            
            # Extract community data
            community_elements = soup.find_all(['div', 'a'], class_=re.compile('community'))
            
            for elem in community_elements:
                try:
                    name = elem.get_text(strip=True)
                    if name and len(name) > 2:
                        communities.append({
                            'name': name,
                            'city': 'Indianapolis',
                            'state': 'IN',
                            'status': 'active'
                        })
                except Exception as e:
                    logger.warning(f"Error parsing Arbor community: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(communities)} Arbor Homes communities")
            return communities
            
        except Exception as e:
            logger.error(f"Error scraping Arbor Homes communities: {str(e)}")
            return []
    
    def scrape_incentives(self, community_url: str = None) -> List[Dict[str, Any]]:
        """Scrape Arbor Homes incentives"""
        try:
            incentives = []
            
            soup = self.fetch_page(self.INCENTIVES_URL)
            if not soup:
                return incentives
            
            # Extract incentive cards
            incentive_cards = soup.find_all(['div', 'a'], class_=re.compile('incentive'))
            
            for card in incentive_cards:
                try:
                    text = card.get_text(separator=' ', strip=True)
                    title = card.find(['h2', 'h3', 'p'])
                    
                    # $500 Down
                    if '500' in text and 'down' in text.lower():
                        incentives.append({
                            'type': 'Down Payment Assistance',
                            'value': 500,
                            'value_type': 'dollar',
                            'description': '$500 Down Gets You Started',
                            'conditions': 'Only $500 down to begin building'
                        })
                    
                    # Rate Lock
                    if 'rate' in text.lower() and 'lock' in text.lower():
                        incentives.append({
                            'type': 'Rate Lock',
                            'value': 6,
                            'value_type': 'months',
                            'description': 'Lock In Your Rate for 6 Months',
                            'conditions': 'Extended rate lock with Silverton Mortgage',
                            'lender_requirements': 'Conventional, FHA, VA, USDA loans'
                        })
                    
                    # Special Rate Offer
                    rate_match = re.search(r'(\d+\.?\d*)\s*%', text)
                    if rate_match and '549' in text:
                        incentives.append({
                            'type': 'Special Rate Offer',
                            'value': float(rate_match.group(1)),
                            'value_type': 'percent',
                            'description': f"{rate_match.group(1)}% Special Offer",
                            'conditions': 'Select communities only'
                        })
                except Exception as e:
                    logger.warning(f"Error parsing Arbor incentive: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(incentives)} Arbor Homes incentives")
            return incentives
            
        except Exception as e:
            logger.error(f"Error scraping Arbor Homes incentives: {str(e)}")
            return []
    
    def scrape_inventory(self, community_url: str = None) -> List[Dict[str, Any]]:
        """Scrape Arbor Homes inventory"""
        try:
            inventory = []
            
            soup = self.fetch_page(f"{self.BASE_URL}/new-homes/indiana/indianapolis")
            if not soup:
                return inventory
            
            # Find available homes
            home_cards = soup.find_all(['div', 'article'], class_=re.compile('home|listing'))
            
            for card in home_cards:
                try:
                    text = card.get_text(separator=' ', strip=True)
                    
                    # Extract address
                    address_elem = card.find(class_=re.compile('address'))
                    address = address_elem.get_text(strip=True) if address_elem else None
                    
                    if not address:
                        continue
                    
                    # Extract price
                    price_text = re.search(r'\$\d+,?\d*', text)
                    price = self.parse_currency(price_text.group(0)) if price_text else None
                    
                    # Extract specs
                    bed_match = re.search(r'(\d+)\s*(?:bed|br)', text, re.I)
                    bath_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:bath|ba)', text, re.I)
                    
                    inventory.append({
                        'address': address,
                        'price': price,
                        'bedrooms': int(bed_match.group(1)) if bed_match else None,
                        'bathrooms': float(bath_match.group(1)) if bath_match else None,
                        'status': 'available',
                        'city': 'Indianapolis',
                        'state': 'IN'
                    })
                except Exception as e:
                    logger.warning(f"Error parsing Arbor home: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(inventory)} Arbor Homes listings")
            return inventory
            
        except Exception as e:
            logger.error(f"Error scraping Arbor Homes inventory: {str(e)}")
            return []
