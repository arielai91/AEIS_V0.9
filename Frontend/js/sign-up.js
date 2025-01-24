import { ImageUpdater } from "../content/Image.js";

const DOM_ELEMENTS = {
    emailInput: document.getElementById("email"),
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

const ROUTES = {
    expressRoute: "http://localhost:3000/",
    flaskRoute: "http://localhost:5000/email/",
};

const VALIDATION_RESPONSE = {
    message: ["El correo ya está registrado.", "La contraseña es demasiado corta."],
    success: true
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
    event.preventDefault();

    // Leer el éxito de RESPUESTA
    if (VALIDATION_RESPONSE.success) {
        const termsResult = verifyTerms();
        if (!termsResult.success) {
            displayValidationMessages([termsResult.message]);
            return;
        }
        const email = DOM_ELEMENTS.emailInput.value;
        const registerUrl = `${ROUTES.flaskRoute}register`;
        console.log('Ruta: ', registerUrl);
        fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showVerificationModal(email);
                } else {
                    displayValidationMessages(data.message);
                }
            })
            .catch(error => {
                console.error("Error en el registro:", error);
            });
    } else {
        // Mostrar los mensajes de validación de RESPUESTA
        displayValidationMessages(VALIDATION_RESPONSE.message);
    }
}

// Funcion para redirigir a la pagina de ingreso
function redirectToLogin() {
    window.location.href = "/Frontend/html/log-in.html";
}

// Funcion para verificar el código de verificación
function verifyCode() {
    event.preventDefault();
    const verificationCode = DOM_ELEMENTS.verificationCodeInput.value;
    const email = DOM_ELEMENTS.emailInput.value;
    const verifyCodeUrl = `${ROUTES.flaskRoute}/verify_code`;
    if (!CODE_RESPONSE.success) {
        console.log("Boton de verificación presionado", !CODE_RESPONSE.success);
        DOM_ELEMENTS.verificationCodeError.style.display = "flex";
    } else {
        showSuccessModal();
    }
    // fetch(verifyCodeUrl, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email: email, code: verificationCode }),
    // })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if (data.success) {
    //             registerUser();
    //             DOM_ELEMENTS.verificationModal.style.display = "none";
    //             const successModal = document.getElementById("success-modal");
    //             successModal.style.display = "flex";
    //         } else {
    //             DOM_ELEMENTS.verificationCodeError.style.display = "block";
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Error en la verificación:", error);
    //     });
}

function initializeEventListeners() {
    DOM_ELEMENTS.registerButton.addEventListener("click", handleRegister);
    DOM_ELEMENTS.verificationCodeButton.addEventListener("click", verifyCode);
    DOM_ELEMENTS.successModalButton.addEventListener("click", redirectToLogin)
}

// const imageUpdater = new ImageUpdater(
//     "https://codebyelaina.com/bucket/image/logo_aeis.png",
//     ".logo_aeis"
// );
// imageUpdater.updateImage();

initializeEventListeners();
