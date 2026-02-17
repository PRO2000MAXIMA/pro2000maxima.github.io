/**
 * Módulo para cargar documentos y videos desde resources.json
 */
document.addEventListener('DOMContentLoaded', async () => {
    const manualsGrid = document.querySelector('#manuals-grid');
    const videosGrid = document.querySelector('#videos-grid');

    if (!manualsGrid && !videosGrid) return;

    try {
        const response = await fetch('resources.json');
        if (!response.ok) throw new Error('No se pudo cargar resources.json');

        const data = await response.json();

        // 1. Cargar Manuales
        if (manualsGrid && data.manuals) {
            manualsGrid.innerHTML = '';
            data.manuals.forEach(doc => {
                const card = createCard(doc, 'primary');
                manualsGrid.appendChild(card);
            });
        }

        // 2. Cargar Videos
        if (videosGrid && data.videos) {
            videosGrid.innerHTML = '';
            data.videos.forEach(video => {
                const card = createCard(video, 'secondary', true);
                videosGrid.appendChild(card);
            });
        }

    } catch (error) {
        console.error('Error al cargar recursos:', error);
    }

    function createCard(item, btnClass, isVideo = false) {
        const article = document.createElement('article');
        article.className = 'idea-card idea-card--process';
        if (isVideo) {
            article.style.borderTop = '4px solid #ff0000';
        }

        const badgeClass = isVideo ? '' : `badge--${btnClass}`;
        const badgeStyle = isVideo ? 'background: #ff0000; color: white;' : '';

        article.innerHTML = `
            <div class="idea-card__header">
                <span class="badge ${badgeClass}" style="${badgeStyle}">${item.type}</span>
                <span class="idea-card__icon">${item.icon}</span>
            </div>
            <h3 class="idea-card__title">${item.title}</h3>
            <p class="idea-card__description">${item.description}</p>
            <a href="${item.url}" target="_blank" class="btn btn--sm btn--${btnClass}" style="margin-top: var(--space-4); ${isVideo ? 'background: #f8fafc; color: #1e293b; border: 1px solid #e2e8f0;' : ''}">
                ${isVideo ? '<span style="margin-right:8px;">▶</span> Reproducir Vídeo' : 'Ver / Abrir Documento'}
            </a>
        `;
        return article;
    }
});
