/**
 * MAJOTUBEUNAIDEA - Main Application (Umd Edition)
 * Controlador unificado compatible con protocolos locales.
 */

const APP_CONFIG = Object.freeze({
    enableAnimations: true,
    enableModal: true
});

/**
 * Inicializa la aplicación cuando el DOM está listo
 * @returns {void}
 */
function initializeApp() {
    console.log('[App] Iniciando sistema...');
    console.log('[App] Starting...'); // Keep original log for consistency with other logs

    // Header (Global HeaderController)
    if (typeof HeaderController !== 'undefined') {
        HeaderController.init();
    }

    // Modal (Global ModalController)
    if (APP_CONFIG.enableModal && typeof ModalController !== 'undefined') {
        ModalController.init();
    } else {
        console.warn('[App] ModalController no encontrado o deshabilitado');
    }

    // Animations (Global ScrollAnimations)
    if (APP_CONFIG.enableAnimations && typeof ScrollAnimations !== 'undefined') {
        ScrollAnimations.init();
    }

    // Filter System
    if (typeof FilterController !== 'undefined') {
        const filterBar = document.querySelector('.filter-bar');
        if (filterBar) FilterController.init();
    }

    initSmoothScroll();
    console.log('[App] Sistema cargado correctamente');
}

/**
 * Configura smooth scroll para enlaces internos
 * @returns {void}
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            event.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Inicialización segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
