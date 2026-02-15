/**
 * MAJOTUBEUNAIDEA - Modal Controller (Umd Edition)
 * Versión compatible con file:// y servidores locales.
 */
(function () {
    let modalElement = null;
    let modalImage = null;
    let scaleIndicator = null;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let mouseMoved = false;
    let startX = 0;
    let startY = 0;
    let isAltDown = false;

    function ensureModalStructure() {
        modalElement = document.getElementById('imageModal');
        if (!modalElement) {
            modalElement = document.createElement('div');
            modalElement.id = 'imageModal';
            modalElement.className = 'modal';
            modalElement.innerHTML = `
                <div class="modal__controls">
                    <span class="modal__scale-indicator">100%</span>
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
            document.body.appendChild(modalElement);
        } else if (modalElement.parentElement !== document.body) {
            document.body.appendChild(modalElement);
        }
        modalImage = modalElement.querySelector('#modalImage');
        scaleIndicator = modalElement.querySelector('.modal__scale-indicator');
    }

    function updateTransform() {
        if (!modalImage) return;
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        if (scaleIndicator) scaleIndicator.textContent = `${Math.round(scale * 100)}%`;
        modalImage.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : (isAltDown ? 'zoom-out' : 'grab')) : 'zoom-in';
    }

    function changeZoom(delta) {
        let oldScale = scale;
        scale = Math.max(1, Math.min(scale + delta, 10));
        if (scale === oldScale) return;
        if (scale <= 1) { translateX = 0; translateY = 0; }
        updateTransform();
    }

    function resetZoom() {
        scale = 1; translateX = 0; translateY = 0;
        updateTransform();
    }

    function openModal(src) {
        ensureModalStructure();
        modalImage.src = src;
        resetZoom();
        modalElement.classList.add('active');
        modalElement.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalElement) return;
        modalElement.classList.remove('active');
        modalElement.style.display = 'none';
        document.body.style.overflow = '';
    }

    window.ModalController = {
        init: function () {
            ensureModalStructure();
            document.addEventListener('click', function (e) {
                const target = e.target;
                if (target.closest('.modal__controls') || target.closest('.modal')) return;

                // Selector agresivo: cualquier imagen o elemento con clase de tarjeta
                const trigger = target.closest('img, .card, .project-card, .invento-card, .presentation__slide, [data-zoomable]');
                if (trigger) {
                    const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
                    if (img && img.src && !img.closest('.modal')) {
                        if (target.closest('a') && target.closest('a').getAttribute('href') !== '#' && !trigger.hasAttribute('data-zoomable')) return;
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(img.src);
                    }
                }
            }, true);

            modalElement.addEventListener('click', function (e) {
                const t = e.target;
                if (t.closest('.modal__btn--zoom-in')) changeZoom(1);
                else if (t.closest('.modal__btn--zoom-out')) changeZoom(-1);
                else if (t.closest('.modal__btn--reset')) resetZoom();
                else if (t === modalElement || t.closest('.modal__content-wrapper') || t.closest('.modal__close')) {
                    if (t === modalImage) {
                        if (mouseMoved) return;
                        if (e.altKey || isAltDown) changeZoom(-1.5);
                        else (scale >= 10) ? resetZoom() : changeZoom(2);
                    } else {
                        closeModal();
                    }
                }
            });

            modalImage.addEventListener('mousedown', function (e) {
                mouseMoved = false;
                if (e.button === 0 && scale > 1 && !isAltDown) {
                    isDragging = true;
                    startX = e.clientX - translateX;
                    startY = e.clientY - translateY;
                }
            });

            window.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    mouseMoved = true;
                    translateX = e.clientX - startX;
                    translateY = e.clientY - startY;
                    updateTransform();
                }
            });

            window.addEventListener('mouseup', function () { isDragging = false; });
            modalImage.addEventListener('contextmenu', function (e) { if (scale > 1) { e.preventDefault(); changeZoom(-1.5); } });
            modalElement.addEventListener('wheel', function (e) { e.preventDefault(); changeZoom(e.deltaY > 0 ? -0.5 : 0.5); }, { passive: false });

            document.addEventListener('keydown', function (e) {
                if (!modalElement.classList.contains('active')) return;
                if (e.key === 'Alt') { isAltDown = true; updateTransform(); }
                if (e.key === 'Escape') closeModal();
                if (e.key === '+') changeZoom(0.5);
                if (e.key === '-') changeZoom(-0.5);
            });

            document.addEventListener('keyup', function (e) { if (e.key === 'Alt') { isAltDown = false; updateTransform(); } });
        },
        openModal: openModal,
        closeModal: closeModal
    };
})();
