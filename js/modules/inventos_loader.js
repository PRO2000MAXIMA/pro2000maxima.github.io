/**
 * Módulo para cargar los inventos desde inventos.json
 * PRO-2000 MAXIMA - Refactorizado para reducir complejidad
 */
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const inventosGrid = document.querySelector('#inventos-grid');
    if (!inventosGrid) {
        return;
    }

    try {
        const inventos = await fetchInventos();
        renderInventos(inventos, inventosGrid);
    } catch (error) {
        console.error('Error al cargar inventos:', error);
    }
});

/**
 * @returns {Promise<Array>}
 */
async function fetchInventos() {
    const response = await fetch('inventos.json');
    if (!response.ok) {
        throw new Error('No se pudo cargar inventos.json');
    }
    return await response.json();
}

/**
 * @param {Array} inventos
 * @param {HTMLElement} container
 */
function renderInventos(inventos, container) {
    container.innerHTML = '';
    inventos.forEach((invento) => {
        const card = createInventoCard(invento);
        container.appendChild(card);
    });
}

/**
 * @param {Object} invento
 * @returns {HTMLElement}
 */
function createInventoCard(invento) {
    const article = document.createElement('article');
    article.className = 'invento-card';
    article.setAttribute('data-category', invento.category_slug);
    article.innerHTML = getInventoCardHTML(invento);
    return article;
}

/**
 * @param {Object} invento
 * @returns {string}
 */
function getInventoCardHTML(invento) {
    return `
        <div class="invento-card__media">
            <img src="${invento.image}" alt="${invento.title}" class="invento-card__image" data-zoomable>
            <span class="badge badge--accent invento-card__category">${invento.category_label}</span>
            <div class="invento-card__overlay">
                <a href="${invento.link}" class="btn btn--primary btn--sm">Ver Ficha Completa</a>
            </div>
        </div>
        ${getInventoCardBodyHTML(invento)}
        ${getInventoCardFooterHTML(invento)}
    `;
}

/**
 * @param {Object} invento
 * @returns {string}
 */
function getInventoCardBodyHTML(invento) {
    return `
        <div class="invento-card__body">
            <h3 class="invento-card__title">${invento.title}</h3>
            <p class="invento-card__description">${invento.description}</p>
            ${getInventoMetaHTML(invento)}
        </div>
    `;
}

/**
 * @param {Object} invento
 * @returns {string}
 */
function getInventoMetaHTML(invento) {
    return `
        <div class="invento-card__meta">
            <div class="meta-item">
                <span class="meta-item__label">Materiales</span>
                <span class="meta-item__value">${invento.materiales}</span>
            </div>
            <div class="meta-item">
                <span class="meta-item__label">Coste Est.</span>
                <span class="meta-item__value">${invento.coste}</span>
            </div>
            <div class="meta-item">
                <span class="meta-item__label">Tiempo</span>
                <span class="meta-item__value">${invento.tiempo}</span>
            </div>
        </div>
    `;
}

/**
 * @param {Object} invento
 * @returns {string}
 */
function getInventoCardFooterHTML(invento) {
    return `
        <div class="invento-card__footer">
            <div class="invento-card__difficulty">
                <span class="invento-card__difficulty-label">Dificultad:</span>
                <div class="difficulty">
                    ${getDifficultyStarsHTML(invento.difficulty)}
                </div>
            </div>
        </div>
    `;
}

/**
 * @param {number} difficulty
 * @returns {string}
 */
function getDifficultyStarsHTML(difficulty) {
    const MAX_STARS = 5;
    let html = '';
    for (let i = 1; i <= MAX_STARS; i++) {
        const activeClass = i <= difficulty ? 'active' : '';
        html += `
            <svg class="difficulty__star ${activeClass}" viewBox="0 0 20 20">
                <polygon points="10,0 13,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 7,7" />
            </svg>`;
    }
    return html;
}
