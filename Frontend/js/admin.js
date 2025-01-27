// Mostrar y ocultar paneles
window.showPanel = function (panelId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => panel.classList.remove('panel--active'));
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) selectedPanel.classList.add('panel--active');
};

// Mostrar modal de aprobación
window.showApproveModal = function (solicitudId, nombreUsuario, emailUsuario) {
    const modal = document.getElementById("approve-modal");
    document.getElementById("approve-user-name").textContent = nombreUsuario;

    document.getElementById("approve-confirm-btn").onclick = function () {
        actualizarEstadoSolicitud(solicitudId, "Aprobado", emailUsuario);
        cerrarModal("approve-modal");
    };

    modal.style.display = "flex";
};

// Mostrar modal de rechazo
window.showRejectModal = function (solicitudId, emailUsuario) {
    const modal = document.getElementById("reject-modal");

    document.getElementById("reject-confirm-btn").onclick = function () {
        actualizarEstadoSolicitud(solicitudId, "Rechazado", emailUsuario);
        cerrarModal("reject-modal");
    };

    modal.style.display = "flex";
};

// Cerrar modal
window.cerrarModal = function (modalId) {
    document.getElementById(modalId).style.display = "none";
};

const API_URL = "http://localhost:3000/solicitudes/";
const IMAGE_URL = "http://localhost:3000/bucket/solicitud/";
const IMAGE_PROFILE_URL = "http://localhost:3000/bucket/perfil";

// Obtener solicitudes desde la API
async function obtenerSolicitudesPorEstado(estado, containerId, renderCallback) {
    try {
        const queryParams = new URLSearchParams({ estado, limit: 10, page: 1 });
        const opciones = { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } };

        const respuesta = await fetch(`${API_URL}?${queryParams.toString()}`, opciones);
        if (!respuesta.ok) throw new Error(`Error al obtener solicitudes (${estado}): ${respuesta.statusText}`);

        const datos = await respuesta.json();
        console.log(`Solicitudes ${estado} obtenidas:`, datos);
        renderCallback(datos, containerId);
    } catch (error) {
        console.error(`Error al obtener solicitudes (${estado}):`, error);
        alert(`Hubo un error al obtener las solicitudes ${estado}.`);
    }
}

// Obtener URL de la imagen firmada
async function obtenerImagenFirmada(id) {
    try {
        const respuesta = await fetch(`${IMAGE_URL}${id}`, { method: "GET", credentials: "include" });
        if (!respuesta.ok) throw new Error(`Error al obtener la URL firmada: ${respuesta.statusText}`);

        const data = await respuesta.json();
        return data.url;
    } catch (error) {
        console.error(`Error al obtener la URL firmada para la solicitud ${id}:`, error);
        return "/assets/images/defecto.png";
    }
}

// Renderizar solicitudes
async function generarSolicitudes(solicitudes, containerId, opciones) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (solicitudes.length === 0) {
        container.innerHTML = `<p>No hay solicitudes en ${opciones.titulo.toLowerCase()}.</p>`;
        return;
    }

    for (const solicitud of solicitudes) {
        const imageUrl = await obtenerImagenFirmada(solicitud._id);

        const solicitudElement = document.createElement("details");
        solicitudElement.classList.add("solicitud-details");
        solicitudElement.setAttribute("data-id", solicitud._id);

        solicitudElement.innerHTML = `
            <summary>
                <span class="solicitud-type">${solicitud.tipo}</span> - 
                <span class="solicitud-name">${solicitud.perfil.nombreCompleto}</span> 
                ${opciones.estadoAdicional ? `<span class="estado-adicional">${opciones.estadoAdicional(solicitud)}</span>` : ""}
            </summary>
            <div class="solicitud-content">
                <p><span>Detalle:</span> ${solicitud.plan.nombre}</p>
                <p><span>Precio:</span> $${solicitud.plan.precio}</p>
                <p><span>Correo:</span> ${solicitud.perfil.email}</p>
                <p><span>Fecha de envío:</span> ${new Date(solicitud.fechaEnvio).toLocaleString()}</p>
                <p><span>Estado:</span> ${solicitud.estado}</p>
                <div class="comprobante-container">
                    <img src="${imageUrl}" alt="Comprobante" class="comprobante-img" />
                </div>
                <div class="action-buttons">
                    ${opciones.botones(solicitud)}
                </div>
            </div>
        `;

        container.appendChild(solicitudElement);
    }
}

// Actualizar estado de la solicitud
async function actualizarEstadoSolicitud(solicitudId, nuevoEstado, emailUsuario) {
    try {
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
        }, {});

        const csrfToken = cookies.csrfToken;
        if (!csrfToken) throw new Error("CSRF token no encontrado en las cookies.");

        const opcionesEstado = {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrfToken,
            },
            body: JSON.stringify({ id: solicitudId, estado: nuevoEstado }),
        };

        const respuestaEstado = await fetch(`${API_URL}/estado`, opcionesEstado);
        if (!respuestaEstado.ok) throw new Error(`Error al actualizar el estado: ${respuestaEstado.statusText}`);

        const opcionesEmail = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailUsuario, tipo: "Administrador" }),
        };

        const respuestaEmail = await fetch("http://localhost:5000/email/notificar", opcionesEmail);
        if (!respuestaEmail.ok) throw new Error(`Error al enviar la notificación por correo: ${respuestaEmail.statusText}`);

        location.reload();
    } catch (error) {
        console.error(`Error al actualizar la solicitud ${solicitudId}:`, error);
        alert("Hubo un error al actualizar la solicitud o enviar la notificación.");
    }
}

// Crear administrador
window.createAdmin = async function (event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    const errors = [];
    if (!nombre || nombre.length > 30) errors.push("El nombre debe tener entre 1 y 30 caracteres.");
    if (!apellido || apellido.length > 30) errors.push("El apellido debe tener entre 1 y 30 caracteres.");
    if (!/^\d{10}$/.test(cedula)) errors.push("La cédula debe contener exactamente 10 dígitos numéricos.");
    if (!/^[\w._%+-]+@epn\.edu\.ec$/.test(correo)) errors.push("El correo debe ser válido y del dominio epn.edu.ec.");
    if (!password || password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirmPassword) errors.push("Las contraseñas no coinciden.");

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    try {
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
        }, {});

        const csrfToken = cookies.csrfToken;
        if (!csrfToken) throw new Error("CSRF token no encontrado en las cookies.");

        const data = { nombreCompleto: `${nombre} ${apellido}`, email: correo, cedula, contraseña: password };
        const opciones = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrfToken,
            },
            body: JSON.stringify(data),
        };

        const respuesta = await fetch("http://localhost:3000/perfiles/admin", opciones);
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(`Error al crear administrador: ${errorData.message || respuesta.statusText}`);
        }

        alert("Administrador creado con éxito.");
        event.target.reset();
    } catch (error) {
        console.error("Error al crear el administrador:", error);
        alert("Hubo un error al crear el administrador.");
    }
};

const PROFILE_API_URL = "http://localhost:3000/perfiles/";

async function obtenerInformacionPerfil() {
    try {
        const opciones = {
            method: "GET",
            credentials: "include", // Incluye cookies para autenticación
            headers: {
                "Content-Type": "application/json",
            },
        };

        const respuesta = await fetch(PROFILE_API_URL, opciones);

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la información del perfil: ${respuesta.statusText}`);
        }

        const perfil = await respuesta.json();
        console.log("Información del perfil obtenida:", perfil);

        // Llenar información en el `profile-card`
        llenarInformacionPerfil(perfil);

        // Almacenar el correo del usuario para el panel de crear admin
        window.usuarioCorreo = perfil.email; // Almacenamos el correo en una variable global para usarlo más tarde
    } catch (error) {
        console.error("Error al obtener la información del perfil:", error);
        alert("Hubo un error al obtener la información del perfil.");
    }
}


async function obtenerImagenPerfil() {
    try {
        // Obtener el CSRF token de las cookies
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
        }, {});

        const csrfToken = cookies.csrfToken; // Asegúrate de que el nombre de la cookie sea correcto

        if (!csrfToken) {
            throw new Error("CSRF token no encontrado en las cookies.");
        }

        // Opciones para la solicitud
        const opciones = {
            method: "GET",
            credentials: "include", // Incluir cookies para autenticación
            headers: {
                "x-csrf-token": csrfToken, // Adjuntar el CSRF token en los headers
            },
        };

        // Realizar la solicitud para obtener la imagen firmada
        const respuesta = await fetch(IMAGE_PROFILE_URL, opciones);

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la URL firmada de la imagen: ${respuesta.statusText}`);
        }

        const data = await respuesta.json();
        return data.url; // Devolver la URL de la imagen firmada
    } catch (error) {
        console.error("Error al obtener la imagen del perfil:", error);
        return "../content/default-image.png"; // Ruta por defecto si hay un error
    }
}


function llenarInformacionPerfil(perfil) {
    const profileImage = document.getElementById("profile-image");
    const profileName = document.getElementById("profile-name");
    const profileId = document.getElementById("profile-id");
    const profileEmail = document.getElementById("profile-email");

    obtenerImagenPerfil(perfil.imagen).then((imageUrl) => {
        console.log("URL de la imagen del perfil:", imageUrl);
        profileImage.src = imageUrl;
    }).catch((error) => {
        console.error("Error al cargar la imagen del perfil:", error);
    });

    // Establecer el nombre, cédula y correo
    profileName.textContent = perfil.nombreCompleto || "Nombre no disponible";
    profileId.textContent = perfil.cedula || "Cédula no disponible";
    profileEmail.textContent = perfil.email || "Correo no disponible";
}

function setupProfilePictureChange() {
    console.log("setupProfilePictureChange llamada");
    const changePictureForm = document.getElementById("change-picture-form");

    if (!changePictureForm) {
        console.error("El formulario 'change-picture-form' no existe en el DOM.");
        return;
    }

    changePictureForm.addEventListener("submit", async function (event) {
        console.log("Evento submit activado");
        event.preventDefault();
        const fileInput = document.getElementById("profile-picture-input");
        const file = fileInput.files[0];

        if (!file) {
            alert("Por favor selecciona una imagen.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const csrfToken = document.cookie
                .split("; ")
                .find(row => row.startsWith("csrfToken"))
                ?.split("=")[1];

            if (!csrfToken) {
                throw new Error("CSRF token no encontrado.");
            }

            const response = await fetch("http://localhost:3000/bucket/perfil", {
                method: "PUT",
                headers: {
                    "x-csrf-token": csrfToken,
                },
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al actualizar la imagen: ${errorData.message || response.statusText}`);
            }

            alert("Foto de perfil subida con éxito. Actualizando información...");
            await obtenerInformacionPerfil(); // Actualiza la información del perfil
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("Hubo un error al subir la imagen.");
        }
    });
}


window.triggerFileInput = function() {
    const fileInput = document.getElementById("profile-picture-input");
    fileInput.click();

    fileInput.addEventListener("change", function () {
        const changePictureForm = document.getElementById("change-picture-form");
        if (changePictureForm) {
            console.log("Disparando evento submit manualmente");
            changePictureForm.dispatchEvent(new Event("submit")); // Forzar el evento submit
        }
    });
}

window.submitChangePassword = async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmNewPassword = document.getElementById("confirm-new-password").value.trim();

    if (newPassword !== confirmNewPassword) {
        alert("La nueva contraseña y su confirmación no coinciden.");
        showPanel("solicitudes-pendientes"); // Redirigir al panel de pendientes
        return;
    }

    // Evitar múltiples envíos deshabilitando el botón
    const submitButton = event.target.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
        // Obtener el email del usuario desde la variable global `window.usuarioCorreo`
        const email = window.usuarioCorreo;

        // Validar que el email esté disponible
        if (!email) {
            throw new Error("No se pudo obtener el correo del usuario.");
        }

        // Realizar la petición POST para enviar el email y solicitar el código
        const response = await fetch("http://localhost:5000/email/reset_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error("Error al solicitar el código de verificación.");
        }

        alert("Código de verificación enviado al correo.");
        showResetPasswordModal(); // Mostrar la ventana modal
    } catch (error) {
        console.error("Error al solicitar el cambio de contraseña:", error);
        alert("Hubo un error al intentar cambiar la contraseña. Por favor, intenta de nuevo.");
        showPanel("solicitudes-pendientes"); // Redirigir al panel de pendientes en caso de error
    } finally {
        // Rehabilitar el botón después de la operación
        submitButton.disabled = false;
    }
};

function showResetPasswordModal() {
    // Crear el modal HTML con las clases acopladas al CSS
    const modalHtml = `
        <div id="reset-password-modal" class="modal show">
            <div class="modal-content">
                <h2>Ingrese el Código de Verificación</h2>
                <p>Introduce el código que se envió a tu correo electrónico.</p>
                <input 
                    type="text" 
                    id="verification-code" 
                    placeholder="Código de verificación" 
                    required 
                    style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #ccc;"
                />
                <div class="modal-buttons">
                    <button 
                        class="modal-btn modal-btn-primary" 
                        onclick="submitPasswordUpdate()"
                    >
                        Enviar
                    </button>
                    <button 
                        class="modal-btn modal-btn-secondary" 
                        onclick="closeModalAndRedirect()"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    // Insertar el modal en el DOM
    document.body.insertAdjacentHTML("beforeend", modalHtml);
}

window.closeModalAndRedirect = function() {
    closeModal();
    showPanel("solicitudes-pendientes"); // Redirigir al panel de pendientes
}

function closeModal() {
    const modal = document.getElementById("reset-password-modal");
    if (modal) {
        modal.remove();
    }
}

window.submitPasswordUpdate = async function() {
    const email = window.usuarioCorreo;
    const verificationCode = document.getElementById("verification-code").value.trim();
    const currentPassword = document.getElementById("current-password").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmNewPassword = document.getElementById("confirm-new-password").value.trim();

    if (!email || !verificationCode || !currentPassword || !newPassword || !confirmNewPassword) {
        alert("Por favor, complete todos los campos.");
        showPanel("solicitudes-pendientes"); // Redirigir al panel de pendientes en caso de error
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("La nueva contraseña y su confirmación no coinciden.");
        showPanel("solicitudes-pendientes"); // Redirigir al panel de pendientes en caso de error
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/perfil/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                code: verificationCode,
                nueva_contraseña: newPassword,
                confirmar_contraseña: currentPassword,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al actualizar la contraseña: ${errorData.message || response.statusText}`);
        }

        alert("Contraseña actualizada con éxito.");
        closeModal(); // Cerrar la ventana modal
        showPanel("solicitudes-pendientes"); // Redirigir al panel principal
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Hubo un error al actualizar la contraseña. Por favor, intenta de nuevo.");
        showPanel("solicitudes-pendientes"); // Redirigir al panel de pendientes en caso de error
        closeModal(); // Cerrar la ventana modal
    }
}

async function loadNavbarLogo() {
    const logoElement = document.querySelector(".navbar__logo");
    const logoFilename = "logo_aeis.png"; // Nombre del archivo de la imagen

    try {
        // Solicitar la URL firmada al backend
        const response = await fetch(`http://localhost:3000/bucket/static/${logoFilename}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error al obtener la URL firmada del logo.");
        }

        const data = await response.json();
        const logoUrl = data.url;

        // Establecer la imagen como fondo del logo
        if (logoElement) {
            logoElement.style.backgroundImage = `url('${logoUrl}')`;
            logoElement.style.backgroundSize = "cover";
            logoElement.style.backgroundPosition = "center";
        }
    } catch (error) {
        console.error("Error al cargar el logo del navbar:", error);
        alert("No se pudo cargar el logo del sistema.");
    }
}


window.redirectToIndex = function() {
    window.location.href = "../../index.html";
}

window.logout = async function() {
    try {
        // Obtener el CSRF token de las cookies
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
        }, {});

        const csrfToken = cookies.csrfToken;
        if (!csrfToken) throw new Error("CSRF token no encontrado.");

        // Realizar la petición de logout
        const response = await fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken,
            },
        });

        if (!response.ok) {
            throw new Error("Error al cerrar sesión.");
        }

        clearTokenExpiration();
        localStorage.clear();
        window.location.href = "../../index.html";
    } catch (error) {
        redirectToIndex()
        console.error("Error al cerrar sesión:", error);
    }
}

let csrfExpirationTime = null; // Variable global para la expiración
let sessionCheckIntervalId = null;

function getCookieValue(cookieName) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
    if (!cookie) {
        console.warn(`La cookie '${cookieName}' no está disponible.`);
        return null;
    }
    return decodeURIComponent(cookie.split("=")[1]);
}

function setTokenExpiration() {
    const csrfCookie = getCookieValue("csrfToken");
    if (!csrfCookie) {
        console.warn("No se encontró la cookie 'csrfToken'. Asegúrate de que el backend la envíe correctamente.");
        return;
    }

    // Recuperar la expiración directamente desde localStorage si existe
    const storedExpiration = localStorage.getItem("csrfExpirationTime");
    if (storedExpiration) {
        csrfExpirationTime = parseInt(storedExpiration, 10);
        console.log("Tiempo de expiración cargado desde localStorage:", new Date(csrfExpirationTime).toLocaleString());
        return;
    }

    // Establecer un nuevo tiempo si no existe en localStorage
    csrfExpirationTime = Date.now() + 15 * 60 * 1000; // 15 minutos desde ahora
    localStorage.setItem("csrfExpirationTime", csrfExpirationTime);
    console.log("Tiempo de expiración establecido:", new Date(csrfExpirationTime).toLocaleString());
}

function getTokenRemainingTime() {
    if (!csrfExpirationTime) {
        console.warn("El tiempo de expiración no está establecido. Asegúrate de llamar a 'setTokenExpiration()' primero.");
        return null;
    }

    const now = Date.now();
    const remainingTime = (csrfExpirationTime - now) / 1000; // Convertir a segundos
    if (remainingTime <= 0) {
        console.warn("El token ya ha expirado.");
        return 0;
    }
    console.log("Tiempo restante (s):", remainingTime);
    return remainingTime;
}

function clearTokenExpiration() {
    localStorage.removeItem("csrfExpirationTime");
    csrfExpirationTime = null;
}

function showSessionExtensionModal() {
    const modalHtml = `
        <div id="session-extension-modal" class="modal">
            <div class="modal-content">
                <h2>Extender Sesión</h2>
                <p>Tu sesión está a punto de expirar. ¿Deseas extenderla?</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-primary" onclick="extendSession()">Extender Sesión</button>
                    <button class="modal-btn modal-btn-secondary" onclick="logoutAndRedirect()">Salir</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeSessionExtensionModal() {
    const modal = document.getElementById("session-extension-modal");
    if (modal) modal.remove();
}

window.logoutAndRedirect = function () {
    closeSessionExtensionModal();
    logout();
    clearTokenExpiration();
    window.location.href = "../../index.html";
};

window.extendSession = async function () {
    try {
        const response = await fetch("http://localhost:3000/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error al extender la sesión.");

        closeSessionExtensionModal();
        alert("Sesión extendida con éxito.");

        // Actualizar el tiempo de expiración basado en la nueva sesión
        csrfExpirationTime = Date.now() + 15 * 60 * 1000; // 15 minutos más
        localStorage.setItem("csrfExpirationTime", csrfExpirationTime);

        // Detener cualquier verificación previa y reiniciar
        if (sessionCheckIntervalId) clearInterval(sessionCheckIntervalId);
        startSessionCheck();
    } catch (error) {
        console.error("Error al extender la sesión:", error);
        alert("No se pudo extender la sesión. Serás redirigido al inicio.");
        logoutAndRedirect();
    }
};

function startSessionCheck() {
    const checkInterval = 1000; // Verificar cada segundo
    const warningTime = 60; // Tiempo restante en segundos para mostrar el modal
    const autoCloseTime = 10; // Tiempo antes de la expiración para cerrar el modal
    let modalShown = false; // Estado para saber si el modal ya fue mostrado

    // Detener cualquier intervalo previo
    if (sessionCheckIntervalId) clearInterval(sessionCheckIntervalId);

    sessionCheckIntervalId = setInterval(() => {
        const remainingTime = getTokenRemainingTime();
        if (remainingTime === null) {
            clearInterval(sessionCheckIntervalId);
            console.warn("No se pudo obtener el tiempo restante del token.");
            return;
        }

        // Mostrar el modal si está dentro del rango de advertencia
        if (remainingTime <= warningTime && remainingTime > autoCloseTime && !modalShown) {
            modalShown = true; // Marcar que el modal fue mostrado
            showSessionExtensionModal(); // Mostrar el modal
        }
        // Cerrar el modal automáticamente antes de la expiración y redirigir
        else if (remainingTime <= autoCloseTime && modalShown) {
            clearInterval(sessionCheckIntervalId); // Detener el intervalo
            closeSessionExtensionModal(); // Cerrar el modal
            logoutAndRedirect(); // Redirigir al usuario al inicio de sesión o página principal
        }
        // Redirigir al usuario si el token ha expirado
        else if (remainingTime <= 0) {
            clearInterval(sessionCheckIntervalId);
            console.warn("El token ha expirado.");
            logoutAndRedirect(); // Redirigir al usuario al inicio de sesión o página principal
        }
    }, checkInterval);
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
    loadNavbarLogo();
    cerrarModal("approve-modal");
    cerrarModal("reject-modal");
    obtenerInformacionPerfil();
    setupProfilePictureChange();
    setTokenExpiration();
    startSessionCheck();

    obtenerSolicitudesPorEstado("Por verificar", "solicitudes-pendientes-container", (datos, id) =>
        generarSolicitudes(datos, id, {
            titulo: "Solicitudes Pendientes",
            estadoAdicional: () => "",
            botones: (solicitud) => `
                <button class="approve-btn" onclick="showApproveModal('${solicitud._id}', '${solicitud.perfil.nombreCompleto}', '${solicitud.perfil.email}')">Aprobar</button>
                <button class="reject-btn" onclick="showRejectModal('${solicitud._id}', '${solicitud.perfil.email}')">Rechazar</button>
            `,
        })
    );

    obtenerSolicitudesPorEstado("Aprobado", "solicitudes-aprobadas-container", (datos, id) =>
        generarSolicitudes(datos, id, {
            titulo: "Solicitudes Aprobadas",
            estadoAdicional: (solicitud) => `APROBADO EN: ${new Date(solicitud.fechaAprobacion).toLocaleDateString()}`,
            botones: () => "",
        })
    );

    obtenerSolicitudesPorEstado("Rechazado", "solicitudes-rechazadas-container", (datos, id) =>
        generarSolicitudes(datos, id, {
            titulo: "Solicitudes Rechazadas",
            estadoAdicional: (solicitud) => `RECHAZADO EN: ${new Date(solicitud.fechaEnvio).toLocaleDateString()}`,
            botones: (solicitud) => `
                <button class="approve-btn" onclick="showApproveModal('${solicitud._id}', '${solicitud.perfil.nombreCompleto}', '${solicitud.perfil.email}')">Aprobar</button>
            `,
        })
    );
});