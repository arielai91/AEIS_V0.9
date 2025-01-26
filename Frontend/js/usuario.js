import {ImageUpdater} from "../content/Image.js";

let perfil = null;

const DOM_ELEMENTS = {
    userName: document.getElementById("profile-name"),
    userId: document.getElementById("profile-id"),
    userEmail: document.getElementById("profile-email"),
    currentPlanButton: document.querySelector(".plan__cta"),
    currentPlanPanel: document.getElementById("current-plan"),
    availablePlansPanel: document.getElementById("available-plans"),
    lockerPanel: document.getElementById("locker"),
    requestPanel: document.getElementById("requests"),
};

const ROUTES = {
    getPerfil: "http://localhost:3000/perfiles",
    getPlans: "http://localhost:3000/planes/",
    getCasilleros: "http://localhost:3000/casilleros/",
};

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
        planTitle.textContent = `Tu Plan: ${data.plan.nombre}`;
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

function createAndAppendPlanCards(plans, container = document.querySelector('.plans-grid')) {
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

        // Ocultar el mensaje de "Cargando..."
        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }

        // Llenar las tarjetas de planes
        createAndAppendPlanCards(data);
    } catch (error) {
        console.error("Error al obtener los planes:", error);
    }
}

function getLockers() {
    let availableLockers = [];
    let occupiedLockers = [];
    let reservedLockers = [];
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

function createLockers(availableLockers, reservedLockers, occupiedLockers) {
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




function initializeEventListeners() {
    // Llamar a getPlans cuando se muestra el panel de planes disponibles
    const currentPlanButton = document.querySelector(".sidebar__menu-item.current_panel");
    if (currentPlanButton) {
        currentPlanButton.addEventListener("click", getPerfil);
    }
    const availablePlansButton = document.querySelector(".sidebar__menu-item.available_panel");
    if (availablePlansButton) {
        availablePlansButton.addEventListener("click", getPlans);
    }
    const lockerButton = document.querySelector(".sidebar__menu-item.locker_panel");
    if (lockerButton) {
        lockerButton.addEventListener("click", getLockers);
    }
}

// Función principal para inicializar la aplicación
async function initializeApp() {
    perfil = await getPerfil(); // Obtén los datos del perfil
    fillProfileCard(perfil);
    initializeEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeApp(); // Asegúrate de que esta función se ejecute después de cargar el DOM
});
