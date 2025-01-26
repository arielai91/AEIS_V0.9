from app.extensions import mongo, bcrypt
from app.services.email_service import verify_code


def update_password(email, code, new_password, password_confirmation):
    """
    Actualiza la contraseña de un usuario en MongoDB
    """
    # Verificar el código de verificación
    if not verify_code(email, code):
        raise ValueError('Código de verificación inválido o expirado')

    # Buscar el perfil en MongoDB
    if not perfil_existe(email):
        raise ValueError('Perfil no encontrado')

    # Obtener la contraseña actual
    contraseña_actual = obtener_contraseña_actual(email)
    if not contraseña_actual:
        raise ValueError('No se pudo obtener la contraseña actual')

    # Verificar que la confirmación de la contraseña coincida con la contraseña actual
    if not bcrypt.check_password_hash(contraseña_actual, password_confirmation):
        raise ValueError('La confirmación de la contraseña no coincide con la contraseña actual')

    # Generar el hash de la nueva contraseña
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Actualizar la contraseña en MongoDB
    result = mongo.db.perfiles.update_one(
        {"email": email},  # Filtro
        {"$set": {"contraseña": hashed_password}}  # Actualización
    )

    if result.matched_count == 0:
        raise ValueError("No se pudo actualizar la contraseña")

def perfil_existe(email):
    """
    Verifica si un perfil existe en MongoDB por el correo electrónico.
    """
    perfil = mongo.db.perfiles.find_one({"email": email})
    return perfil is not None 

def obtener_contraseña_actual(email):
    """
    Obtiene la contraseña actual de un perfil en la base de datos
    """
    perfil = mongo.db.perfiles.find_one({"email": email}, {"contraseña": 1})
    return perfil["contraseña"] if perfil else None