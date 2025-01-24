export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateCedula = (cedula: string): boolean => {
    const cedulaRegex = /^\d{10}$/;
    return cedulaRegex.test(cedula);
};