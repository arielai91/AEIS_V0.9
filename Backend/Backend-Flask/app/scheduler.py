from apscheduler.schedulers.background import BackgroundScheduler
from app.services import clean_expired_code


def start_scheduler(app):
    """clean_expired_code cada 10 minutos."""
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: clean_expired_code(app), 'interval', minutes=30)
    scheduler.start()
