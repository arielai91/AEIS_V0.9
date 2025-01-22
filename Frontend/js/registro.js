import {ImageUpdater} from "../content/Image.js";

document.addEventListener("DOMContentLoaded", function () {
    const registroForm = document.getElementById("registroForm");
    const verificacionModal = document.getElementById("verificacionModal");
    const verificacionForm = document.getElementById("verificacionForm");
    const editarCorreoLink = document.getElementById("editarCorreo");
    const emailInput = document.getElementById("email");
    const emailDisplay = document.getElementById("emailDisplay");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("password_confirm");
    const cedulaInput = document.getElementById("cedula");
    const termsCheckbox = document.getElementById("terms");
    const validationMessage = document.getElementById("validationMessage");
    const invalidCodeMessage = document.querySelector(".invalid-code");
    const verificationCodeInput = document.getElementById("codigo");
    const botonInicioElements = document.querySelectorAll('.boton_inicio');

    botonInicioElements.forEach(element => {
        element.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    });


    registroForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        validationMessage.innerHTML = "";
        validationMessage.style.display = "none";

        const errors = [];

        if (passwordInput.value.length < 6) {
            errors.push("La contraseña debe tener al menos 6 caracteres.");
        } else {
            if (passwordInput.value !== confirmPasswordInput.value) {
                errors.push("Las contraseñas no coinciden.");
            }
        }

        if (cedulaInput.value.length !== 10) {
            errors.push("La cédula debe tener 10 dígitos.");
        }

        if (!emailInput.value.endsWith("@epn.edu.ec")) {
            errors.push("El correo debe terminar con el dominio @epn.edu.ec.");
        }

        if (!termsCheckbox.checked) {
            errors.push("Debes aceptar los términos y condiciones.");
        }

        const emailExists = await checkIfExists("email", emailInput.value);
        const cedulaExists = await checkIfExists("cedula", cedulaInput.value);

        if (emailExists) {
            errors.push("El correo ya está registrado.");
        }

        if (cedulaExists) {
            errors.push("La cédula ya está registrada.");
        }

        if (errors.length > 0) {
            errors.forEach((error) => {
                const li = document.createElement("li");
                li.textContent = error;
                validationMessage.appendChild(li);
            });
            validationMessage.style.display = "block";
        } else {
            validationMessage.style.display = "none";
            emailDisplay.textContent = emailInput.value;
            send_code(emailInput.value);
            verificacionModal.classList.add("active");
        }
    });

    verificacionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const verificationCode = verificationCodeInput.value;
        const email = emailInput.value;

        verify_code(email, verificationCode);
    });

    editarCorreoLink.addEventListener("click", function (e) {
        e.preventDefault();
        verificacionModal.classList.remove("active");
        invalidCodeMessage.style.display = "none";
        emailInput.value = ""; // Limpiar el texto ingresado
        emailInput.placeholder = "Ingrese su correo"; // Establecer el placeholder nuevamente
        emailInput.focus();
        verificationCodeInput.value = ""; // Limpiar el campo de verificación
    });

    verificacionModal.addEventListener("click", function (e) {
        if (e.target === verificacionModal) {
            verificacionModal.classList.remove("active");
            invalidCodeMessage.style.display = "none";
            verificationCodeInput.value = ""; // Limpiar el campo de verificación
        }
    });
});

function verify_code(email, verificationCode) {
    fetch("https://codebyelaina.com/verify_code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email, code: verificationCode}),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            if (data.message === "Verification successful!") {
                registerUser();
                verificacionModal.style.display = "none";
                const successModal = document.getElementById("success-modal");
                successModal.style.display = "flex";
                const successButton = successModal.querySelector(".modal-btn-primary");
                successButton.addEventListener("click", () => {
                    window.location.href = "ingreso.html";
                });
            } else {
                const invalidCodeMessage = document.querySelector(".invalid-code");
                invalidCodeMessage.style.display = "block";
            }
        })
        .catch((error) => console.error("Error:", error));
}

function send_code(email) {
    fetch("https://codebyelaina.com/send_code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email}),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            if (data.message === "Verification code sent to your email.") {
                document.getElementById("verificationModal").style.display = "block";
            } else {
                showNotification(data.message, "error");
            }
        });
}

function registerUser() {
    const userData = {
        email: document.getElementById("email").value,
        contraseña: document.getElementById("password").value,
        cedula: document.getElementById("cedula").value,
        nombreCompleto: `${document.getElementById("name").value} ${
            document.getElementById("lastname").value
        }`,
        rol: "Cliente",
    };

    fetch("https://codebyelaina.com/perfiles/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                // mensaje no sale en consola
                console.error(`Error en el registro: ${data.error}`);
            } else {
                // mensaje no sale en consola
                console.log("Registro exitoso");
            }
        })
        .catch((error) => {
            // mensaje no sale en consola
            console.error("Error en el registro", error);
        });
}

async function checkIfExists(field, value) {
    try {
        const response = await fetch(`https://codebyelaina.com/perfiles/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({field, value}),
        });

        const data = await response.json();
        return data.exists;
    } catch (error) {
        // mensaje no sale en consola
        console.error("Error verificando existencia:", error);
        return false;
    }
}

// Función para mostrar notificaciones en la UI se debe mejorar la apariencia
function showNotification(message, type) {
    // Aquí puedes implementar la lógica para mostrar notificaciones en tu UI
    alert(message); // O reemplazar por una notificación en pantalla
}

const imageUpdater = new ImageUpdater(
    "https://codebyelaina.com/bucket/image/logo_aeis.png",
    ".logo_aeis"
);
imageUpdater.updateImage();
