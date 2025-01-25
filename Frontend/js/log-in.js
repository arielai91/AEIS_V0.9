const DOM_ELEMENTS = {
    identifierInput: document.getElementById("identifier"),
    passwordInput: document.getElementById("password"),
    infoMessage: document.querySelector(".login-info__message"),
    toggleButton: document.getElementById("toggle-password"),
    loginButton: document.querySelector(".login-form__button"),
};

const ROUTES = {
    expressRoute: "http://localhost:3000/auth/login",
};

function togglePasswordVisibility() {
    const svg = DOM_ELEMENTS.toggleButton?.querySelector("svg"); // Asegura que toggleButton existe

    if (!svg) return;

    if (DOM_ELEMENTS.passwordInput.type === "password") {
        DOM_ELEMENTS.passwordInput.type = "text"; // Muestra la contraseña
        svg.innerHTML = `
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        `;
    } else {
        DOM_ELEMENTS.passwordInput.type = "password"; // Oculta la contraseña
        svg.innerHTML = `
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 19c-4.42 0-8.41-2.67-10-6.5C3.59 8.67 7.58 6 12 6s8.41 2.67 10 6.5c-1.59 3.83-5.58 6.5-10 6.5zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        `;
    }
}

function showInfoMessage(message) {
    if (DOM_ELEMENTS.infoMessage) {
        DOM_ELEMENTS.infoMessage.textContent = message;
        DOM_ELEMENTS.infoMessage.style.display = "block";
    }
}

function validateEmptyInputs() {
    let valid = true;

    [DOM_ELEMENTS.identifierInput, DOM_ELEMENTS.passwordInput].forEach((input) => {
        if (input && input.value.trim() === "") {
            showInfoMessage("Campos vacíos.");
            valid = false;
        }
    });

    return valid;
}

function loginUser(event) {
    event.preventDefault();
    const loginUrl = ROUTES.expressRoute;
    const data = {
        email: DOM_ELEMENTS.identifierInput?.value,
        cedula: DOM_ELEMENTS.identifierInput?.value,
        contraseña: DOM_ELEMENTS.passwordInput?.value,
    };

    if (validateEmptyInputs()) {
        fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", // Incluir cookies en la solicitud
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.rol)
                    if (data.rol === "Administrador") {
                        console.log("INICIO EXITOSO")
                        window.location.href = "admin.html";
                    } else {
                        console.log("INICIO EXITOSO")
                        window.location.href = "user.html";
                    }
                } else {
                    showInfoMessage(data.message);
                }
            })
            .catch((error) => {
                showInfoMessage("Error en el inicio de sesión. Intenta nuevamente.");
                console.error("Error:", error);
            });
    }
}

function initializeEventListeners() {
    if (DOM_ELEMENTS.toggleButton) {
        DOM_ELEMENTS.toggleButton.addEventListener("click", togglePasswordVisibility);
    } else {
        console.error("El botón de toggle password no está definido.");
    }

    if (DOM_ELEMENTS.loginButton) {
        DOM_ELEMENTS.loginButton.addEventListener("click", loginUser);
    } else {
        console.error("El botón de login no está definido.");
    }
}

// Inicia los event listeners después de que el DOM esté cargado
document.addEventListener("DOMContentLoaded", initializeEventListeners);
