from apscheduler.schedulers.background import BackgroundScheduler
from app.services import clean_expired_code


def start_scheduler():
    """clean_expired_code cada 10 minutos."""
    scheduler = BackgroundScheduler()
    scheduler.add_job(clean_expired_code, 'interval', minutes=10)
    scheduler.start()
