/**
 * MAJOTUBEUNAIDEA - Modal Controller (Umd Edition)
 * Versión compatible con file:// y servidores locales.
 * Refactorizado para cumplir PRO-2000 MAXIMA standards
 */
(function () {
    'use strict';

    // State management
    const state = {
        modalElement: null,
        modalImage: null,
        scaleIndicator: null,
        scale: 1,
        translateX: 0,
        translateY: 0,
        isDragging: false,
        mouseMoved: false,
        startX: 0,
        startY: 0,
        isAltDown: false
    };

    const ZOOM = Object.freeze({
        MIN: 1,
        MAX: 10,
        DEFAULT: 1,
        PERCENT_MULTIPLIER: 100,
        STEP_NORMAL: 1,
        STEP_ALT: -1.5,
        STEP_WHEEL_IN: 0.5,
        STEP_WHEEL_OUT: -0.5,
        STEP_KEY_IN: 0.5,
        STEP_KEY_OUT: -0.5
    });

    // DOM Structure
    function ensureModalStructure() {
        if (state.modalElement && state.modalElement.parentElement === document.body) {
            return;
        }

        state.modalElement = document.getElementById('imageModal');
        if (!state.modalElement) {
            state.modalElement = createModalElement();
            document.body.appendChild(state.modalElement);
        } else if (state.modalElement.parentElement !== document.body) {
            document.body.appendChild(state.modalElement);
        }

        state.modalImage = state.modalElement.querySelector('#modalImage');
        state.scaleIndicator = state.modalElement.querySelector('.modal__scale-indicator');
    }

    function createModalElement() {
        const div = document.createElement('div');
        div.id = 'imageModal';
        div.className = 'modal';
        div.innerHTML = getModalHTML();
        return div;
    }

    function getModalHTML() {
        return `
            <div class="modal__controls">
                <span class="modal__scale-indicator">${ZOOM.PERCENT_MULTIPLIER}%</span>
                <button class="modal__btn modal__btn--zoom-out" title="Alejar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </button>
                <button class="modal__btn modal__btn--reset" title="1:1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
                </button>
                <button class="modal__btn modal__btn--zoom-in" title="Acercar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </button>
                <span class="modal__close">×</span>
            </div>
            <div class="modal__content-wrapper">
                <img class="modal__content" id="modalImage" alt="Imagen ampliada">
            </div>`;
    }

    // Transform & Zoom
    function updateTransform() {
        if (!state.modalImage) {
            return;
        }
        state.modalImage.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
        if (state.scaleIndicator) {
            state.scaleIndicator.textContent = `${Math.round(state.scale * ZOOM.PERCENT_MULTIPLIER)}%`;
        }
        updateCursor();
    }

    function updateCursor() {
        if (!state.modalImage) {
            return;
        }
        if (state.scale > ZOOM.MIN) {
            if (state.isDragging) {
                state.modalImage.style.cursor = 'grabbing';
            } else if (state.isAltDown) {
                state.modalImage.style.cursor = 'zoom-out';
            } else {
                state.modalImage.style.cursor = 'grab';
            }
        } else {
            state.modalImage.style.cursor = 'zoom-in';
        }
    }

    function changeZoom(delta) {
        const oldScale = state.scale;
        state.scale = Math.max(ZOOM.MIN, Math.min(state.scale + delta, ZOOM.MAX));
        if (state.scale === oldScale) {
            return;
        }
        if (state.scale <= ZOOM.MIN) {
            state.translateX = 0;
            state.translateY = 0;
        }
        updateTransform();
    }

    function resetZoom() {
        state.scale = ZOOM.DEFAULT;
        state.translateX = 0;
        state.translateY = 0;
        updateTransform();
    }

    // Modal Open/Close
    function openModal(src) {
        ensureModalStructure();
        state.modalImage.src = src;
        resetZoom();
        state.modalElement.classList.add('active');
        state.modalElement.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!state.modalElement) {
            return;
        }
        state.modalElement.classList.remove('active');
        state.modalElement.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Click Handlers (Separated to reduce complexity)
    function handleImageClick(e) {
        if (state.mouseMoved) {
            return;
        }
        if (e.altKey || state.isAltDown) {
            changeZoom(ZOOM.STEP_ALT);
        } else if (state.scale >= ZOOM.MAX) {
            resetZoom();
        } else {
            changeZoom(ZOOM.STEP_NORMAL);
        }
    }

    function handleModalBackgroundClick() {
        closeModal();
    }

    function handleZoomButtonClick(target) {
        if (target.closest('.modal__btn--zoom-in')) {
            changeZoom(ZOOM.STEP_NORMAL);
        } else if (target.closest('.modal__btn--zoom-out')) {
            changeZoom(-ZOOM.STEP_NORMAL);
        } else if (target.closest('.modal__btn--reset')) {
            resetZoom();
        }
    }

    function handleModalClick(e) {
        const t = e.target;
        handleZoomButtonClick(t);

        if (t === state.modalElement || t.closest('.modal__content-wrapper') || t.closest('.modal__close')) {
            if (t === state.modalImage) {
                handleImageClick(e);
            } else {
                handleModalBackgroundClick();
            }
        }
    }

    // Drag Handlers
    function handleMouseDown(e) {
        state.mouseMoved = false;
        if (e.button === 0 && state.scale > ZOOM.MIN && !state.isAltDown) {
            state.isDragging = true;
            state.startX = e.clientX - state.translateX;
            state.startY = e.clientY - state.translateY;
        }
    }

    function handleMouseMove(e) {
        if (state.isDragging) {
            state.mouseMoved = true;
            state.translateX = e.clientX - state.startX;
            state.translateY = e.clientY - state.startY;
            updateTransform();
        }
    }

    function handleMouseUp() {
        state.isDragging = false;
    }

    // Wheel & Keyboard
    function handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? ZOOM.STEP_WHEEL_OUT : ZOOM.STEP_WHEEL_IN;
        changeZoom(delta);
    }

    function handleContextMenu(e) {
        if (state.scale > ZOOM.MIN) {
            e.preventDefault();
            changeZoom(ZOOM.STEP_ALT);
        }
    }

    function handleKeyDown(e) {
        if (!state.modalElement || !state.modalElement.classList.contains('active')) {
            return;
        }
        switch (e.key) {
            case 'Alt':
                state.isAltDown = true;
                updateTransform();
                break;
            case 'Escape':
                closeModal();
                break;
            case '+':
                changeZoom(ZOOM.STEP_KEY_IN);
                break;
            case '-':
                changeZoom(ZOOM.STEP_KEY_OUT);
                break;
        }
    }

    function handleKeyUp(e) {
        if (e.key === 'Alt') {
            state.isAltDown = false;
            updateTransform();
        }
    }

    // Document click helpers (to reduce complexity)
    function shouldIgnoreClick(target) {
        return target.closest('.modal__controls') || target.closest('.modal');
    }

    function findTriggerElement(target) {
        return target.closest('img, .card, .project-card, .invento-card, .presentation__slide, [data-zoomable]');
    }

    function extractImageFromTrigger(target, trigger) {
        if (target.tagName === 'IMG') {
            return trigger;
        }
        return trigger.querySelector('img');
    }

    function isValidImageForModal(img) {
        return img && img.src && !img.closest('.modal');
    }

    function shouldPreventLinkDefault(target, trigger) {
        const closestLink = target.closest('a');
        if (!closestLink) {
            return false;
        }
        const href = closestLink.getAttribute('href');
        return href !== '#' && !trigger.hasAttribute('data-zoomable');
    }

    // Document click for opening modal
    function handleDocumentClick(e) {
        const { target } = e;
        if (shouldIgnoreClick(target)) {
            return;
        }

        const trigger = findTriggerElement(target);
        if (!trigger) {
            return;
        }

        const img = extractImageFromTrigger(target, trigger);
        if (!isValidImageForModal(img)) {
            return;
        }

        if (shouldPreventLinkDefault(target, trigger)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        openModal(img.src);
    }

    // Public API
    window.ModalController = {
        init: function () {
            ensureModalStructure();

            // Document click (open modal)
            document.addEventListener('click', handleDocumentClick, true);

            // Modal interactions
            state.modalElement.addEventListener('click', handleModalClick);
            state.modalImage.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            state.modalImage.addEventListener('contextmenu', handleContextMenu);
            state.modalElement.addEventListener('wheel', handleWheel, { passive: false });

            // Keyboard
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
        },
        openModal,
        closeModal
    };
})();
