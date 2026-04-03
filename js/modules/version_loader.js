/**
 * Módulo para cargar la versión y las mejoras desde versions.json
 * PRO-2000 MAXIMA - Refactorizado
 */
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const VERSION_CONFIG = Object.freeze({
        MONTHS: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        EXPECTED_DATE_PARTS: 3
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
    if (versionLabel) {
        versionLabel.textContent = `v${latest.version}`;
    }

    if (dateLabel) {
        dateLabel.innerHTML = formatVersionDate(latest, config.MONTHS, config.EXPECTED_DATE_PARTS);
    }
}

/**
 * @param {Object} latest
 * @param {Array<string>} months
 * @param {number} expectedDateParts
 * @returns {string}
 */
function formatVersionDate(latest, months, expectedDateParts) {
    const dateParts = latest.date.split('-');
    if (dateParts.length !== expectedDateParts) {
        return '';
    }

    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const monthName = months[monthIndex];
    return `Versión actual: <strong>v${latest.version}</strong> &nbsp;|&nbsp; ${monthName} ${dateParts[0]}`;
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
