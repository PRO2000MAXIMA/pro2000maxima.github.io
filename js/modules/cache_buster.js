/**
 * Cache Buster Module - PRO-2000 MAXIMA
 * Sistema centralizado para evitar caché en archivos JSON.
 * Baja complejidad ciclomática: máxima complejidad 2
 */

/**
 * Configuración del Cache Buster
 * @constant {Object}
 */
const CACHE_BUSTER_CONFIG = Object.freeze({
    /**
     * Timestamp de carga (se actualiza en cada recarga de página)
     * @type {number}
     */
    timestamp: Date.now(),

    /**
     * Prefijo para el parámetro de cache-busting
     * @type {string}
     */
    paramPrefix: '_v'
});

/**
 * Añade parámetro de cache-busting a una URL
 * @param {string} url - La URL original
 * @returns {string} URL con parámetro de cache-busting
 */
function bustCache(url) {
    if (typeof url !== 'string') {
        return '';
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${CACHE_BUSTER_CONFIG.paramPrefix}=${CACHE_BUSTER_CONFIG.timestamp}`;
}

/**
 * Crea una función fetch con cache-busting integrado
 * @param {string} url - La URL del recurso
 * @param {RequestInit=} options - Opciones opcionales de fetch
 * @returns {Promise<Response>} Respuesta del fetch
 */
async function fetchNoCache(url, options) {
    const bustedUrl = bustCache(url);
    const response = await fetch(bustedUrl, options);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
}

/**
 * Obtiene el timestamp actual (útil para forzar recarga manual)
 * @returns {number} Timestamp UNIX actual
 */
function getCurrentTimestamp() {
    return Date.now();
}

// Exportar para uso global (patrón UMD)
window.CacheBuster = Object.freeze({
    bustCache,
    fetchNoCache,
    getCurrentTimestamp,
    timestamp: CACHE_BUSTER_CONFIG.timestamp
});
