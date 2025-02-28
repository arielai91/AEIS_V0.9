from flask import Blueprint, request, jsonify
from app.services import send_verification_email, verify_code, perfil_existe, send_notification_email

email_routes = Blueprint('email_routes', __name__)


# Define la ruta /register
@email_routes.route('/register', methods=['POST'])
def send_verification_email_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('contraseña')
    cedula = data.get('cedula')
    
    if not email or not password or not cedula:
        return jsonify({'message': 'Correo electrónico, contraseña y cédula son requeridos', 'success': False}), 400
    
    if perfil_existe(email):
        return jsonify({'message': 'El correo electrónico ya está registrado', 'success': False}), 400
    
    if len(cedula) != 10:
        return jsonify({'message': 'Cédula debe tener 10 dígitos', 'success': False}), 400

    if len(password) < 8:
        return jsonify({'message': 'Contraseña debe tener al menos 8 caracteres', 'success': False}), 400
    
    if not email.endswith('@epn.edu.ec'):
        return jsonify({'message': 'Correo electrónico debe ser de la EPN', 'success': False}), 400
    
    try:
        send_verification_email(email, "register")
        return jsonify({'message': 'Correo de verificación enviado correctamente', 'success': True}), 200
    except ValueError:
        return jsonify({'message': 'Ocurrió un error al enviar el correo de verificación', 'success': False}), 400


# Define la ruta /verify_code
@email_routes.route('/verify_code', methods=['POST'])
def verify_code_route():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({'message': 'Correo electrónico y código son requeridos',
                        'success': False}), 400

    try:
        if verify_code(email, code):
            return jsonify({'message': 'Código de verificación correcto',
                            'success': True})
        else:
            return jsonify({'message': 'Código de verificación incorrecto',
                            'success': False}), 400
    except Exception:
        return jsonify({'message': 'Ocurrió un error al verificar el código',
                        'success': False}), 400


# Endpoint para solicitar el cambio de contraseña
@email_routes.route('/reset_password', methods=['POST'])
def request_password_reset():
    email = request.json.get('email')

    if not email:
        return jsonify({'message': 'Correo electronico es requerido', 'success': False}), 400

    try:
        send_verification_email(email, "reset_password")
        return jsonify({'message': 'Correo de cambio de contraseña enviado correctamente', 'success': True}), 200
    except Exception:
        return jsonify({'message': 'No se pudo enviar el correo de verificación', 'success': False}), 500

@email_routes.route('/notificar', methods=['POST'])
def notificar():
    data = request.get_json()
    email = data.get('email')
    tipo = data.get('tipo')

    if not email or not tipo:
        return jsonify({'message': 'Correo electrónico y tipo son requeridos', 'success': False}), 400

    try:
        send_notification_email(email, tipo)
        return jsonify({'message': 'Correo de notificación enviado correctamente', 'success': True}), 200
    except ValueError as e:
        return jsonify({'message': str(e), 'success': False}), 400
    except Exception:
        return jsonify({'message': 'Ocurrió un error al enviar el correo de notificación', 'success': False}), 500