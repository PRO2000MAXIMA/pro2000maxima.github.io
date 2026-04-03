/**
 * Módulo para cargar las ideas desde ideas.json
 * PRO-2000 MAXIMA - Refactorizado
 */
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const ideasGrid = document.querySelector('.ideas-grid');
    if (!ideasGrid) {
        return;
    }

    try {
        const ideas = await fetchIdeas();
        renderIdeas(ideas, ideasGrid);
    } catch (error) {
        console.error('Error al cargar ideas:', error);
    }
});

/**
 * @returns {Promise<Array>}
 */
async function fetchIdeas() {
    const response = await window.CacheBuster.fetchNoCache('ideas.json');
    return await response.json();
}

/**
 * @param {Array} ideas
 * @param {HTMLElement} container
 */
function renderIdeas(ideas, container) {
    container.innerHTML = '';
    ideas.forEach((idea) => {
        const card = createIdeaCard(idea);
        container.appendChild(card);
    });
}

/**
 * @param {Object} idea
 * @returns {HTMLElement}
 */
function createIdeaCard(idea) {
    const article = document.createElement('article');
    article.className = `idea-card idea-card--${idea.category_slug}`;
    article.innerHTML = getIdeaCardHTML(idea);
    return article;
}

/**
 * @param {Object} idea
 * @returns {string}
 */
function getIdeaCardHTML(idea) {
    const badgeType = getBadgeTypeForCategory(idea.category_slug);
    const tagsHtml = getTagsHTML(idea.tags);

    return `
        <div class="idea-card__header">
            <span class="badge ${badgeType}">${idea.category_label}</span>
            <span class="idea-card__icon">${idea.icon}</span>
        </div>
        <h3 class="idea-card__title">${idea.title}</h3>
        <p class="idea-card__description">${idea.description}</p>
        <div class="idea-card__tags">
            ${tagsHtml}
        </div>
    `;
}

/**
 * @param {string} categorySlug
 * @returns {string}
 */
function getBadgeTypeForCategory(categorySlug) {
    const BADGE_MAP = Object.freeze({
        'process': 'badge--primary',
        'technique': 'badge--accent',
        'tip': 'badge--success',
        'sales': 'badge--warning',
        'office': 'badge--info'
    });
    return BADGE_MAP[categorySlug] || 'badge--primary';
}

/**
 * @param {Array<string>} tags
 * @returns {string}
 */
function getTagsHTML(tags) {
    return tags.map((tag) => `<span class="idea-card__tag">${tag}</span>`).join('');
}
