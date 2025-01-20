from app.extensions import db, bcrypt
from app.model.models import Perfil
from app.services.email_service import verify_code

def update_password(email, code, new_password):
    if verify_code(email, code):
        perfil = Perfil.query.filter_by(email=email).first()
        if not perfil:
            raise ValueError('Perfil not found')

        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        perfil.password = hashed_password
        db.session.commit()