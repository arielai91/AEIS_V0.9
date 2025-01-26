from flask import Blueprint, request, jsonify
from app.services.perfil_service import update_password

perfil_routes = Blueprint('perfil_routes', __name__)


# Endpoint para actualizar la contraseña
@perfil_routes.route('/update-password', methods=['POST'])
def update_password_route():
    # Obtener datos de la solicitud
    email = request.json.get('email')
    code = request.json.get('code')
    new_password = request.json.get('nueva_contraseña')
    password_confirmation = request.json.get('confirmar_contraseña')

    # Validar datos
    if not email or not code or not new_password or not password_confirmation:
        return jsonify({
            'message': 
            'Correo electrónico, código, contraseña y nueva contraseña son requeridos',
            'success': False
        }), 400

    try:
        # Llamar al servicio para actualizar la contraseña
        update_password(email, code, new_password, password_confirmation)
        return jsonify({'message': 'Contraseña actualizada correctamente',
                        'success': True}), 200
    except ValueError as e:
        return jsonify({'message': str(e),
                        'success': False}), 400
    except Exception:
        return jsonify({'message': 'Ocurrió un error inesperado',
                        'success': False}), 500
