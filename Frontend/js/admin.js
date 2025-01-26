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

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
    cerrarModal("approve-modal");
    cerrarModal("reject-modal");
    obtenerInformacionPerfil();

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