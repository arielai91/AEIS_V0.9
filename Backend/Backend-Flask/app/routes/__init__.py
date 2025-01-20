# Importa las rutas de email definidas en app/routes/email_routes.py
from .email_routes import email_routes
from .perfil_routes import perfil_routes

def app_routes(app):
    """Registra las rutas en la aplicación."""
    app.register_blueprint(email_routes, url_prefix='/email')
    app.register_blueprint(perfil_routes, url_prefix='/perfil')