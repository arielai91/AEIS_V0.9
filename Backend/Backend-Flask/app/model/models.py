import pytz
from datetime import datetime
from app.extensions import db  # Importa la extensión db


class VerificationCode(db.Model):
    """Modelo de código de verificación."""
    __tablename__ = 'verification_codes'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    code = db.Column(db.String(6), nullable=False)
    expiration = db.Column(
        db.DateTime(timezone=True),
        nullable=False)

    def is_expired(self):
        """Comprueba si el código de verificación ha expirado."""
        # Configura la zona horaria de Bogotá
        bogota_tz = pytz.timezone('America/Bogota')
        current_time = datetime.now(bogota_tz)

        # Asegura que expiration también esté en la zona horaria de Bogotá
        expiration_time = self.expiration
        if expiration_time.tzinfo is None:
            expiration_time = pytz.utc.localize(expiration_time).astimezone(bogota_tz)
        else:
            expiration_time = expiration_time.astimezone(bogota_tz)

        print(f"Current time in Bogotá: {current_time}")
        print(f"Expiration time in Bogotá: {expiration_time}")
        return current_time > expiration_time

    def __repr__(self):
        return f'<VerificationCode {self.email}>'
