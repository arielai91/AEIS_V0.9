import {ImageUpdater} from "../content/Image.js";

// Función para acceder a la cédula desde la URL
const cedula = new URLSearchParams(window.location.search);

// Variables globales para tracking
let currentRequestId = null;
let activePanel = 'solicitudes-pendientes';

// Función mejorada para mostrar diferentes paneles
function showPanel(panelId) {
    // Verificar si el panel existe
    const targetPanel = document.getElementById(panelId);
    if (!targetPanel) {
        console.error(`Panel not found: ${panelId}`);
        return;
    }

    // Ocultar todos los paneles y remover clase activa de los botones
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });

    document.querySelectorAll('.menu button').forEach(button => {
        button.classList.remove('active');
    });

    // Activar el panel seleccionado
    targetPanel.classList.add('active');

    // Activar el botón correspondiente
    const activeButton = document.querySelector(`.menu button[onclick*="${panelId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    activePanel = panelId;
}

// Funciones para manejar modales
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar modales si se hace click fuera del contenido
window.onclick = function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Función para expandir imagen
function expandImage(imgElement) {
    const modal = document.getElementById('image-modal');
    const expandedImg = document.getElementById('expanded-image');
    expandedImg.src = imgElement.src;
    showModal('image-modal');
}

// Funciones para aprobar/rechazar solicitudes
function showApproveModal(requestId, userName) {
    currentRequestId = requestId;
    document.getElementById('approve-user-name').textContent = userName;
    showModal('approve-modal');
}

function showRejectModal(requestId) {
    currentRequestId = requestId;
    showModal('reject-modal');
}

function approveRequest() {
    const solicitud = document.querySelector(`[data-id="${currentRequestId}"]`);
    if (solicitud) {
        // Crear copia de la solicitud para el panel de aprobadas
        const solicitudClone = solicitud.cloneNode(true);

        // Remover botones de acción existentes
        const actionButtons = solicitudClone.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.remove();
        }

        // Añadir fecha de aprobación
        const summary = solicitudClone.querySelector('summary');
        const approvalDate = document.createElement('span');
        approvalDate.className = 'approval-date';
        approvalDate.textContent = `APROBADO EN: ${new Date().toLocaleDateString()}`;
        summary.appendChild(approvalDate);

        // Mover al panel de aprobadas
        document.querySelector('#solicitudes-aprobadas .solicitudes-container').appendChild(solicitudClone);

        // Remover la solicitud original
        solicitud.remove();
    }

    closeModal('approve-modal');
    currentRequestId = null;
}

function rejectRequest() {
    // Verificar que se haya seleccionado un motivo
    const rejectReason = document.getElementById('reject-reason').value;
    if (!rejectReason) {
        alert('Por favor seleccione un motivo de rechazo');
        return;
    }

    const solicitud = document.querySelector(`[data-id="${currentRequestId}"]`);
    if (solicitud) {
        // Crear copia de la solicitud para el panel de rechazadas
        const solicitudClone = solicitud.cloneNode(true);

        // Modificar botones de acción
        const actionButtons = solicitudClone.querySelector('.action-buttons');
        if (actionButtons) {
            const userName = solicitud.querySelector('.solicitud-name').textContent;
            actionButtons.innerHTML = `<button class="approve-btn full-width" onclick="showApproveModal(${currentRequestId}, '${userName}')">Aprobar Solicitud</button>`;
        }

        // Añadir fecha de rechazo
        const summary = solicitudClone.querySelector('summary');
        const rejectDate = document.createElement('span');
        rejectDate.className = 'reject-date';
        rejectDate.textContent = `RECHAZADO EN: ${new Date().toLocaleDateString()}`;
        summary.appendChild(rejectDate);

        // Mover al panel de rechazadas
        document.querySelector('#solicitudes-rechazadas .solicitudes-container').appendChild(solicitudClone);

        // Remover la solicitud original
        solicitud.remove();
    }

    closeModal('reject-modal');
    document.getElementById('reject-reason').value = ''; // Limpiar el select
    currentRequestId = null;
}

// Función para crear nuevo administrador
function createAdmin(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Aquí iría la lógica para crear el administrador en la base de datos
    alert('Administrador creado exitosamente');
    event.target.reset();
}

// Función para cambiar contraseña (placeholder)
function togglePasswordModal() {
    alert('Funcionalidad de cambio de contraseña en desarrollo');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {

    // Mostrar el panel inicial y activar su botón
    showPanel('solicitudes-pendientes');
    const initialButton = document.querySelector('.menu button[onclick*="solicitudes-pendientes"]');
    if (initialButton) {
        initialButton.classList.add('active');
    }

    // Agregar event listeners a los botones del menú
    document.querySelectorAll('.menu button').forEach(button => {
        button.addEventListener('click', function () {
            const panelId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showPanel(panelId);
        });
    });

    // Inicializar los event listeners para las imágenes de comprobantes
    document.querySelectorAll('.comprobante-img').forEach(img => {
        img.addEventListener('click', function () {
            expandImage(this);
        });
    });

    // Inicializar los event listeners para botones de aprobar y rechazar en solicitudes pendientes
    document.querySelectorAll('#solicitudes-pendientes .approve-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const solicitud = this.closest('.solicitud-details');
            const userName = solicitud.querySelector('.solicitud-name').textContent;
            const requestId = solicitud.dataset.id;
            showApproveModal(requestId, userName);
        });
    });

    document.querySelectorAll('#solicitudes-pendientes .reject-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const solicitud = this.closest('.solicitud-details');
            const requestId = solicitud.dataset.id;
            showRejectModal(requestId);
        });
    });

    // Inicializar los event listeners para botones de aprobar en solicitudes rechazadas
    document.querySelectorAll('#solicitudes-rechazadas .approve-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const solicitud = this.closest('.solicitud-details');
            const userName = solicitud.querySelector('.solicitud-name').textContent;
            const requestId = solicitud.dataset.id;
            showApproveModal(requestId, userName);
        });
    });

    // Event listeners para los botones de los modales
    // Modal de Aprobar
    const approveModalOkBtn = document.querySelector('#approve-modal .modal-btn-primary');
    if (approveModalOkBtn) {
        approveModalOkBtn.addEventListener('click', approveRequest);
    }

    const approveModalCancelBtn = document.querySelector('#approve-modal .modal-btn-secondary');
    if (approveModalCancelBtn) {
        approveModalCancelBtn.addEventListener('click', () => closeModal('approve-modal'));
    }

    // Modal de Rechazar
    const rejectModalOkBtn = document.querySelector('#reject-modal .modal-btn-primary');
    if (rejectModalOkBtn) {
        rejectModalOkBtn.addEventListener('click', rejectRequest);
    }

    const rejectModalCancelBtn = document.querySelector('#reject-modal .modal-btn-secondary');
    if (rejectModalCancelBtn) {
        rejectModalCancelBtn.addEventListener('click', () => closeModal('reject-modal'));
    }

    // Modal de Imagen
    const imageModalCloseBtn = document.querySelector('#image-modal .close-modal');
    if (imageModalCloseBtn) {
        imageModalCloseBtn.addEventListener('click', () => closeModal('image-modal'));
    }
    // Agregar event listener al botón de cambiar foto

});

// Inicializar ImageUpdater si está disponible
if (typeof ImageUpdater !== 'undefined') {
    const imageUpdater = new ImageUpdater("https://codebyelaina.com/bucket/image/logo_aeis.png", ".logo_aeis");
    imageUpdater.updateImage();
}
