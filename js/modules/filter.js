/**
 * Filter Controller - PRO-2000 MAXIMA
 * Sistema de filtrado con constantes centralizadas
 */
(function () {
    'use strict';

    const BREAKPOINTS = Object.freeze({
        MOBILE: 1024
    });

    const TIMING = Object.freeze({
        FILTER_INIT_DELAY_MS: 100
    });

    let activeFilter = 'all';
    let filterableItems = [];

    function applyFilter(category) {
        activeFilter = category;

        filterableItems = Array.from(document.querySelectorAll('[data-category]'));

        filterableItems.forEach((item) => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            if (shouldShow) {
                item.style.display = '';
                void item.offsetWidth;
                item.classList.add('is-visible');
            } else {
                item.classList.remove('is-visible');
                item.style.display = 'none';
            }
        });

        updateFilterButtons(category);
    }

    function updateFilterButtons(category) {
        document.querySelectorAll('.filter-btn').forEach((btn) => {
            const btnCategory = btn.getAttribute('data-filter');
            const isActive = btnCategory === category;
            btn.classList.toggle('active', isActive);

            if (isActive && window.innerWidth <= BREAKPOINTS.MOBILE) {
                btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });
    }

    function handleFilterClick(event) {
        const { target } = event;
        if (target.classList.contains('filter-btn')) {
            const filterCategory = target.getAttribute('data-filter');
            if (filterCategory && filterCategory !== activeFilter) {
                applyFilter(filterCategory);
            }
        }
    }

    window.FilterController = {
        init: function () {
            const filterBar = document.querySelector('.filter-bar');
            if (!filterBar) {
                return;
            }

            filterBar.addEventListener('click', handleFilterClick);
            setTimeout(() => applyFilter('all'), TIMING.FILTER_INIT_DELAY_MS);
        },
        applyFilter
    };
})();
