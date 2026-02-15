(function () {
    const CONFIG = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    function handleIntersection(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('is-visible');
                const delay = element.dataset.animationDelay;
                if (delay) {
                    element.style.animationDelay = delay;
                }
            }
        });
    }

    window.ScrollAnimations = {
        init: function () {
            if (!('IntersectionObserver' in window)) return;
            const observer = new IntersectionObserver(handleIntersection, {
                threshold: CONFIG.threshold,
                rootMargin: CONFIG.rootMargin
            });
            document.querySelectorAll('.animate-on-scroll, .card, .project-card, .invento-card, .intro-card').forEach((el) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
            const style = document.createElement('style');
            style.textContent = `.is-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
            document.head.appendChild(style);
        }
    };
})();

