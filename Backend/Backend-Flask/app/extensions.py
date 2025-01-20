# Importa la clase Mail de la librería flask_mail
from flask_mail import Mail
# Importa la clase SQLAlchemy de la librería flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
# Importa la clase Bcrypt de la librería flask_bcrypt
from flask_bcrypt import Bcrypt
# Importa Flask-PyMongo
from flask_pymongo import PyMongo
# Importa la clase CSRFProtect de la librería flask_wtf
from flask_wtf.csrf import CSRFProtect

mail = Mail()  # Crea una instancia de la clase Mail
db = SQLAlchemy()  # Crea una instancia de la clase SQLAlchemy
bcrypt = Bcrypt()  # Crea una instancia de la clase Bcrypt
mongo = PyMongo()  # Crea una instancia de PyMongo
csrf = CSRFProtect()  # Crea una instancia de la clase CSRFProtect
