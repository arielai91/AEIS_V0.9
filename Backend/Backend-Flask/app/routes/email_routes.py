# Importa la clase Blueprint, request y jsonify
from flask import Blueprint, request, jsonify
# Importa todos los servicios definidos en app/services/__init__.py
from app.services import send_verification_email, verify_code

email_routes = Blueprint('email_routes', __name__)  # Crea un objeto Blueprint


# Define la ruta /send_verification_email
@email_routes.route('/send_verification_email', methods=['POST'])
def send_verification_email_route():
    """Envía un correo electrónico de verificación."""
    data = request.get_json()  # Obtiene los datos de la solicitud
    email = data.get('email')
    try:
        # Envía el correo electrónico de verificación
        send_verification_email(email)
        # Devuelve un mensaje de éxito
        return jsonify({
            'message': 'Correo de verificación enviado correctamente'})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


# Define la ruta /verify_code
@email_routes.route('/verify_code', methods=['POST'])
def verify_code_route():
    """Verifica el código de verificación."""
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    if verify_code(email, code):
        return jsonify({'message': 'Código de verificación correcto'})
    else:
        return jsonify({'error': 'Código de verificación incorrecto'}), 400
