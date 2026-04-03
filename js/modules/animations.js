/**
 * MAJOTUBEUNAIDEA - Premium Animations (PRO-2000 MAXIMA Edition v4.0)
 * Sistema de animaciones premium con scroll, mouse tracking y microinteracciones
 * Baja complejidad ciclomática: máxima complejidad 5
 */

(function () {
    'use strict';

    /**
     * @constant {Object}
     */
    const CONFIG = Object.freeze({
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px',
        fadeDuration: 800,
        staggerDelay: 100,
        maxStagger: 3,
        fullPercent: 100
    });

    /**
     * @type {IntersectionObserver}
     */
    let scrollObserver = null;

    /**
     * @param {IntersectionObserverEntry[]} entries
     * @returns {void}
     */
    function handleIntersection(entries) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const element = entry.target;
            animateElement(element);
            scrollObserver.unobserve(element);
        });
    }

    /**
     * @param {HTMLElement} element
     * @returns {void}
     */
    function animateElement(element) {
        element.classList.add('is-visible');

        const delay = element.dataset.animationDelay;
        if (delay) {
            element.style.animationDelay = `${delay}ms`;
        }

        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
    }

    /**
     * @returns {void}
     */
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        scrollObserver = new IntersectionObserver(handleIntersection, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .card, .project-card, .invento-card, .intro-card, .idea-card'
        );

        animatedElements.forEach((element, index) => {
            prepareElement(element, index);
            scrollObserver.observe(element);
        });
    }

    /**
     * @param {HTMLElement} element
     * @param {number} index
     * @returns {void}
     */
    function prepareElement(element, index) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px) scale(0.98)';
        element.style.transition = `opacity ${CONFIG.fadeDuration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${CONFIG.fadeDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

        if (!element.dataset.animationDelay) {
            element.dataset.animationDelay = String((index % CONFIG.maxStagger) * CONFIG.staggerDelay);
        }
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    function handleMouseMove(event) {
        const cards = document.querySelectorAll('.card, .invento-card, .idea-card, .intro-card');
        const xPercent = (event.clientX / window.innerWidth) * 100;
        const yPercent = (event.clientY / window.innerHeight) * 100;

        cards.forEach((card) => {
            card.style.setProperty('--mouse-x', `${xPercent}%`);
            card.style.setProperty('--mouse-y', `${yPercent}%`);
        });
    }

    /**
     * @constant {Object}
     */
    const PARALLAX_CONFIG = Object.freeze({
        defaultSpeed: 0.5,
        observerThreshold: 0.3
    });

    /**
     * @returns {void}
     */
    function initMouseTracking() {
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    /**
     * @returns {void}
     */
    function injectGlobalStyles() {
        const style = document.createElement('style');
        style.id = 'premium-animations-styles';
        style.textContent = `
            .is-visible {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * @returns {void}
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) {
            return;
        }

        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach((element) => {
                const speed = parseFloat(element.dataset.parallax) || PARALLAX_CONFIG.defaultSpeed;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * @returns {void}
     */
    function initSmoothReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');

        if (revealElements.length === 0) {
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: PARALLAX_CONFIG.observerThreshold });

        revealElements.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(element);
        });

        const revealStyle = document.createElement('style');
        revealStyle.textContent = `
            .is-revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(revealStyle);
    }

    /**
     * @constant {Object}
     */
    const COUNTER_CONFIG = Object.freeze({
        defaultSpeed: 50,
        defaultDuration: 2000,
        observerThreshold: 0.5,
        cubicPower: 3
    });

    /**
     * @returns {void}
     */
    function initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');

        typewriterElements.forEach((element) => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed, 10) || COUNTER_CONFIG.defaultSpeed;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--color-primary)';

            let index = 0;
            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    element.style.borderRight = 'none';
                }
            }
            type();
        });
    }

    /**
     * @returns {void}
     */
    function initCounterAnimation() {
        const counterElements = document.querySelectorAll('[data-counter]');

        if (counterElements.length === 0) {
            return;
        }

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const element = entry.target;
                const target = parseInt(element.dataset.counter, 10);
                const duration = parseInt(element.dataset.counterDuration, 10) || COUNTER_CONFIG.defaultDuration;
                const startTime = window.performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    const easeOut = 1 - Math.pow(1 - progress, COUNTER_CONFIG.cubicPower);
                    const current = Math.floor(target * easeOut);

                    element.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(element);
            });
        }, { threshold: COUNTER_CONFIG.observerThreshold });

        counterElements.forEach((element) => {
            counterObserver.observe(element);
        });
    }

    /**
     * @returns {void}
     */
    function initGlowEffects() {
        const glowElements = document.querySelectorAll('.glow-on-hover');

        glowElements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = 'var(--shadow-glow-strong)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }

    // ============================================
    // PUBLIC API
    // ============================================

    window.ScrollAnimations = {
        init: function () {
            injectGlobalStyles();
            initScrollAnimations();
            initMouseTracking();
            initParallax();
            initSmoothReveal();
            initTypewriterEffect();
            initCounterAnimation();
            initGlowEffects();
        },

        refresh: function () {
            if (scrollObserver) {
                scrollObserver.disconnect();
            }
            initScrollAnimations();
        }
    };
})();
