
let perfil = null;
let availableLockers = [];
let occupiedLockers = [];
let reservedLockers = [];
let csrfExpirationTime = null;
let sessionCheckIntervalId = null;

const DOM_ELEMENTS = {
    userName: document.getElementById("profile-name"),
    userId: document.getElementById("profile-id"),
    userEmail: document.getElementById("profile-email"),
    currentPlanButton: document.querySelector(".plan__cta"),
    currentPlanPanel: document.getElementById("current-plan"),
    availablePlansPanel: document.getElementById("available-plans"),
    lockerPanel: document.getElementById("locker"),
    requestPanel: document.getElementById("requests"),
    myRequestsButton: document.querySelector(".my-requests-button"),
    createRequestButton: document.querySelector(".create-request-button"),
    myRequestsPanel: document.querySelector(".my-requests"),
    createRequestPanel: document.querySelector(".create-request"),
    createRequestLockerButton: document.querySelector(".locker-button"),
    createRequestPlanButton: document.querySelector(".plan-button"),
    createRequestLockerPanel: document.querySelector(".create-locker-request"),
    createRequestPlanPanel: document.querySelector(".create-plan-request"),
    submitLockerRequest: document.getElementById("create-locker-request"),
    submitPlanRequest: document.getElementById("create-plan-request"),
};

const ROUTES = {
    getPerfil: "http://localhost:3000/perfiles",
    getPlans: "http://localhost:3000/planes/",
    getCasilleros: "http://localhost:3000/casilleros/",
    getRequests: "http://localhost:3000/perfiles/solicitudes/",
    postRequests: "http://localhost:3000/solicitudes/",
    postImage: "http://localhost:3000/bucket/solicitud/",
    sendNotification: "http://localhost:5000/email/notificar",
    postImagePerfil: "http://localhost:3000/bucket/perfil/",
};

async function sendNotification() {
    fetch(ROUTES.sendNotification, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "admin@epn.edu.ec", tipo: "Cliente" })
    });
}


function showMyRequestsPanel() {
    DOM_ELEMENTS.myRequestsButton.classList.add("active");
    DOM_ELEMENTS.createRequestButton.classList.remove("active");

    DOM_ELEMENTS.myRequestsPanel.style.display = "block";
    DOM_ELEMENTS.createRequestPanel.style.display = "none";

    // Llamar a la función asíncrona para llenar el panel
    fillMyRequestsPanel();
}

async function fillMyRequestsPanel() {
    const myRequestsPanel = DOM_ELEMENTS.myRequestsPanel;
    myRequestsPanel.innerHTML = "";

    // Esperar a que se obtengan las solicitudes
    const requests = await getRequests();

    if (requests.length !== 0) {
        console.log("Hay solicitudes.");

        for (const request of requests) {
            const imageUrl = await getImage(request._id);
            console.log(imageUrl);

            const requestStatusClass = request.estado.toLowerCase().replace(" ", "-");
            const requestType = request.tipo;
            const requestId = request._id;
            const requestCreationDate = request.fechaEnvio;
            const requestApprovalDate = request.fechaAprobacion || "N/A";

            const requestDetails = document.createElement("details");
            requestDetails.classList.add("request-details");

            const requestSummary = document.createElement("summary");
            requestSummary.classList.add("request-card");

            const requestStatus = document.createElement("span");
            requestStatus.classList.add("request-card__status", requestStatusClass);
            requestStatus.textContent = request.estado;

            const requestTypeSpan = document.createElement("span");
            requestTypeSpan.classList.add("request-card__type");
            requestTypeSpan.textContent = requestType;

            const requestToggleButton = document.createElement("button");
            requestToggleButton.classList.add("request-card__toggle");
            requestToggleButton.textContent = "▼";

            requestSummary.appendChild(requestStatus);
            requestSummary.appendChild(requestTypeSpan);
            requestSummary.appendChild(requestToggleButton);

            const requestDetailsContent = document.createElement("div");
            requestDetailsContent.classList.add("request-details__content");

            requestDetailsContent.innerHTML = `
            <p><strong>ID Solicitud:</strong> ${requestId}</p>
            <p><strong>Tipo de Solicitud:</strong> ${requestType}</p>
            <p><strong>Fecha de Creación:</strong> ${requestCreationDate}</p>
            <p><strong>Fecha de Aprobación:</strong> ${requestApprovalDate}</p>
            <div class="request-details__proof">
                <p><strong>Comprobante:</strong></p>
                <a href="${imageUrl}" target="_blank">
                    <img src="${imageUrl}" alt="Comprobante ${request.estado}">
                </a>
            </div>
        `;

            requestDetails.appendChild(requestSummary);
            requestDetails.appendChild(requestDetailsContent);

            myRequestsPanel.appendChild(requestDetails);
        }
    } else {
        console.log("No hay solicitudes.");
        myRequestsPanel.innerHTML = `<p class="no-requests-message">No tienes solicitudes.</p>`;
    }
}



async function getRequests() {
    try {
        const response = await fetch(ROUTES.getRequests, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Solicitudes obtenidas:", data);
        return data; // Devolver los datos obtenidos
    } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
        return []; // Devolver un array vacío si ocurre un error
    }
}


async function showCreateRequestPanel() {
    DOM_ELEMENTS.submitPlanRequest.style.display = "block";
    DOM_ELEMENTS.myRequestsButton.classList.remove("active");
    DOM_ELEMENTS.createRequestButton.classList.add("active");
    DOM_ELEMENTS.myRequestsPanel.style.display = "none";
    DOM_ELEMENTS.createRequestPanel.style.display = "block";
}

async function hasPendingRequest() {
    console.log("entre a hasPendingRequest");
    const requests = await getRequests(); // Llama a la función para obtener las solicitudes
    const requestInfo = document.querySelector(".has-requests");
    requestInfo.style.display = "none";
    // Verifica que existan solicitudes
    if (requests && requests.length > 0) {
        let hasPendingPlan = false; // Bandera para saber si hay solicitudes pendientes de tipo Plan
        console.log("-------------------------------")
        console.log(requests[0].estado);
        // Itera sobre las solicitudes
        requests.forEach(request => {
            // Normaliza el estado y verifica la condición
            const estado = request.estado?.toLowerCase();
            console.log(estado);
            if ((estado === "por verificar" || estado === "aprobado") && request.tipo === "Plan") {
                hasPendingPlan = true;
            }
        });

        if (hasPendingPlan) {
            console.log("Tienes una solicitud de plan pendiente.");
            if (DOM_ELEMENTS.submitPlanRequest) {
                requestInfo.style.display = "block";
                DOM_ELEMENTS.submitPlanRequest.style.display = "none";
            } else {
                console.error("El elemento submitPlanRequest no está definido.");
            }
        }
    } else {
        console.log("No hay solicitudes pendientes.");
    }
}


function showLockerPanelRequest() {
    DOM_ELEMENTS.createRequestLockerButton.classList.add("active");
    DOM_ELEMENTS.createRequestPlanButton.classList.remove("active");
    DOM_ELEMENTS.createRequestLockerPanel.style.display = "block";
    DOM_ELEMENTS.createRequestPlanPanel.style.display = "none";

    fillLockerPanelRequest();
}

async function fillLockerPanelRequest() {
    const lockers = await getAvailableLockers();
    const lockerDropdown = document.getElementById("locker-number");
    lockerDropdown.innerHTML = '<option value="">Seleccione un casillero</option>';
    console.log(lockers);
    lockers.forEach(locker => {
        const option = document.createElement("option");
        option.value = locker._id;
        option.textContent = `Casillero ${locker.numero}`;
        lockerDropdown.appendChild(option);
    });
}

function showPlanPanelRequest() {
    DOM_ELEMENTS.createRequestLockerButton.classList.remove("active");
    DOM_ELEMENTS.createRequestPlanButton.classList.add("active");
    DOM_ELEMENTS.createRequestLockerPanel.style.display = "none";
    DOM_ELEMENTS.createRequestPlanPanel.style.display = "block";

    fillPlanPanelRequest();
}

async function fillPlanPanelRequest() {
    hasPendingRequest();
    const plans = await getPlans(); // Obtiene los planes desde el servidor
    const planDropdown = document.getElementById("plan-type");

    // Limpiar el dropdown antes de llenarlo
    planDropdown.innerHTML = '<option value="">Seleccione un plan</option>';

    plans.forEach(plan => {
        if (!plan.esPorDefecto) {
            const option = document.createElement("option");
            option.value = plan._id;
            option.textContent = `${plan.nombre} - $${plan.precio}`;
            option.setAttribute("data-price", plan.precio); // Agregar el precio como atributo
            planDropdown.appendChild(option);
        }
    });

    // Agregar el evento para crear y mostrar el elemento dinámico
    planDropdown.addEventListener("change", (event) => {
        const selectedOption = event.target.selectedOptions[0]; // La opción seleccionada
        const price = selectedOption ? selectedOption.dataset.price : null;

        // Verificar si el precio es válido
        if (price) {
            // Crear el elemento dinámico para mostrar el precio
            const amountContainer = document.querySelector(".create-request-group.create-request-group--ammount");

            // Remover cualquier elemento de precio existente
            const existingAmountSpan = document.querySelector(".create-request-amount");
            if (existingAmountSpan) {
                existingAmountSpan.remove();
            }

            // Crear el nuevo elemento <span>
            const amountSpan = document.createElement("span");
            amountSpan.classList.add("create-request-amount");
            amountSpan.textContent = `$${price}`;

            // Añadir el nuevo <span> al contenedor
            amountContainer.appendChild(amountSpan);

            console.log("Precio seleccionado:", price); // Verificar el precio en consola
        }
    });
}




window.showPanel = function (panelId) {
    // Ocultar todos los paneles
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.classList.remove('panel--active');
    });

    // Mostrar el panel seleccionado
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.classList.add('panel--active');
    }
};


// Función para obtener el perfil del usuario
async function getPerfil() {
    try {
        const response = await fetch(ROUTES.getPerfil, {
            credentials: "include", // Enviar cookies o credenciales
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos obtenidos:", data); // Para depuración
        fillCurrentPlanPanel(data);
        return data;
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
    }
}

// Función para llenar los campos del perfil en el DOM
function fillProfileCard(data) {
    if (!data) {
        console.error("Datos del perfil no disponibles.");
        return;
    }

    DOM_ELEMENTS.userName.textContent = data.nombreCompleto || "No disponible";
    DOM_ELEMENTS.userId.textContent = data.cedula || "No disponible";
    DOM_ELEMENTS.userEmail.textContent = data.email || "No disponible";

    // Obtener la imagen de perfil y establecerla en el DOM
    obtenerImagenPerfil().then((url) => {
        const profileImage = document.getElementById("profile-image");
        profileImage.src = url;
        profileImage.alt = "Imagen de perfil";
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function obtenerImagenPerfil() {
    try {
        const csrfToken = getCookie('csrfToken');
        const respuesta = await fetch(ROUTES.postImagePerfil, { method: "GET", credentials: "include", headers: { "x-csrf-token": csrfToken } });
        if (!respuesta.ok) throw new Error("Error al obtener la imagen del perfil.");

        const data = await respuesta.json();
        return data.url;
    } catch (error) {
        console.error("Error al obtener la imagen del perfil:", error);
        return "../content/default-image.png";
    }
}

function fillCurrentPlanPanel(data) {
    const currentPlanPanel = document.getElementById("current-plan");
    const loadingMessage = currentPlanPanel.querySelector(".plan__default-message");
    const planTitle = currentPlanPanel.querySelector(".plan__title");
    const planDescriptionContainer = currentPlanPanel.querySelector(".plan__description-container");
    const planImage = currentPlanPanel.querySelector(".plan__image img");
    const ctaButton = currentPlanPanel.querySelector(".plan__cta");

    // Limpiar beneficios previos
    planDescriptionContainer.innerHTML = "";
    // Ocultar el mensaje de "Cargando..."
    loadingMessage.style.display = "none";
    console.log(data.plan.nombre);
    if (data.plan && data.plan.nombre === "Sin Plan") {
        // Si no hay un plan activo
        planTitle.textContent = "No tienes un plan activo";
        planDescriptionContainer.innerHTML = `<p class="plan__description">¡Únete a nuestra comunidad y disfruta de todos los beneficios que tenemos para ti!</p>`;
        planImage.src = "../content/triste.png";
        planImage.alt = "No plan active";
        ctaButton.style.display = "inline-block"; // Mostrar el botón de acción
    } else {
        // Si hay un plan activo
        planTitle.textContent = data.plan.nombre.toUpperCase();
        // Crear lista de beneficios dinámicamente
        const benefitsList = document.createElement("ul");
        benefitsList.classList.add("plan__benefits");
        data.plan.beneficios.forEach((beneficio) => {
            const listItem = document.createElement("li");
            listItem.textContent = beneficio;
            benefitsList.appendChild(listItem);
        });
        planDescriptionContainer.appendChild(benefitsList);
        planImage.src = "../content/emocionado.png";
        planImage.alt = "Plan activo";
        ctaButton.style.display = "none";
    }
}

async function createAndAppendPlanCards() {
    const container = document.querySelector('.plans-grid');
    const plans = await getPlans();

    // Filtrar los planes que no son por defecto
    const filteredPlans = plans.filter(plan => !plan.esPorDefecto);

    const button = document.querySelector(".plans-grid__cta");
    const noPlanMessage = document.querySelector(".no__plan-message");

    // Si no hay planes disponibles, mostrar mensaje
    if (filteredPlans.length === 0) {
        button.style.display = "none";
        if (noPlanMessage) noPlanMessage.style.display = "block"; // Mostrar el mensaje si no hay planes
        return;
    } else {
        if (noPlanMessage) noPlanMessage.style.display = "none"; // Ocultar el mensaje si hay planes
    }

    // Limpiar solo las tarjetas de planes sin borrar los mensajes predeterminados
    const existingPlanCards = container.querySelectorAll(".plan-card");
    existingPlanCards.forEach(card => card.remove());

    // Crear y añadir una tarjeta por cada plan filtrado
    filteredPlans.forEach(plan => {
        // Crear el contenedor de la tarjeta
        const planCard = document.createElement("div");
        planCard.classList.add("plan-card");

        // Crear el título del plan
        const planTitle = document.createElement("h3");
        planTitle.classList.add("plan-card__title");
        planTitle.textContent = plan.nombre;

        // Crear el precio del plan
        const planPrice = document.createElement("p");
        planPrice.classList.add("plan-card__price");
        planPrice.textContent = `$${plan.precio}`;

        // Crear la lista de beneficios
        const planFeatures = document.createElement("ul");
        planFeatures.classList.add("plan-card__features");
        plan.beneficios.forEach(beneficio => {
            const listItem = document.createElement("li");
            listItem.textContent = beneficio;
            planFeatures.appendChild(listItem);
        });

        // Añadir los elementos a la tarjeta
        planCard.appendChild(planTitle);
        planCard.appendChild(planPrice);
        planCard.appendChild(planFeatures);

        // Añadir la tarjeta al contenedor
        container.appendChild(planCard);
    });
}



async function getPlans() {
    // Mensaje de carga
    const loadingMessage = DOM_ELEMENTS.availablePlansPanel.querySelector(".plan__default-message");

    try {
        const response = await fetch(ROUTES.getPlans, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Planes obtenidos:", data);
        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }
        return data;
    } catch (error) {
        console.error("Error al obtener los planes:", error);
    }
}

async function getAvailableLockers() {
    const state = "disponible";
    const page = 1;
    const limit = 40;

    try {
        const response = await fetch(`${ROUTES.getCasilleros}?estado=${state}&page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Casilleros ${state} obtenidos:`, data);

        return data;

    } catch (error) {
        console.error(`Error al obtener los casilleros ${state}:`, error);
    } finally {
        createLockers(availableLockers, reservedLockers, occupiedLockers);
    }
}

function getAllLockers() {
    const states = ["disponible", "reservado", "ocupado"];
    const page = 1;
    const limit = 40;

    states.forEach(async (state, index) => {
        try {
            const response = await fetch(`${ROUTES.getCasilleros}?estado=${state}&page=${page}&limit=${limit}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Casilleros ${state} obtenidos:`, data);

            if (state === "disponible") {
                availableLockers = data;
            } else if (state === "reservado") {
                reservedLockers = data;
            } else if (state === "ocupado") {
                occupiedLockers = data;
            }

        } catch (error) {
            console.error(`Error al obtener los casilleros ${state}:`, error);
        } finally {
            createLockers(availableLockers, reservedLockers, occupiedLockers)
        }
    });
}

async function createLockers(availableLockers, reservedLockers, occupiedLockers) {

    let perfil = await getPerfil();
    const casilleros = perfil.casilleros;

    const lockerMessage = document.querySelector(".locker-info__message");
    const lockerNumbers = [];

    if (casilleros.length > 0) {
        casilleros.forEach(casilleros => {
            lockerNumbers.push(casilleros.numero);
        });
        console.log("Casilleros: ", lockerNumbers);
        lockerMessage.textContent = lockerNumbers.join(", ");
    } else {
        console.log("No exsiten casilleros")
        lockerMessage.textContent = "Aún no tienes casilleros.";
    }

    const lockerGridItems = document.querySelector(".locker-grid__items");
    lockerGridItems.innerHTML = ""; // Limpiar contenido previo

    // Unir todas las listas de lockers
    const allLockers = [...availableLockers, ...reservedLockers, ...occupiedLockers];

    // Ordenar los lockers por el número
    allLockers.sort((a, b) => a.numero - b.numero);

    // Crear los lockers
    allLockers.forEach((locker) => {
        const lockerDiv = document.createElement("div");
        lockerDiv.classList.add("locker");

        // Asignar clase según el estado del locker
        if (locker.estado === "disponible") {
            lockerDiv.classList.add("locker--available");
        } else if (locker.estado === "reservado") {
            lockerDiv.classList.add("locker--reserved");
        } else if (locker.estado === "ocupado") {
            if (locker.perfil === perfil._id) {
                lockerDiv.classList.add("locker--purchased");
            } else {
                lockerDiv.classList.add("locker--occupied");
            }
        }

        // Asignar el número del locker
        lockerDiv.textContent = String(locker.numero).padStart(2, '0');

        // Agregar una clase basada en el _id del locker
        if (locker._id) {
            lockerDiv.classList.add(`locker-${locker._id}`);
        }

        lockerGridItems.appendChild(lockerDiv);
    });
}

async function handleLockerRequest(event) {
    DOM_ELEMENTS.submitLockerRequest.textContent = "Enviando..."; // Cambiar el texto del botón
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Seleccionar elementos necesarios
    const lockerDropdown = document.getElementById("locker-number");
    const lockerNonSelected = document.querySelector(".locker-non-selected");
    const lockerCommitment = document.querySelector(".locker-commitment");
    const lockerFileInput = document.getElementById("locker-proof"); // Input de archivo

    // Paso 1: Comprobar si se seleccionó un casillero
    if (!lockerDropdown.value) {
        lockerNonSelected.style.display = "block"; // Mostrar mensaje de error
        return;
    } else {
        lockerNonSelected.style.display = "none"; // Ocultar mensaje de error
    }

// Paso 2: Comprobar si se subió algún archivo y su formato
    if (!lockerFileInput.files || lockerFileInput.files.length === 0) {
        lockerCommitment.textContent = "* Comprobante de pago faltante"; // Mostrar mensaje de error
        lockerCommitment.style.display = "block";
        return;
    } else {
        const file = lockerFileInput.files[0];
        const validFormats = ["image/png", "image/jpeg", "image/jpg"];
        if (!validFormats.includes(file.type)) {
            lockerCommitment.textContent = "* Formato de archivo inválido"; // Mostrar mensaje de error
            lockerCommitment.style.display = "block";
            return;
        }
        lockerCommitment.style.display = "none"; // Ocultar mensaje de error
    }

    // Paso 3: Si pasa las validaciones, enviar solicitud y refrescar la página
    const selectedLockerId = lockerDropdown.value;
    const file = lockerFileInput.files[0]; // Obtener el archivo subido
    await postLockerRequest(selectedLockerId, file);
}

async function postLockerRequest(selectedLockerId, file) {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
    }, {});

    const csrfToken = cookies.csrfToken; // Asegúrate de que el nombre de la cookie sea correcto

    if (!csrfToken) {
        throw new Error("CSRF token no encontrado en las cookies.");
    }

    // Construye el objeto JSON
    const requestBody = {
        tipo: "Casillero",
        casillero: selectedLockerId,
    };

    try {
        const response = await fetch(ROUTES.postRequests, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json", // Importante para enviar JSON
                "x-csrf-token": csrfToken,         // Token CSRF
            },
            body: JSON.stringify(requestBody),       // Convertir objeto a JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }

        const data = await response.json();
        postImage(data.id, file);
        console.log("Solicitud enviada:", data);
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.message);
    }
}


async function handlePlanRequest(event) {
    DOM_ELEMENTS.submitPlanRequest.textContent = "Enviando..."; // Cambiar el texto del botón
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Seleccionar elementos necesarios
    const planDropdown = document.getElementById("plan-type");
    const planNonSelected = document.querySelector(".plan-non-selected");
    const planCommitment = document.querySelector(".plan-commitment");
    const planFileInput = document.getElementById("plan-proof"); // Input de archivo

    // Paso 1: Comprobar si se seleccionó un plan
    if (!planDropdown.value) {
        planNonSelected.style.display = "block"; // Mostrar mensaje de error
        return;
    } else {
        planNonSelected.style.display = "none"; // Ocultar mensaje de error
    }

    // Paso 2: Comprobar si se subió algún archivo y su formato
    if (!planFileInput.files || planFileInput.files.length === 0) {
        planCommitment.textContent = "* Comprobante de pago faltante"; // Mostrar mensaje de error
        planCommitment.style.display = "block";
        return;
    } else {
        const file = planFileInput.files[0];
        const validFormats = ["image/png", "image/jpeg", "image/jpg"];
        if (!validFormats.includes(file.type)) {
            planCommitment.textContent = "* Formato de archivo inválido"; // Mostrar mensaje de error
            planCommitment.style.display = "block";
            return;
        }
        planCommitment.style.display = "none"; // Ocultar mensaje de error
    }

    // Paso 3: Si pasa las validaciones, enviar solicitud y refrescar la página
    const selectedPlanId = planDropdown.value;
    const file = planFileInput.files[0]; // Obtener el archivo subido
    await postPlanRequest(selectedPlanId, file);
}

async function postPlanRequest(selectedPlanId, file) {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
    }, {});

    const csrfToken = cookies.csrfToken; // Asegúrate de que el nombre de la cookie sea correcto

    if (!csrfToken) {
        throw new Error("CSRF token no encontrado en las cookies.");
    }

    // Construye el objeto JSON
    const requestBody = {
        tipo: "Plan",
        plan: selectedPlanId,
    };

    try {
        const response = await fetch(ROUTES.postRequests, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json", // Importante para enviar JSON
                "x-csrf-token": csrfToken,         // Token CSRF
            },
            body: JSON.stringify(requestBody),       // Convertir objeto a JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }

        const data = await response.json();
        postImage(data.id, file);
        console.log("Solicitud enviada:", data);
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.message);
    }
}

async function postImage(id, file) {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
    }, {});

    const csrfToken = cookies.csrfToken; // Asegúrate de que el nombre de la cookie sea correcto

    if (!csrfToken) {
        throw new Error("CSRF token no encontrado en las cookies.");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const url = `${ROUTES.postImage}${id}`;
        console.log(url);
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken, // Token CSRF
            },
            body: formData, // Enviar FormData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }

        const data = await response.json();
        console.log("Imagen enviada:", data);

        // Enviar notificación y esperar a que termine
        await sendNotification();

        // Recargar la página después de completar todas las acciones
        setTimeout(() => {
            location.reload();
        }, 8000);
    } catch (error) {
        console.error("Error al enviar la imagen:", error.message);
    }
}


async function getImage(id) {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
    }, {});

    const csrfToken = cookies.csrfToken; // Asegúrate de que el nombre de la cookie sea correcto

    if (!csrfToken) {
        throw new Error("CSRF token no encontrado en las cookies.");
    }

    try {
        const url = `${ROUTES.postImage}${id}`;
        console.log(url);
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken, // Token CSRF
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }

        const data = await response.json();
        console.log("Imagen obtenida:", data);
        return data.url;
    } catch (error) {
        console.error("Error al obtener la imagen:", error.message);
    }
}

function initializeEventListeners() {
    const currentPlanButton = document.querySelector(".sidebar__menu-item.current_panel");
    if (currentPlanButton) {
        currentPlanButton.addEventListener("click", getPerfil);
    }
    const availablePlansButton = document.querySelector(".sidebar__menu-item.available_panel");
    if (availablePlansButton) {
        availablePlansButton.addEventListener("click", createAndAppendPlanCards);
    }
    const lockerButton = document.querySelector(".sidebar__menu-item.locker_panel");
    if (lockerButton) {
        lockerButton.addEventListener("click", getAllLockers);
    }

    const requestsButton = document.querySelector(".sidebar__menu-item.request_panel");
    if (requestsButton) {
        requestsButton.addEventListener("click", showMyRequestsPanel);
    }

    if (DOM_ELEMENTS.myRequestsButton) {
        DOM_ELEMENTS.myRequestsButton.addEventListener("click", showMyRequestsPanel);
    }
    if (DOM_ELEMENTS.createRequestButton) {
        DOM_ELEMENTS.createRequestButton.addEventListener("click", showCreateRequestPanel);
        DOM_ELEMENTS.createRequestButton.addEventListener("click", showLockerPanelRequest);
    }
    if (DOM_ELEMENTS.createRequestLockerButton) {
        DOM_ELEMENTS.createRequestLockerButton.addEventListener("click", showLockerPanelRequest);
    }
    if (DOM_ELEMENTS.createRequestPlanButton) {
        DOM_ELEMENTS.createRequestPlanButton.addEventListener("click", showPlanPanelRequest);
    }
    if (DOM_ELEMENTS.submitLockerRequest) {
        DOM_ELEMENTS.submitLockerRequest.addEventListener("click", handleLockerRequest);
    }
    if (DOM_ELEMENTS.submitPlanRequest) {
        DOM_ELEMENTS.submitPlanRequest.addEventListener("click", handlePlanRequest);
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


// Función principal para inicializar la aplicación
async function initializeApp() {
    perfil = await getPerfil(); // Obtén los datos del perfil
    fillProfileCard(perfil);
    initializeEventListeners();
    setupProfilePictureChange();
    setTokenExpiration();
    startSessionCheck();
}

window.submitChangePassword = async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmNewPassword = document.getElementById("confirm-new-password").value.trim();

    if (newPassword !== confirmNewPassword) {
        alert("La nueva contraseña y su confirmación no coinciden.");
        showPanel("current-plan"); // Redirigir al panel de pendientes
        return;
    }

    // Evitar múltiples envíos deshabilitando el botón
    const submitButton = event.target.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
        // Obtener el email del usuario desde la variable global `window.usuarioCorreo`
        const email = DOM_ELEMENTS.userEmail.textContent;

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
        showPanel("current-plan");
    } finally {
        submitButton.disabled = false;
    }
};


function showResetPasswordModal() {
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
    showPanel("current-plan"); // Redirigir al panel de pendientes
}

function closeModal() {
    const modal = document.getElementById("reset-password-modal");
    if (modal) {
        modal.remove();
    }
}

window.submitPasswordUpdate = async function() {
    const email = DOM_ELEMENTS.userEmail.textContent;
    const verificationCode = document.getElementById("verification-code").value.trim();
    const currentPassword = document.getElementById("current-password").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmNewPassword = document.getElementById("confirm-new-password").value.trim();

    if (!email || !verificationCode || !currentPassword || !newPassword || !confirmNewPassword) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("La nueva contraseña y su confirmación no coinciden.");
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
        showPanel("current-plan"); // Redirigir al panel principal
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Hubo un error al actualizar la contraseña. Por favor, intenta de nuevo.");
        showPanel("current-plan"); // Redirigir al panel de pendientes en caso de error
        closeModal(); // Cerrar la ventana modal
    }
};


function setupProfilePictureChange() {
    const changePictureButton = document.querySelector(".profile-card__change-picture");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    const csrfToken = getCookie("csrfToken");

    changePictureButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async function () {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const respuesta = await fetch(ROUTES.postImagePerfil, {
                method: "PUT",
                body: formData,
                credentials: "include",
                headers: { "x-csrf-token": csrfToken },
            });
            if (!respuesta.ok) throw new Error("Error al subir la imagen de perfil.");

            alert("Imagen actualizada con éxito.");
            location.reload();
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("Hubo un error al subir la imagen.");
        }
    });
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
        redirectToIndex();
        console.error("Error al cerrar sesión:", error);
    }
}

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


document.addEventListener("DOMContentLoaded", () => {
    loadNavbarLogo();
    initializeApp(); // Asegúrate de que esta función se ejecute después de cargar el DOM
});
