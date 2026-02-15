/**
 * Módulo para cargar la versión y las mejoras desde versions.json
 */
document.addEventListener('DOMContentLoaded', async () => {
    const versionLabel = document.querySelector('.pro2000-hero__version strong');
    const dateLabel = document.querySelector('.pro2000-hero__version');
    const changelogList = document.querySelector('.changelog__list');

    if (!changelogList) return;

    try {
        const response = await fetch('versions.json');
        if (!response.ok) throw new Error('No se pudo cargar versions.json');

        const data = await response.json();
        const latest = data.latest;

        if (!latest) return;

        // 1. Actualizar Versión Visualmente (por si acaso no se actualizó el HTML)
        if (versionLabel) {
            versionLabel.textContent = `v${latest.version}`;
        }

        // Actualizar fecha si el contenedor existe
        if (dateLabel) {
            const dateParts = latest.date.split('-');
            if (dateParts.length === 3) {
                const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                const monthName = months[parseInt(dateParts[1]) - 1];
                dateLabel.innerHTML = `Versión actual: <strong>v${latest.version}</strong> &nbsp;|&nbsp; ${monthName} ${dateParts[0]}`;
            }
        }

        // 2. Limpiar y llenar las mejoras (changelog)
        changelogList.innerHTML = ''; // Limpiar placeholders estáticos

        if (latest.changelog && latest.changelog.length > 0) {
            latest.changelog.forEach(item => {
                const span = document.createElement('span');
                span.className = 'changelog__item';
                span.textContent = item;
                changelogList.appendChild(span);
            });
        } else {
            changelogList.innerHTML = '<span class="changelog__item">Actualización de mantenimiento y estabilidad.</span>';
        }

    } catch (error) {
        console.error('Error al cargar la versión:', error);
        // Si falla, los valores estáticos del HTML se quedan como respaldo.
    }
});
