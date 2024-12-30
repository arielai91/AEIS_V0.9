from flask import Blueprint, request, jsonify # Importa la clase Blueprint, request y jsonify
from app.services import * # Importa todos los servicios definidos en app/services/__init__.py

email_routes = Blueprint('email_routes', __name__) # Crea un objeto Blueprint

@email_routes.route('/send_verification_email', methods=['POST']) # Define la ruta /send_verification_email
def send_verification_email():
    """Envía un correo electrónico de verificación."""
    data = request.get_json() # Obtiene los datos de la solicitud
    email =  data.get('email')
    try:
        send_verification_email(email) # Envía el correo electrónico de verificación
        return jsonify({'message': 'Correo de verificación enviado correctamente'}) # Devuelve un mensaje de éxito
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@email_routes.route('/verify_code', methods=['POST']) # Define la ruta /verify_code
def verify_code():
    """Verifica el código de verificación."""
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    if verify_code(email, code):
        return jsonify({'message': 'Código de verificación correcto'})
    else:
        return jsonify({'error': 'Código de verificación incorrecto'}), 400