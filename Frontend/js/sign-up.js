
const DOM_ELEMENTS = {
    nameInput: document.getElementById("name"),
    lastNameInput: document.getElementById("lastname"),
    userId: document.getElementById("cedula"),
    emailInput: document.getElementById("email"),
    passwordInput: document.getElementById("password"),
    passwordConfirmInput: document.getElementById("password_confirm"),
    termsCheckbox: document.getElementById("terms"),
    registerButton: document.querySelector(".registration-form__button"),
    validationMessageList: document.getElementById("validation-message"),
    verificationModal: document.getElementById("verification-modal"),
    emailDisplay: document.getElementById("email-display"),
    verificationCodeInput: document.getElementById("code"),
    verificationCodeError: document.querySelector(".verification-form__error"),
    verificationCodeButton: document.querySelector(".verification-form__button"),
    successModal: document.getElementById("success-modal"),
    successModalButton: document.getElementById("modal__button--primary")
};

let VALIDATION_MESSAGES = [];

const ROUTES = {
    expressRoute: "http://localhost:3000/perfiles/",
    flaskRoute: "http://localhost:5000/email/",
};

const CODE_RESPONSE = {
    message: "Código incorrecto.",
    success: true // Cambiar a true si deseas simular un código correcto
}

// Función para verificar si se aceptaron los términos y condiciones
function verifyTerms() {
    if (DOM_ELEMENTS.termsCheckbox.checked) {
        return { message: "", success: true };
    } else {
        return { message: "Debes aceptar los términos y condiciones.", success: false };
    }
}

// Función para mostrar la modal de verificación
function showVerificationModal(email) {
    DOM_ELEMENTS.emailDisplay.textContent = email;
    DOM_ELEMENTS.verificationModal.style.display = "flex";
}

function showSuccessModal() {
    DOM_ELEMENTS.verificationModal.style.display = "none";
    DOM_ELEMENTS.successModal.style.display = "flex";
}

function validateEmptyInputs() {
    let isValid = true;
    const inputs = [
        DOM_ELEMENTS.nameInput,
        DOM_ELEMENTS.lastNameInput,
        DOM_ELEMENTS.userId,
        DOM_ELEMENTS.emailInput,
        DOM_ELEMENTS.passwordInput,
        DOM_ELEMENTS.passwordConfirmInput,
    ];
    inputs.forEach((input) => {
        if (input.value === "") {
            isValid = false;
        }
    });

    if (!isValid) {
        VALIDATION_MESSAGES.push("Todos los campos son requeridos.");
    }
}

function validatePasswordMatch() {
    let isValid = true;
    if (DOM_ELEMENTS.passwordInput.value !== DOM_ELEMENTS.passwordConfirmInput.value) {
        VALIDATION_MESSAGES.push("Las contraseñas no coinciden");
    }
}


function validateInputs() {
    VALIDATION_MESSAGES = [];
    validateEmptyInputs();
    validatePasswordMatch();
    return VALIDATION_MESSAGES.length === 0;
}

// Función para manejar los mensajes de error
function displayValidationMessages(messages) {
    DOM_ELEMENTS.validationMessageList.innerHTML = ""; // Limpia la lista
    messages.forEach((msg) => {
        const li = document.createElement("li");
        li.textContent = msg;
        DOM_ELEMENTS.validationMessageList.appendChild(li);
    });
    DOM_ELEMENTS.validationMessageList.style.display = "block";
}


// Función para manejar el registro
function handleRegister(event) {
    event.preventDefault(); // Prevenir comportamiento predeterminado del formulario

    // Cambia el texto del botón inmediatamente
    DOM_ELEMENTS.registerButton.textContent = "REGISTRANDO...";

    // Esperar un pequeño retraso para permitir que el DOM se actualice
    setTimeout(() => {
        // Leer el éxito de RESPUESTA
        if (validateInputs()) {
            const termsResult = verifyTerms();
            if (!termsResult.success) {
                displayValidationMessages([termsResult.message]);
                DOM_ELEMENTS.registerButton.textContent = "REGISTRAR"; // Restablecer el texto
                return;
            }
            const email = DOM_ELEMENTS.emailInput.value;
            const contraseña = DOM_ELEMENTS.passwordInput.value;
            const cedula = DOM_ELEMENTS.userId.value;
            const registerUrl = `${ROUTES.flaskRoute}register`;
            console.log("Ruta: ", registerUrl);

            fetch(registerUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, contraseña: contraseña, cedula: cedula}),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        showVerificationModal(email);
                    } else {
                        const messages = Array.isArray(data.message) ? data.message : [data.message];
                        displayValidationMessages(messages);
                    }
                })
                .catch((error) => {
                    console.error("Error en el registro:", error);
                })
                .finally(() => {
                    DOM_ELEMENTS.registerButton.textContent = "REGISTRAR"; // Restablecer el texto
                });
        } else {
            // Mostrar los mensajes de validación de RESPUESTA
            displayValidationMessages(VALIDATION_MESSAGES);
            DOM_ELEMENTS.registerButton.textContent = "REGISTRAR"; // Restablecer el texto
        }
    }, 50); // Un retraso mínimo suficiente para que el navegador renderice el cambio
}

// Funcion para redirigir a la pagina de ingreso
function redirectToLogin() {
    window.location.href = "/Frontend/html/log-in.html";
}

function verifyCode(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    // Cambiar el texto del botón a "VERIFICANDO..."
    DOM_ELEMENTS.verificationCodeButton.textContent = "VERIFICANDO...";

    const verificationCode = DOM_ELEMENTS.verificationCodeInput.value;
    const email = DOM_ELEMENTS.emailInput.value;
    const verifyCodeUrl = `${ROUTES.flaskRoute}verify_code`;

    fetch(verifyCodeUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, code: verificationCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                registerUser(); // Realiza el registro si el código es correcto
            } else {
                DOM_ELEMENTS.verificationCodeError.style.display = "flex"; // Muestra el error
            }
        })
        .catch((error) => {
            console.error("Error en la verificación:", error);
        })
        .finally(() => {
            // Siempre restablece el texto del botón al finalizar
            DOM_ELEMENTS.verificationCodeButton.textContent = "VERIFICAR";
        });
}


function registerUser() {
    const registerUrl = `${ROUTES.expressRoute}`;
    const data = {
        nombreCompleto: `${DOM_ELEMENTS.nameInput.value} ${DOM_ELEMENTS.lastNameInput.value}`,
        email: DOM_ELEMENTS.emailInput.value,
        cedula: DOM_ELEMENTS.userId.value,
        contraseña: DOM_ELEMENTS.passwordInput.value,
    };

    fetch(registerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showSuccessModal();
            } else {
                console.error("Error al registrar el usuario:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error en el registro:", error);
        });
}

function initializeEventListeners() {
    if (DOM_ELEMENTS.registerButton) {
        DOM_ELEMENTS.registerButton.addEventListener("click", handleRegister);
    } else {
        console.error("registerButton no encontrado.");
    }

    if (DOM_ELEMENTS.verificationCodeButton) {
        DOM_ELEMENTS.verificationCodeButton.addEventListener("click", verifyCode);
    } else {
        console.error("verificationCodeButton no encontrado.");
    }

    if (DOM_ELEMENTS.successModalButton) {
        DOM_ELEMENTS.successModalButton.addEventListener("click", redirectToLogin);
    } else {
        console.error("successModalButton no encontrado.");
    }
}
window.redirectToIndex = function() {
    window.location.href = "../../index.html";
}


document.addEventListener("DOMContentLoaded", initializeEventListeners);