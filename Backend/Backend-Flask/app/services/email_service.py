import secrets
import string
import pytz
from datetime import datetime, timedelta, timezone
from flask_mail import Message
from app.extensions import mail, db, mongo
from app.model.models import VerificationCode
from app.utils import validate_email_address

def generate_verification_code(length=6):
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def send_verification_email(email, purpose):
    """
    Genera un código de verificación único y lo almacena en la base de datos.
    Envía un correo con un propósito específico (registro o restablecimiento de contraseña).
    """
    if not validate_email_address(email):
        raise ValueError('Dirección de correo electrónico no válida')

    # Define los mensajes según el propósito
    purpose_messages = {
        'register': {
            'subject': 'Confirma tu cuenta - Bienvenido a Nuestra Plataforma',
            'body': (
                f'¡Hola!\n\n'
                f'Estamos encantados de que te unas a nuestra plataforma. Para completar tu registro y confirmar tu cuenta, '
                f'por favor utiliza el siguiente código de verificación:\n\n'
                f'Código: {{code}}\n\n'
                f'Este código es válido por 5 minutos. Si no fuiste tú quien solicitó el registro, puedes ignorar este correo.\n\n'
                f'¡Gracias por unirte a nosotros!\n\n'
                f'El equipo de soporte.'
            )
        },
        'reset_password': {
            'subject': 'Solicitud de Restablecimiento de Contraseña',
            'body': (
                f'Hola,\n\n'
                f'Has solicitado restablecer tu contraseña. Para proceder, utiliza el siguiente código de verificación:\n\n'
                f'Código: {{code}}\n\n'
                f'Este código es válido por 5 minutos. Si no fuiste tú quien solicitó este cambio, por favor ignora este mensaje y contacta a nuestro equipo de soporte.\n\n'
                f'Tu seguridad es nuestra prioridad.\n\n'
                f'Saludos,\n'
                f'El equipo de soporte.'
            )
        }
    }

    # Verifica que el propósito sea válido
    if purpose not in purpose_messages:
        raise ValueError(f'Propósito no válido: {purpose}')

    # Genera el código de verificación y el tiempo de expiración
    verification_code = generate_verification_code()
    bogota_tz = pytz.timezone('America/Bogota')
    expiration = datetime.now(bogota_tz) + timedelta(minutes=5)

    # Busca un código existente y lo actualiza o crea uno nuevo
    code_entry = VerificationCode.query.filter_by(email=email).first()
    if code_entry:
        code_entry.code = verification_code
        code_entry.expiration = expiration
    else:
        code_entry = VerificationCode(
            email=email,
            code=verification_code,
            expiration=expiration
        )
        db.session.add(code_entry)

    db.session.commit()

    # Construye el mensaje de correo según el propósito
    message = Message(
        subject=purpose_messages[purpose]['subject'],
        recipients=[email],
        body=purpose_messages[purpose]['body'].format(code=verification_code)
    )
    mail.send(message)

def verify_code(email, code):
    """Verifica si el código de verificación es correcto y no ha expirado."""
    code_entry = VerificationCode.query.filter_by(email=email, code=code).first()

    if not code_entry:
        print("Código de verificación no encontrado.")
        return False

    if code_entry.is_expired():
        print("El código ha expirado.")
        return False

    try:
        db.session.delete(code_entry)
        db.session.commit()
        print("Código verificado y eliminado correctamente.")
        return True
    except Exception as e:
        print(f"Error durante la eliminación del código: {e}")
        db.session.rollback()
        return False


def clean_expired_code(app):
    """Elimina los códigos de verificación que han expirado."""
    with app.app_context():
        try:
            bogota_tz = pytz.timezone('America/Bogota')
            now = datetime.now(bogota_tz)

            expired_codes = VerificationCode.query.filter(
                VerificationCode.expiration < now).all()
            for code in expired_codes:
                db.session.delete(code)
            db.session.commit()
            print('Expired verification codes cleaned up')
        except Exception as e:
            print(f'Error cleaning expired verification codes: {e}')


def send_notification_email(email, tipo):
    """
    Envía un correo de notificación a la dirección de correo electrónico proporcionada.
    """
    if not validate_email_address(email):
        raise ValueError('Dirección de correo electrónico no válida')

    if tipo == 'Administrador':
        # Enviar correo al email proporcionado
        subject = "Revisión de Solicitud Completada"
        body = (
            f"Estimado usuario,\n\n"
            f"Nos complace informarle que su solicitud ha sido revisada por uno de nuestros administradores.\n\n"
            f"Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nuestro equipo de soporte.\n\n"
            f"Saludos cordiales,\n"
            f"El equipo de soporte."
        )
        send_email(email, subject, body)
    elif tipo == 'Cliente':
        # Buscar todos los administradores en la base de datos y enviarles el correo
        admins = get_admin_emails()
        subject = "Nueva Solicitud de Revisión"
        body = (
            f"Estimado administrador,\n\n"
            f"Se ha recibido una nueva solicitud que requiere su revisión.\n\n"
            f"Por favor, inicie sesión en el sistema para revisar y procesar la solicitud lo antes posible.\n\n"
            f"Gracias por su atención y colaboración.\n\n"
            f"Saludos cordiales,\n"
            f"El equipo de soporte."
        )
        for admin_email in admins:
            send_email(admin_email, subject, body)
    else:
        raise ValueError('Tipo de usuario no válido')

def get_admin_emails():
    """
    Obtiene los correos electrónicos de todos los administradores en la base de datos.
    """
    admins = mongo.db.perfiles.find({"rol": "Administrador"})
    return [admin['email'] for admin in admins]

def send_email(to_email, subject, body):
    """
    Función auxiliar para enviar un correo electrónico.
    """
    from_email = "tu_correo@example.com"

    # Crear el mensaje
    msg = Message(
        subject=subject,
        recipients=[to_email],
        body=body,
        sender=from_email
    )

    try:
        # Enviar el correo
        mail.send(msg)
        print(f"Correo enviado a {to_email}")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")