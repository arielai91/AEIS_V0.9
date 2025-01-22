import {ImageUpdater} from "../content/Image.js";

const urlParams = new URLSearchParams(window.location.search);
const cedula = urlParams.get('cedula');

// Now you can use the 'cedula' variable in your code
console.log('Cedula:', cedula);

function getPerfilData(cedula) {
    fetch(`https://codebyelaina.com/perfiles/usuario/${cedula}`)
        .then(response => response.json())
        .then(data => {
            const {nombreCompleto, email, rol} = data;
            document.getElementById("profile-name").textContent = nombreCompleto;
            document.getElementById("profile-email").textContent = "Correo: " + email;
            document.getElementById("profile-id").textContent =  "Cédula: " + cedula;
        })
        .catch(error => console.error("Error al obtener información de perfil:", error));
}

// Función para mostrar el panel seleccionado
function showPanel(panelId) {
    const panels = document.querySelectorAll(".panel");
    panels.forEach(panel => panel.style.display = "none");

    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.style.display = "block";
    }

    // Actualizar estado activo de los botones
    const menuButtons = document.querySelectorAll(".menu button");
    menuButtons.forEach(button => {
        button.classList.remove("active");
        const buttonPanelId = button.getAttribute("onclick").match(/'([^']+)'/)[1];
        if (buttonPanelId === panelId) {
            button.classList.add("active");
        }
    });
}

// Función para mostrar/ocultar modales
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = modal.style.display === "flex" ? "none" : "flex";
    }
}

// Funciones específicas para cada modal
function togglePasswordModal() {
    toggleModal("password-modal");
}

function toggleLockerModal(lockerNumber = null) {
    const modal = document.getElementById("locker-modal");
    if (lockerNumber !== null) {
        document.getElementById("selected-locker-number").textContent = lockerNumber;
    }
    toggleModal("locker-modal");
}

function toggleSuccessModal() {
    toggleModal("success-modal");
}

function toggleUnavailableModal() {
    toggleModal("unavailable-modal");
}

// Función para confirmar la selección del casillero
function confirmLockerSelection() {
    const lockerNumber = document.getElementById("selected-locker-number").textContent;
    const numericLockerNumber = parseInt(lockerNumber);

    if (numericLockerNumber % 2 === 0) {
        // Si es par, mostrar modal de éxito
        toggleLockerModal();
        toggleSuccessModal();

        // Actualizar el estado visual del casillero
        const selectedLocker = document.querySelector(`.locker:nth-child(${numericLockerNumber})`);
        if (selectedLocker) {
            selectedLocker.style.backgroundColor = "var(--primary)";
            selectedLocker.classList.remove("available");
            document.querySelector(".locker_info p").textContent = `${lockerNumber}`;
        }
    } else {
        // Si es impar, mostrar modal de no disponible
        toggleLockerModal();
        toggleUnavailableModal();
    }
}

// Función para redirigir a solicitudes
function redirectToSolicitudes() {
    toggleUnavailableModal();
    showPanel("solicitudes");
}

// Event listener para cerrar modales al hacer clic fuera
window.addEventListener("click", (event) => {
    const modals = {
        "password-modal": togglePasswordModal,
        "locker-modal": toggleLockerModal,
        "success-modal": toggleSuccessModal,
        "unavailable-modal": toggleUnavailableModal
    };

    Object.entries(modals).forEach(([modalId, toggleFunction]) => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            toggleFunction();
        }
    });
});

// Event listener para el formulario de cambio de contraseña
document.getElementById("password-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        alert("Las contraseñas nuevas no coinciden");
        return;
    }

    alert("Contraseña cambiada exitosamente");
    togglePasswordModal();
    this.reset();
});

// Event listener para la carga inicial de la página
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar panel inicial
    showPanel("plan-actual");

    // Configurar imagen de perfil
    const profileImage = document.getElementById("profile-image");
    if (profileImage) {
        profileImage.style.objectFit = "cover";
    }

    // Configurar listeners para casilleros disponibles
    document.querySelectorAll(".locker.available").forEach(locker => {
        locker.addEventListener("click", () => {
            toggleLockerModal(locker.textContent);
        });
    });

    // Configurar botones del menú
    document.querySelectorAll(".menu button").forEach(button => {
        button.addEventListener("click", () => {
            const panelId = button.getAttribute("onclick").match(/'([^']+)'/)[1];
            showPanel(panelId);
        });
    });

    // Configurar botones de redirección
    document.querySelector(".cta-button")?.addEventListener("click", () => {
        showPanel("planes-disponibles");
    });

    document.querySelector(".button-aportar")?.addEventListener("click", () => {
        showPanel("solicitudes");
    });

    // Configurar todos los botones de cierre de modal
    document.querySelectorAll(".close-modal").forEach(closeButton => {
        closeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            const modal = closeButton.closest(".modal");
            if (modal) {
                modal.style.display = "none";
            }
        });
    });

    // Configurar botones dentro de los modales
    // Modal de casillero
    const lockerModal = document.getElementById("locker-modal");
    if (lockerModal) {
        // Botón cancelar
        lockerModal.querySelector(".modal-btn-secondary")?.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleLockerModal();
        });

        // Botón seleccionar
        lockerModal.querySelector(".modal-btn-primary")?.addEventListener("click", (e) => {
            e.stopPropagation();
            confirmLockerSelection();
        });
    }

    // Modal de éxito
    const successModal = document.getElementById("success-modal");
    if (successModal) {
        successModal.querySelector(".modal-btn-primary")?.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSuccessModal();
        });
    }

    // Modal de no disponible
    const unavailableModal = document.getElementById("unavailable-modal");
    if (unavailableModal) {
        unavailableModal.querySelector(".modal-btn-primary")?.addEventListener("click", (e) => {
            e.stopPropagation();
            redirectToSolicitudes();
        });
    }
});

// Event listener para cerrar modales al hacer clic fuera
window.addEventListener("click", (event) => {
    const modals = {
        "password-modal": togglePasswordModal,
        "locker-modal": toggleLockerModal,
        "success-modal": toggleSuccessModal,
        "unavailable-modal": toggleUnavailableModal
    };

    Object.entries(modals).forEach(([modalId, toggleFunction]) => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            toggleFunction();
        }
    });
});

const imageUpdater = new ImageUpdater(
    "https://codebyelaina.com/bucket/image/logo_aeis.png",
    ".logo_aeis"
);
imageUpdater.updateImage();
getPerfilData(cedula);

