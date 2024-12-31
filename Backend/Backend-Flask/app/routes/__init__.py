# Importa las rutas de email definidas en app/routes/email_routes.py
from .email_routes import email_routes

Blueprint = [email_routes]  # Crea un objeto Blueprint


def register_routes(app):
    """Registra las rutas en la aplicación."""
    for blueprint in Blueprint:
        # Registra las rutas en la aplicación
        app.register_blueprint(blueprint)
