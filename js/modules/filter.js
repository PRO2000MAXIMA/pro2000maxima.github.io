(function () {
    let activeFilter = 'all';
    let filterableItems = [];

    function applyFilter(category) {
        activeFilter = category;

        // Dynamic refresh of items in case they were loaded late
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

        document.querySelectorAll('.filter-btn').forEach((btn) => {
            const btnCategory = btn.getAttribute('data-filter');
            const isActive = btnCategory === category;
            btn.classList.toggle('active', isActive);

            // Center active button in scrollable container (Mobile)
            if (isActive && window.innerWidth <= 1024) {
                btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });
    }

    window.FilterController = {
        init: function () {
            const filterBar = document.querySelector('.filter-bar');
            if (!filterBar) return;

            filterBar.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('filter-btn')) {
                    const filterCategory = target.getAttribute('data-filter');
                    if (filterCategory && filterCategory !== activeFilter) {
                        applyFilter(filterCategory);
                    }
                }
            });

            // Delay initial application to ensure dynamic content exists
            setTimeout(() => applyFilter('all'), 100);
        },
        applyFilter: applyFilter
    };
})();


