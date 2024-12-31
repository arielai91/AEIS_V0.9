# Importa la clase Mail de la librería flask_mail
from flask_mail import Mail
# Importa la clase SQLAlchemy de la librería flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy

mail = Mail()  # Crea una instancia de la clase Mail
db = SQLAlchemy()  # Crea una instancia de la clase SQLAlchemy
