from datetime import datetime, timezone  # Importa la clase datetime
from app.extensions import db  # Importa la extensión db


class VerificationCode(db.Model):
    """Modelo de código de verificación."""
    __tablename__ = 'verification_codes'  # Nombre de la tabla
    id = db.Column(db.Integer, primary_key=True)  # Columna de id
    email = db.Column(db.String(255), primary_key=True)  # Columna de email
    code = db.Column(db.String(16), nullable=False)  # Columna de código
    expiration = db.Column(
        db.DateTime,
        nullable=False)  # Columna de fecha de expiración

    def is_expired(self):
        """Comprueba si el código de verificación ha expirado."""
        return datetime.now(timezone.utc) > self.expiration

    def __repr__(self):
        return f'<VerificationCode {self.email}>'
