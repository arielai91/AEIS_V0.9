import os


class Config:
    # Seguridad
    SECRET_KEY = os.getenv('SECRET_KEY') or 'my_secret_key'

    # Base de datos
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL') or 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MONGO_URI = os.getenv('MONGO_URI') or 'mongodb://localhost:27017/test'

    # Configuración de email
    MAIL_SERVER = os.getenv('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.getenv('MAIL_PORT') or 587)
    MAIL_USE_TLS = (os.getenv(
        'MAIL_USE_TLS') or 'true').lower() in ['true', 'on', '1']
    MAIL_USE_SSL = (os.getenv(
        'MAIL_USE_SSL') or 'false').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.getenv('MAIL_USERNAME') or None
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD') or None
    MAIL_DEFAULT_SENDER = os.getenv(
        'MAIL_DEFAULT_SENDER') or 'tu_correo@gmail.com'

    # Configuración de entorno
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'  # Activa DEBUG

    # Configuración adicional
    SCHEDULER_API_ENABLED = (os.getenv(
        'SCHEDULER_API_ENABLED') or 'true').lower() in ['true', 'on', '1']
    SCHEDULER_RUN_MAIN = os.getenv("WERKZEUG_RUN_MAIN") == "true"

    # Variable para el descriptor de archivo del servidor Werkzeug
    WERKZEUG_SERVER_FD = os.getenv('WERKZEUG_SERVER_FD')
