from base_scraper import BaseScraper
from typing import List, Dict, Any
import logging
import re
from datetime import datetime

logger = logging.getLogger(__name__)

class MIHomesScraper(BaseScraper):
    """Scraper for M/I Homes Indiana"""
    
    BASE_URL = "https://www.mihomes.com/new-homes/indiana"
    INCENTIVES_URL = "https://www.mihomes.com/new-homes/indiana/indianapolis-metro/incentives"
    
    def scrape_communities(self) -> List[Dict[str, Any]]:
        """Scrape M/I Homes communities"""
        try:
            communities = []
            
            soup = self.fetch_page(f"{self.BASE_URL}/indianapolis-metro")
            if not soup:
                return communities
            
            # Extract community listings
            community_links = soup.find_all('a', class_=re.compile('community'))
            
            for link in community_links:
                try:
                    name = link.get_text(strip=True)
                    href = link.get('href', '')
                    
                    if name and 'indianapolis' in href.lower():
                        communities.append({
                            'name': name,
                            'city': 'Indianapolis',
                            'state': 'IN',
                            'status': 'active'
                        })
                except Exception as e:
                    logger.warning(f"Error parsing M/I community: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(communities)} M/I Homes communities")
            return communities
            
        except Exception as e:
            logger.error(f"Error scraping M/I Homes communities: {str(e)}")
            return []
    
    def scrape_incentives(self, community_url: str = None) -> List[Dict[str, Any]]:
        """Scrape M/I Homes incentives"""
        try:
            incentives = []
            
            soup = self.fetch_page(self.INCENTIVES_URL)
            if not soup:
                return incentives
            
            # Find incentive sections
            incentive_blocks = soup.find_all(['div', 'section'], class_=re.compile('incentive|offer|promotion'))
            
            for block in incentive_blocks:
                try:
                    text = block.get_text(separator=' ', strip=True)
                    
                    # Parse rate buydown
                    if 'rate' in text.lower() or 'buydown' in text.lower():
                        rate_match = re.search(r'(\d+\.?\d*)\s*%', text)
                        if rate_match:
                            incentives.append({
                                'type': 'Rate Buydown',
                                'value': float(rate_match.group(1)),
                                'value_type': 'percent',
                                'description': text[:150],
                                'conditions': 'FHA or Conventional loans',
                                'lender_requirements': 'M/I Financial, LLC'
                            })
                    
                    # Parse special offers
                    if 'special' in text.lower() or 'financing' in text.lower():
                        rate_match = re.search(r'(\d+\.?\d*)\s*%', text)
                        if rate_match:
                            incentives.append({
                                'type': 'Special Rate Offer',
                                'value': float(rate_match.group(1)),
                                'value_type': 'percent',
                                'description': text[:150],
                                'conditions': 'Select communities only'
                            })
                except Exception as e:
                    logger.warning(f"Error parsing M/I incentive: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(incentives)} M/I Homes incentives")
            return incentives
            
        except Exception as e:
            logger.error(f"Error scraping M/I Homes incentives: {str(e)}")
            return []
    
    def scrape_inventory(self, community_url: str = None) -> List[Dict[str, Any]]:
        """Scrape M/I Homes inventory"""
        try:
            inventory = []
            
            soup = self.fetch_page(f"{self.BASE_URL}/indianapolis-metro")
            if not soup:
                return inventory
            
            # Find home listings
            home_cards = soup.find_all(['div', 'article'], class_=re.compile('home|listing|property'))
            
            for card in home_cards:
                try:
                    text = card.get_text(separator=' ', strip=True)
                    
                    # Extract address
                    address_elem = card.find(class_=re.compile('address'))
                    address = address_elem.get_text(strip=True) if address_elem else None
                    
                    if not address:
                        continue
                    
                    # Extract price
                    price_elem = card.find(class_=re.compile('price'))
                    price_text = price_elem.get_text(strip=True) if price_elem else None
                    price = self.parse_currency(price_text) if price_text else None
                    
                    # Extract specs
                    bed_match = re.search(r'(\d+)\s*(?:bed|br)', text, re.I)
                    bath_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:bath|ba)', text, re.I)
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
                    logger.warning(f"Error parsing M/I home: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(inventory)} M/I Homes listings")
            return inventory
            
        except Exception as e:
            logger.error(f"Error scraping M/I Homes inventory: {str(e)}")
            return []
