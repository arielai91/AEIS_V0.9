from flask import Flask  # Importa la clase Flask
from flask_cors import CORS  # Importa la librería para habilitar CORS
# Importa la librería para cargar variables de entorno
from dotenv import load_dotenv
# Importa extensiones inicializadas
from app.extensions import mail, db, bcrypt, mongo, csrf
from app.routes import app_routes  # Importa la función para registrar rutas

load_dotenv()  # Carga las variables de entorno

# Inicializa la aplicación Flask
app = Flask(__name__)  # Crea una instancia de la clase Flask


# Configuración de la aplicación
def configure_app(app):
    # Carga la configuración de la aplicación
    app.config.from_object('app.config.Config')
    # Habilita CORS
    # CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

# Inicialización de extensiones
def initialize_extensions(app):
    #csrf.init_app(app)  # Protege la aplicación contra CSRF
    mail.init_app(app)  # Inicializa la extensión de envío de correos
    db.init_app(app)  # Inicializa la extensión de base de datos
    bcrypt.init_app(app)  # Inicializa la extensión de encriptación
    mongo.init_app(app)  # Inicializa PyMongo


# Registro de rutas
def initialize_routes(app):
    app_routes(app)  # Registra las rutas de registro


# Configura y devuelve la instancia de la aplicación
configure_app(app)  # Configura la aplicación
initialize_extensions(app)  # Inicializa extensiones
initialize_routes(app)  # Registra rutas

# Inicialización de la base de datos
with app.app_context():  # Crea un contexto de aplicación
    db.create_all()  # Crea las tablas en la base de datos
