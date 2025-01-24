import { ImageUpdater } from "../content/Image.js";

const DOM_ELEMENTS = {
    emailInput: document.getElementById("email"),
    termsCheckbox: document.getElementById("terms"),
    registerButton: document.querySelector(".registration-form__button"),
    validationMessageList: document.getElementById("validation-message"),
    verificationModal: document.getElementById("verification-modal"),
    emailDisplay: document.getElementById("email-display"),
};

const ROUTES = {
    expressRoute: "http://localhost:3000/",
    flaskRoute: "http://localhost:5000/email/",
};

const RESPONSE = {
    message: ["El correo ya está registrado.", "La contraseña es demasiado corta."],
    success: true, // Cambiar a true si deseas simular un registro exitoso
};

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

    // Verificar términos y condiciones
    const termsResult = verifyTerms();
    if (!termsResult.success) {
        displayValidationMessages([termsResult.message]);
        return;
    }

    // Leer el éxito de RESPUESTA
    if (RESPONSE.success) {
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

        // Mostrar la modal de verificación
        showVerificationModal(email);
    } else {
        // Mostrar los mensajes de validación de RESPUESTA
        displayValidationMessages(RESPONSE.message);
    }
}

// Asignar eventos
DOM_ELEMENTS.registerButton.addEventListener("click", handleRegister);

// const imageUpdater = new ImageUpdater(
//     "https://codebyelaina.com/bucket/image/logo_aeis.png",
//     ".logo_aeis"
// );
// imageUpdater.updateImage();
