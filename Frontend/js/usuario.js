import {ImageUpdater} from "../content/Image.js";

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
        return data; // Devuelve los datos
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        return null; // En caso de error, devuelve null
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
    console.log(noPlanMessage);
    // Si no hay planes disponibles, mostrar mensaje
    if (filteredPlans.length === 0) {
        button.style.display = "none";
        return;
    } else {
        noPlanMessage.style.display = "none";
    }
    container.innerHTML = "";
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
    try {
        const response = fetch(ROUTES.getCasilleros, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = response.json();
        console.log("Casilleros obtenidos:", data);
        createLockers(data);
    } catch (error) {
        console.error("Error al obtener los casilleros:", error);
    }
}

function createLockers(lockers) {
    const lockerGridItems = document.querySelector(".locker-grid__items");
    lockerGridItems.innerHTML = ""; // Limpiar contenido previo

    lockers.forEach((locker, index) => {
        const lockerDiv = document.createElement("div");
        lockerDiv.classList.add("locker");
        if (locker.estado === "disponible") {
            lockerDiv.classList.add("locker--available");
        }
        lockerDiv.textContent = String(index + 1).padStart(2, '0');
        lockerGridItems.appendChild(lockerDiv);
    });
}

function initializeEventListeners() {
    // Llamar a getPlans cuando se muestra el panel de planes disponibles
    const availablePlansButton = document.querySelector(".sidebar__menu-item.available_panel");
    if (availablePlansButton) {
        availablePlansButton.addEventListener("click", getPlans);
    }
    DOM_ELEMENTS.lockerPanel.addEventListener("click", getLockers());
}

// Función principal para inicializar la aplicación
async function initializeApp() {
    const perfil = await getPerfil(); // Obtén los datos del perfil
    fillProfileCard(perfil);
    fillCurrentPlanPanel(perfil);
    initializeEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeApp(); // Asegúrate de que esta función se ejecute después de cargar el DOM
});
