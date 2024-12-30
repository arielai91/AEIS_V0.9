from flask import Flask # Importa la clase Flask
from flask_cors import CORS # Importa la librería para habilitar CORS
from flask_wtf.csrf import CSRFProtect # Importa la librería para protección CSRF
from dotenv import load_dotenv # Importa la librería para cargar variables de entorno
from app.extensions import mail, db # Importa extensiones inicializadas en app/extensions.py
from app.routes import register_routes # Importa la función register_routes definida en app/routes/__init__.py

load_dotenv() # Carga las variables de entorno

app = Flask(__name__) # Crea una instancia de la clase Flask

app.config.from_object('app.config.Config') # Carga la configuración de la aplicación

CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}}) # Habilita CORS para la aplicación

csrf = CSRFProtect(app) # Protege la aplicación contra CSRF
mail.init_app(app) # Inicializa la extensión de envío de correos
db.init_app(app) # Inicializa la extensión de base de datos

register_routes(app) # Registra las rutas en la aplicación

with app.app_context(): # Crea un contexto de aplicación
    db.create_all() # Crea las tablas en la base de datos

