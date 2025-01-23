from app.extensions import mongo, bcrypt
from app.services.email_service import verify_code


def update_password(email, code, new_password):
    """
    Actualiza la contraseña de un usuario en MongoDB
    """
    # Verificar el código de verificación
    if not verify_code(email, code):
        raise ValueError('Código de verificación inválido o expirado')

    # Buscar el perfil en MongoDB
    perfil = mongo.db.perfiles.find_one({"email": email})
    if not perfil:
        raise ValueError('Perfil no encontrado')

    # Generar el hash de la nueva contraseña
    hashed_password = bcrypt.generate_password_hash(
        new_password).decode('utf-8')

    # Actualizar la contraseña en MongoDB
    result = mongo.db.perfiles.update_one(
        {"email": email},  # Filtro
        {"$set": {"contraseña": hashed_password}}  # Actualización
    )

    if result.matched_count == 0:
        raise ValueError("No se pudo actualizar la contraseña")
