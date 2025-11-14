from celery import shared_task
from celery_app import celery_app
from dr_horton_scraper import DRHortonScraper
from lennar_scraper import LennarScraper
from mi_homes_scraper import MIHomesScraper
from arbor_homes_scraper import ArborHomesScraper
from database import SessionLocal
from models import Builder, ScraperLog
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def scrape_builder(self, builder_id: str, builder_name: str):
    """Celery task to scrape builder data"""
    db = SessionLocal()
    log = None
    
    try:
        log = ScraperLog(
            builder_id=builder_id,
            status='started',
            started_at=datetime.utcnow()
        )
        db.add(log)
        db.commit()
        
        # Route to appropriate scraper
        scraper = None
        builder_lower = builder_name.lower()
        
        if 'dr horton' in builder_lower or 'drhorton' in builder_lower:
            scraper = DRHortonScraper(builder_id, builder_name)
        elif 'lennar' in builder_lower:
            scraper = LennarScraper(builder_id, builder_name)
        elif 'm/i homes' in builder_lower or 'mi homes' in builder_lower:
            scraper = MIHomesScraper(builder_id, builder_name)
        elif 'arbor' in builder_lower:
            scraper = ArborHomesScraper(builder_id, builder_name)
        else:
            raise ValueError(f"No scraper configured for {builder_name}")
        
        logger.info(f"Starting scrape for {builder_name}")
        
        # Run scraping
        communities = scraper.scrape_communities()
        incentives = []
        inventory = []
        
        # Scrape incentives and inventory
        for community in communities:
            try:
                community_incentives = scraper.scrape_incentives()
                incentives.extend(community_incentives)
                
                community_inventory = scraper.scrape_inventory()
                inventory.extend(community_inventory)
            except Exception as e:
                logger.warning(f"Error scraping community {community}: {str(e)}")
                continue
        
        # Sync to database
        created, updated = scraper.sync_to_database(communities, incentives, inventory)
        
        # Update builder
        builder = db.query(Builder).filter(Builder.id == builder_id).first()
        if builder:
            builder.last_scraped_at = datetime.utcnow()
            db.commit()
        
        # Update log
        log.status = 'success'
        log.items_created = created
        log.items_updated = updated
        log.completed_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Successfully scraped {builder_name}: {created} created, {updated} updated")
        return {"status": "success", "created": created, "updated": updated}
        
    except Exception as e:
        if log:
            log.status = 'failed'
            log.error_message = str(e)
            log.completed_at = datetime.utcnow()
            db.commit()
        
        logger.error(f"Error scraping {builder_name}: {str(e)}")
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))
    
    finally:
        db.close()


@shared_task
def run_all_scrapers():
    """Schedule scraping for all active builders"""
    db = SessionLocal()
    try:
        builders = db.query(Builder).filter(Builder.is_active == True).all()
        logger.info(f"Starting scheduled scrape for {len(builders)} builders")
        for builder in builders:
            scrape_builder.delay(str(builder.id), builder.name)
    finally:
        db.close()
