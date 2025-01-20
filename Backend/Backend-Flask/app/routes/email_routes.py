from flask import Blueprint, request, jsonify
from app.services import send_verification_email, verify_code

email_routes = Blueprint('email_routes', __name__)


# Define la ruta /send_verification_email
@email_routes.route('/send_verification_email', methods=['POST'])
def send_verification_email_route():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    try:
        send_verification_email(email)
        return jsonify({
            'message': 'Correo de verificación enviado correctamente'})
    except ValueError:
        return jsonify({'error':
                        'Ocurrió un error al enviar el correo de verificación'
                        }), 400


# Define la ruta /verify_code
@email_routes.route('/verify_code', methods=['POST'])
def verify_code_route():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({'message': 'Email and code are required'}), 400

    try:
        if verify_code(email, code):
            return jsonify({'message': 'Código de verificación correcto'})
        else:
            return jsonify({'error': 'Código de verificación incorrecto'}), 400
    except Exception:
        return jsonify({
            'error': 'Ocurrió un error al verificar el código'}), 400


# Endpoint para solicitar el cambio de contraseña
@email_routes.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    email = request.json.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    try:
        send_verification_email(email)
        return jsonify({'message': 'Verification email sent'}), 200
    except Exception:
        return jsonify({'message': 'Failed to send verification email'}), 500
