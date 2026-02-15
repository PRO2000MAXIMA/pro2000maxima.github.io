(function () {
    let activeFilter = 'all';
    let filterableItems = [];

    function applyFilter(category) {
        activeFilter = category;
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
            btn.classList.toggle('active', btnCategory === category);
        });
    }

    window.FilterController = {
        init: function () {
            const filterBar = document.querySelector('.filter-bar');
            if (!filterBar) return;
            filterableItems = Array.from(document.querySelectorAll('[data-category]'));
            filterBar.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('filter-btn')) {
                    const filterCategory = target.getAttribute('data-filter');
                    if (filterCategory && filterCategory !== activeFilter) {
                        applyFilter(filterCategory);
                    }
                }
            });
            applyFilter('all');
        },
        applyFilter: applyFilter
    };
})();

