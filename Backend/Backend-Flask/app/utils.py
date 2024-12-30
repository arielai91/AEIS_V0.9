from email_validator import validate_email, EmailNotValidError

def validate_email_address(email):
    """Valida una dirección de correo electrónico."""
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False