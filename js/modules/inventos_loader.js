/**
 * Módulo para cargar los inventos desde inventos.json
 */
document.addEventListener('DOMContentLoaded', async () => {
    const inventosGrid = document.querySelector('#inventos-grid');
    if (!inventosGrid) return;

    try {
        const response = await fetch('inventos.json');
        if (!response.ok) throw new Error('No se pudo cargar inventos.json');

        const inventos = await response.json();

        inventosGrid.innerHTML = '';
        inventos.forEach(invento => {
            const article = createInventoCard(invento);
            inventosGrid.appendChild(article);
        });

        // Re-inicializar el modal si los elementos son dinámicos
        if (window.initModal) window.initModal();

    } catch (error) {
        console.error('Error al cargar inventos:', error);
    }

    function createInventoCard(invento) {
        const article = document.createElement('article');
        article.className = 'invento-card';
        article.setAttribute('data-category', invento.category_slug);

        // Generar estrellas de dificultad
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= invento.difficulty ? 'active' : '';
            starsHtml += `
                <svg class="difficulty__star ${activeClass}" viewBox="0 0 20 20">
                    <polygon points="10,0 13,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 7,7" />
                </svg>`;
        }

        article.innerHTML = `
            <div class="invento-card__media">
                <img src="${invento.image}" alt="${invento.title}" class="invento-card__image" data-zoomable>
                <span class="badge badge--accent invento-card__category">${invento.category_label}</span>
                <div class="invento-card__overlay">
                    <a href="${invento.link}" class="btn btn--primary btn--sm">Ver Ficha Completa</a>
                </div>
            </div>

            <div class="invento-card__body">
                <h3 class="invento-card__title">${invento.title}</h3>
                <p class="invento-card__description">${invento.description}</p>

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
            </div>

            <div class="invento-card__footer">
                <div class="invento-card__difficulty">
                    <span class="invento-card__difficulty-label">Dificultad:</span>
                    <div class="difficulty">
                        ${starsHtml}
                    </div>
                </div>
            </div>
        `;
        return article;
    }
});
