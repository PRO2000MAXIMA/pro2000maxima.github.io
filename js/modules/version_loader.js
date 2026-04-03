/**
 * Módulo para cargar la versión y las mejoras desde versions.json
 * PRO-2000 MAXIMA - Refactorizado
 */
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const VERSION_CONFIG = Object.freeze({
        MONTHS: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        DATE_PARTS_COUNT: 3,
        MONTH_INDEX_OFFSET: 1
    });

    const versionLabel = document.querySelector('.pro2000-hero__version strong');
    const dateLabel = document.querySelector('.pro2000-hero__version');
    const changelogList = document.querySelector('.changelog__list');

    if (!changelogList) {
        return;
    }

    try {
        const data = await fetchVersionData();
        const { latest } = data;
        if (!latest) {
            return;
        }

        updateVersionLabels(versionLabel, dateLabel, latest, VERSION_CONFIG);
        renderChangelog(changelogList, latest.changelog);
    } catch (error) {
        console.error('Error al cargar la versión:', error);
    }
});

/**
 * @returns {Promise<Object>}
 */
async function fetchVersionData() {
    const response = await window.CacheBuster.fetchNoCache('versions.json');
    return await response.json();
}

/**
 * @param {HTMLElement} versionLabel
 * @param {HTMLElement} dateLabel
 * @param {Object} latest
 * @param {Object} config
 */
function updateVersionLabels(versionLabel, dateLabel, latest, config) {
    const cleanVersion = latest.version.replace(/^v/i, '');
    const displayVersion = `v${cleanVersion}`;

    if (versionLabel) {
        versionLabel.textContent = displayVersion;
    }

    if (dateLabel) {
        dateLabel.innerHTML = formatVersionDate(displayVersion, latest.date, config.MONTHS, config);
    }
}

/**
 * @param {string} displayVersion
 * @param {string} dateStr
 * @param {Array<string>} months
 * @param {Object} config
 * @returns {string}
 */
function formatVersionDate(displayVersion, dateStr, months, config) {
    let day, month, year;

    const dotParts = dateStr.split('.');
    if (dotParts.length === config.DATE_PARTS_COUNT) {
        day = parseInt(dotParts[0], 10);
        month = parseInt(dotParts[1], 10);
        year = dotParts[2];
    } else {
        const dashParts = dateStr.split('-');
        if (dashParts.length === config.DATE_PARTS_COUNT) {
            day = parseInt(dashParts[0], 10);
            month = parseInt(dashParts[1], 10);
            year = dashParts[2];
        } else {
            return '';
        }
    }

    const monthIndex = month - config.MONTH_INDEX_OFFSET;
    const monthName = months[monthIndex] || 'Abril';
    return `Versión actual: <strong>${displayVersion}</strong> &nbsp;|&nbsp; ${day} de ${monthName} ${year}`;
}

/**
 * @param {HTMLElement} changelogList
 * @param {Array<string>} changelog
 */
function renderChangelog(changelogList, changelog) {
    changelogList.innerHTML = '';

    if (changelog && changelog.length > 0) {
        changelog.forEach((item) => {
            const span = document.createElement('span');
            span.className = 'changelog__item';
            span.textContent = item;
            changelogList.appendChild(span);
        });
    } else {
        changelogList.innerHTML = '<span class="changelog__item">Actualización de mantenimiento y estabilidad.</span>';
    }
}
