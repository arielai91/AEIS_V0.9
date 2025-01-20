import os


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'sqlite:///database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv(
        'MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USE_SSL = os.getenv(
        'MAIL_USE_SSL', 'false').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MONGO_URI = os.getenv('MONGO_URI',
        'mongodb://localhost:27017/test')
    SCHEDULER_API_ENABLED = os.getenv(
        'SCHEDULER_API_ENABLED', 'true').lower() in ['true', 'on', '1']
    DEBUG = os.getenv(
        'FLASK_DEBUG', 'false').lower() in ['true', 'on', '1']
