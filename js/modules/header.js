(function () {
    const state = {
        isScrolled: false,
        scrollThreshold: 50
    };

    function handleScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        const shouldBeScrolled = window.scrollY > state.scrollThreshold;
        if (shouldBeScrolled !== state.isScrolled) {
            state.isScrolled = shouldBeScrolled;
            header.classList.toggle('scrolled', shouldBeScrolled);
        }
    }

    function toggleMobileNav() {
        const nav = document.querySelector('.nav');
        const toggle = document.querySelector('.nav-toggle');
        if (!nav || !toggle) return;
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
    }

    window.HeaderController = {
        init: function () {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            const navToggle = document.querySelector('.nav-toggle');
            if (navToggle) {
                navToggle.addEventListener('click', toggleMobileNav);
            }
            handleScroll();
        }
    };
})();

