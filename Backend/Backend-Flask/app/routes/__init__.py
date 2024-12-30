from flask import Blueprint # Importa la clase Blueprint
from .email_routes import email_routes # Importa las rutas de email definidas en app/routes/email_routes.py

Blueprint = [email_routes] # Crea un objeto Blueprint

def register_routes(app):
    """Registra las rutas en la aplicación."""
    for blueprint in Blueprint:
        app.register_blueprint(blueprint) # Registra las rutas en la aplicación
