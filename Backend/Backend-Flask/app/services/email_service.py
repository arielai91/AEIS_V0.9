import secrets   # Importa el módulo secrets
import string
# Importa las clases datetime y timedelta
from datetime import datetime, timedelta, timezone
from flask_mail import Message  # Importa la clase Message
from app.extensions import mail, db  # Importa la extensión mail
# Importa el modelo VerificationCode
from app.model.models import VerificationCode
# Importa la función validate_email_address
from app.utils import validate_email_address

def generate_verification_code(length=6):
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def send_verification_email(email):
    """Genera un código de verificación único y
        lo almacena en la base de datos."""
    # Valida la dirección de correo electrónico
    if not validate_email_address(email):
        # Lanza una excepción si no es valido
        raise ValueError('Dirección de correo electrónico no válida')
    # Genera un código de verificación único
    verification_code = generate_verification_code()
    # Calcula la fecha de expiración
    expiration = datetime.now(timezone.utc) + timedelta(minutes=5)
    # Crea una entrada en la base de datos

    # Busca un código de verificación existente
    existing_code = VerificationCode.query.filter_by(email=email).first()
    if existing_code:
        db.session.delete(existing_code)
        db.session.commit()

    code_entry = VerificationCode(
        email=email,
        code=verification_code,
        expiration=expiration)
    # Busca un código de verificación existente
    existing_code = VerificationCode.query.filter_by(email=email).first()
    if existing_code:
        # Elimina el código de verificación existente
        db.session.delete(existing_code)
    # Añade el código de verificación a la base de datos
    db.session.add(code_entry)
    db.session.commit()  # Confirma los cambios en la base de datos

    # Crea un nuevo objeto de mensaje
    message = Message(
        subject='Verificación de correo electrónico',
        recipients=[email],
        body=(
            f'Su código de verificación es: {verification_code}\n\n'
            'Tiempo de expiración: 5 minutos'
        )
    )

    mail.send(message)  # Envía el mensaje de correo electrónico


def verify_code(email, code):
    """Verifica si el código de verificación es correcto y
        no ha expirado."""
    code_entry = VerificationCode.query.filter_by(
        email=email,
        code=code).first()
    
    print(code_entry.is_expired())

    if code_entry and not code_entry.is_expired():
        db.session.delete(code_entry)
        db.session.commit()
        return True
    return False


def clean_expired_code(app):
    """Elimina los códigos de verificación que han expirado."""
    with app.app_context():
        try:
            now = datetime.now(timezone.utc)
            expired_codes = VerificationCode.query.filter(
                VerificationCode.expiration < now).all()
            for code in expired_codes:
                db.session.delete(code)
            db.session.commit()
            print('Expired verification codes cleaned up')
        except Exception as e:
            print(f'Error cleaning expired verification codes: {e}')
