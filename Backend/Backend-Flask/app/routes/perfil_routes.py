from flask import Blueprint, request, jsonify
from app.services.perfil_service import update_password

perfil_routes = Blueprint('perfil_routes', __name__)


# Endpoint para actualizar la contraseña
@perfil_routes.route('/update-password', methods=['POST'])
def update_password_route():
    # Obtener datos de la solicitud
    email = request.json.get('email')
    code = request.json.get('code')
    new_password = request.json.get('contraseña')

    # Validar datos
    if not email or not code or not new_password:
        return jsonify({
            'message':
            'Email, code, and new password are required'}), 400

    try:
        # Llamar al servicio para actualizar la contraseña
        update_password(email, code, new_password)
        return jsonify({'message': 'Password updated successfully'}), 200
    except ValueError:
        return jsonify({'message': 'Error of value'}), 400
    except Exception:
        return jsonify({'message': 'An unexpected error occurred'}), 500
