/**
 * Módulo para cargar las ideas desde ideas.json
 */
document.addEventListener('DOMContentLoaded', async () => {
    const ideasGrid = document.querySelector('.ideas-grid');
    if (!ideasGrid) return;

    try {
        const response = await fetch('ideas.json');
        if (!response.ok) throw new Error('No se pudo cargar ideas.json');

        const ideas = await response.json();

        ideasGrid.innerHTML = '';
        ideas.forEach(idea => {
            const article = createIdeaCard(idea);
            ideasGrid.appendChild(article);
        });

    } catch (error) {
        console.error('Error al cargar ideas:', error);
    }

    function createIdeaCard(idea) {
        const article = document.createElement('article');
        article.className = `idea-card idea-card--${idea.category_slug}`;

        // Determinar badge según categoría
        let badgeType = 'badge--primary';
        if (idea.category_slug === 'technique') badgeType = 'badge--accent';
        if (idea.category_slug === 'tip') badgeType = 'badge--success';
        if (idea.category_slug === 'sales') badgeType = 'badge--warning';
        if (idea.category_slug === 'office') badgeType = 'badge--info';

        // Generar etiquetas
        const tagsHtml = idea.tags.map(tag => `<span class="idea-card__tag">${tag}</span>`).join('');

        article.innerHTML = `
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
        return article;
    }
});
