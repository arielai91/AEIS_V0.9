from flask import Flask  # Importa la clase Flask
from flask_cors import CORS  # Importa la librería para habilitar CORS
# Importa la librería para protección CSRF
from flask_wtf.csrf import CSRFProtect
# Importa la librería para cargar variables de entorno
from dotenv import load_dotenv
# Importa extensiones inicializadas en app/extensions.py
from app.extensions import mail, db, bcrypt
# Importa la función register_routes definida en app/routes/__init__.py
from app.routes import register_routes
# Importa Flask-PyMongo
from flask_pymongo import PyMongo

load_dotenv()  # Carga las variables de entorno

app = Flask(__name__)  # Crea una instancia de la clase Flask

# Carga la configuración de la aplicación
app.config.from_object('app.config.Config')

# Habilita CORS para la aplicación
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

csrf = CSRFProtect(app)  # Protege la aplicación contra CSRF
mail.init_app(app)  # Inicializa la extensión de envío de correos
db.init_app(app)  # Inicializa la extensión de base de datos
bcrypt.init_app(app)  # Inicializa la extensión de encriptación
mongo = PyMongo(app)  # Inicializa la extensión de MongoDB

register_routes(app)  # Registra las rutas en la aplicación

with app.app_context():  # Crea un contexto de aplicación
    db.create_all()  # Crea las tablas en la base de datos
