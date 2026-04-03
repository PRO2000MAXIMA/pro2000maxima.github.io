/**
 * Módulo para cargar documentos y videos desde resources.json
 * PRO-2000 MAXIMA - Refactorizado
 */
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const manualsGrid = document.querySelector('#manuals-grid');
    const videosGrid = document.querySelector('#videos-grid');

    if (!manualsGrid && !videosGrid) {
        return;
    }

    try {
        const data = await fetchResources();
        if (manualsGrid && data.manuals) {
            renderResources(data.manuals, manualsGrid, 'primary', false);
        }
        if (videosGrid && data.videos) {
            renderResources(data.videos, videosGrid, 'secondary', true);
        }
    } catch (error) {
        console.error('Error al cargar recursos:', error);
    }
});

/**
 * @returns {Promise<Object>}
 */
async function fetchResources() {
    const response = await window.CacheBuster.fetchNoCache('resources.json');
    return await response.json();
}

/**
 * @param {Array} items
 * @param {HTMLElement} container
 * @param {string} btnClass
 * @param {boolean} isVideo
 */
function renderResources(items, container, btnClass, isVideo) {
    container.innerHTML = '';
    items.forEach((item) => {
        const card = createResourceCard(item, btnClass, isVideo);
        container.appendChild(card);
    });
}

/**
 * @param {Object} item
 * @param {string} btnClass
 * @param {boolean} isVideo
 * @returns {HTMLElement}
 */
function createResourceCard(item, btnClass, isVideo) {
    const article = document.createElement('article');
    article.className = 'idea-card idea-card--process';
    if (isVideo) {
        article.style.borderTop = '4px solid #ff0000';
    }
    article.innerHTML = getResourceCardHTML(item, btnClass, isVideo);
    return article;
}

/**
 * @param {Object} item
 * @param {string} btnClass
 * @param {boolean} isVideo
 * @returns {string}
 */
function getResourceCardHTML(item, btnClass, isVideo) {
    const badgeConfig = getBadgeConfig(btnClass, isVideo);
    return `
        <div class="idea-card__header">
            <span class="badge ${badgeConfig.className}" style="${badgeConfig.style}">${item.type}</span>
            <span class="idea-card__icon">${item.icon}</span>
        </div>
        <h3 class="idea-card__title">${item.title}</h3>
        <p class="idea-card__description">${item.description}</p>
        ${getActionButtonHTML(item.url, btnClass, isVideo)}
    `;
}

/**
 * @param {string} btnClass
 * @param {boolean} isVideo
 * @returns {Object}
 */
function getBadgeConfig(btnClass, isVideo) {
    if (isVideo) {
        return { className: '', style: 'background: #ff0000; color: white;' };
    }
    return { className: `badge--${btnClass}`, style: '' };
}

/**
 * @param {string} url
 * @param {string} btnClass
 * @param {boolean} isVideo
 * @returns {string}
 */
function getActionButtonHTML(url, btnClass, isVideo) {
    const baseStyle = 'margin-top: var(--space-4);';
    const videoStyle = 'background: #f8fafc; color: #1e293b; border: 1px solid #e2e8f0;';
    const finalStyle = isVideo ? baseStyle + videoStyle : baseStyle;
    const buttonText = isVideo ? '<span style="margin-right:8px;">▶</span> Reproducir Vídeo' : 'Ver / Abrir Documento';

    return `<a href="${url}" target="_blank" class="btn btn--sm btn--${btnClass}" style="${finalStyle}">${buttonText}</a>`;
}
