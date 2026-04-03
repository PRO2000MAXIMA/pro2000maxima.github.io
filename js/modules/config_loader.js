/**
 * Config Loader Module - PRO-2000 MAXIMA
 * @description Carga configuración centralizada y renderiza menú dinámico
 * @complexity max: 5
 * @version 1.0.0
 */

(function () {
    'use strict';

    /**
     * Configuración del módulo
     * @constant {Object}
     * @readonly
     */
    const CONFIG_CONFIG = Object.freeze({
        /**
         * Archivo de configuración
         * @type {string}
         */
        CONFIG_FILE: 'config.json',

        /**
         * Selector del elemento de navegación
         * @type {string}
         */
        NAV_SELECTOR: '#nav',

        /**
         * Selector del elemento de marca
         * @type {string}
         */
        BRAND_SELECTOR: '.brand',

        /**
         * Usar cache busting
         * @type {boolean}
         */
        CACHE_BUST: true
    });

    /**
     * @typedef {Object} NavigationItem
     * @property {string} label - Texto del enlace
     * @property {string} url - URL destino
     * @property {string} icon - Icono opcional
     * @property {number} order - Orden de visualización
     * @property {boolean} enabled - Si está activo
     */

    /**
     * @typedef {Object} TextsConfig
     * @property {Object.<string, string>} [index] - Textos para index
     * @property {Object.<string, string>} [pro2000] - Textos para pro2000
     * @property {Object.<string, string>} [inventos] - Textos para inventos
     * @property {Object.<string, string>} [ideas] - Textos para ideas
     * @property {Object.<string, string>} [documentos] - Textos para documentos
     */

    /**
     * @typedef {Object} ImagesConfig
     * @property {string} [logo] - Ruta del logo
     * @property {string} [brand_primary] - Imagen de marca principal
     * @property {string} [hero_slides_pattern] - Patrón para slides
     */

    /**
     * @typedef {Object} BrandConfig
     * @property {string} name - Nombre de la marca
     * @property {string} tagline - Eslogan
     * @property {string} footer_copy - Texto del footer
     */

    /**
     * @typedef {Object} SiteConfig
     * @property {NavigationItem[]} navigation - Items del menú
     * @property {TextsConfig} texts - Textos por página
     * @property {ImagesConfig} images - Rutas de imágenes
     * @property {BrandConfig} brand - Configuración de marca
     */

    /**
     * Configuración cacheada
     * @type {SiteConfig | null}
     */
    let cachedConfig = null;

    /**
     * Obtiene el nombre de la página actual desde la URL
     * @returns {string} Nombre de archivo HTML
     */
    function getCurrentPageName() {
        const path = window.location.pathname.split('/').pop();
        return path || 'index.html';
    }

    /**
     * Verifica si una URL corresponde a la página actual
     * @param {string} url - URL a verificar
     * @param {string} currentPage - Página actual
     * @returns {boolean} True si es la página actual
     */
    function isCurrentPage(url, currentPage) {
        if (url === 'index.html' && currentPage === '') {
            return true;
        }
        return url === currentPage;
    }

    /**
     * Crea el HTML de un enlace de navegación
     * @param {NavigationItem} item - Item del menú
     * @param {string} currentPage - Página actual
     * @returns {string} HTML del enlace
     */
    function createNavLink(item, currentPage) {
        const isActive = isCurrentPage(item.url, currentPage);
        const activeClass = isActive ? ' active' : '';
        const iconHtml = item.icon ? `<span style="margin-right:4px;">${item.icon}</span>` : '';
        return `<a href="${item.url}" class="nav__link${activeClass}">${iconHtml}${item.label}</a>`;
    }

    /**
     * Renderiza el menú de navegación dinámico
     * @param {NavigationItem[]} items - Items del menú
     * @returns {void}
     */
    function renderNavigation(items) {
        const nav = document.querySelector(CONFIG_CONFIG.NAV_SELECTOR);
        if (!nav) {
            return;
        }

        const currentPage = getCurrentPageName();
        const sortedItems = items
            .filter(function (item) { return item.enabled; })
            .sort(function (a, b) { return a.order - b.order; });

        nav.innerHTML = sortedItems
            .map(function (item) { return createNavLink(item, currentPage); })
            .join('');
    }

    /**
     * Aplica la configuración de marca
     * @param {BrandConfig} brand - Configuración de marca
     * @returns {void}
     */
    function applyBrand(brand) {
        if (!brand) {
            return;
        }

        const brandElement = document.querySelector(CONFIG_CONFIG.BRAND_SELECTOR);
        if (brandElement) {
            const nameSpan = brandElement.querySelector('.brand__name');
            const taglineSpan = brandElement.querySelector('.brand__tagline');

            if (nameSpan && brand.name) {
                nameSpan.innerHTML = brand.name;
            }
            if (taglineSpan && brand.tagline) {
                taglineSpan.textContent = brand.tagline;
            }
        }

        // Footer
        const footerCopy = document.querySelector('.footer__copy');
        if (footerCopy && brand.footer_copy) {
            footerCopy.textContent = brand.footer_copy;
        }
    }

    /**
     * Aplica textos configurables a la página actual
     * @param {TextsConfig} texts - Textos por página
     * @returns {void}
     */
    function applyTexts(texts) {
        if (!texts) {
            return;
        }

        const page = getCurrentPageName().replace('.html', '') || 'index';
        const pageTexts = texts[page];

        if (!pageTexts) {
            return;
        }

        Object.entries(pageTexts).forEach(function (entry) {
            var key = entry[0];
            var value = entry[1];
            var element = document.querySelector('[data-config-text="' + key + '"]');
            if (element) {
                element.innerHTML = value;
            }
        });
    }

    /**
     * Carga la configuración desde config.json
     * @returns {Promise<SiteConfig>} Configuración del sitio
     * @throws {Error} Si falla la carga o parsing
     */
    async function loadConfig() {
        if (cachedConfig) {
            return cachedConfig;
        }

        var url = CONFIG_CONFIG.CONFIG_FILE;
        var response;

        if (CONFIG_CONFIG.CACHE_BUST && window.CacheBuster) {
            response = await window.CacheBuster.fetchNoCache(url);
        } else {
            response = await fetch(url);
        }

        if (!response.ok) {
            throw new Error('Failed to load config: ' + response.status);
        }

        cachedConfig = await response.json();
        return cachedConfig;
    }

    /**
     * Inicializa el módulo de configuración
     * @returns {Promise<void>}
     */
    async function initConfig() {
        try {
            var config = await loadConfig();
            renderNavigation(config.navigation);
            applyBrand(config.brand);
            applyTexts(config.texts);
        } catch (error) {
            console.error('Config load failed:', error);
        }
    }

    /**
     * Recarga la configuración (limpia cache)
     * @returns {Promise<SiteConfig>}
     */
    async function reloadConfig() {
        cachedConfig = null;
        return loadConfig();
    }

    // Exportar para uso global (patrón UMD)
    window.ConfigLoader = Object.freeze({
        loadConfig: loadConfig,
        reloadConfig: reloadConfig,
        initConfig: initConfig,
        renderNavigation: renderNavigation,
        applyTexts: applyTexts,
        applyBrand: applyBrand,
        getCurrentPageName: getCurrentPageName
    });

})();
