from celery.schedules import crontab
from celery_app import celery_app

celery_app.conf.beat_schedule = {
    'run-scrapers-daily': {
        'task': 'scraper.tasks.run_all_scrapers',
        'schedule': crontab(hour=2, minute=0),  # 2 AM UTC daily
    },
    'run-scrapers-weekly': {
        'task': 'scraper.tasks.run_all_scrapers',
        'schedule': crontab(hour=3, minute=0, day_of_week=0),  # Sunday 3 AM UTC
    },
}
