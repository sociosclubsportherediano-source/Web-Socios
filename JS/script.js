document.addEventListener('DOMContentLoaded', () => {

    // Función reutilizable para inicializar cualquier carrusel de forma independiente
    const initCarousel = (containerSelector) => {
        const root = document.querySelector(containerSelector);
        if (!root) return; // Si no existe este carrusel en la página, no hace nada

        // Selecciona los elementos específicos DENTRO de este contenedor
        const slidesContainer = root.querySelector('.carousel-slides, .presidents-slides');
        const slides = slidesContainer ? Array.from(slidesContainer.children) : [];
        const prevButton = root.querySelector('.prev-btn, .prev-btn-presidents');
        const nextButton = root.querySelector('.next-btn, .next-btn-presidents');
        const indicators = root.querySelectorAll('.indicator');

        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;

        if (totalSlides === 0) {
            console.warn(`No se encontraron slides en el carrusel: ${containerSelector}`);
            return;
        }

        // Calcula cuántas tarjetas caben visibles y el índice máximo permitido,
        // para que el carrusel nunca se deslice más allá de la última tarjeta.
        const getMetrics = () => {
            const itemWidth = slides[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(slidesContainer).columnGap || getComputedStyle(slidesContainer).gap) || 0;
            const step = itemWidth + gap;
            const viewportWidth = slidesContainer.parentElement.getBoundingClientRect().width;
            const visibleCount = Math.max(1, Math.floor(viewportWidth / step));
            const maxIndex = Math.max(0, totalSlides - visibleCount);
            return { step, maxIndex };
        };

        // Función para actualizar la posición e indicadores de ESTE carrusel
        const updateCarousel = () => {
            const { step, maxIndex } = getMetrics();

            // Evita quedarse mostrando espacio vacío al final del carrusel
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const offset = -currentIndex * step;
            if (slidesContainer) {
                slidesContainer.style.transform = `translateX(${offset}px)`;
            }

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

            // Oculta visualmente las flechas cuando ya no hay más hacia ese lado
            if (prevButton) prevButton.style.visibility = currentIndex <= 0 ? 'hidden' : 'visible';
            if (nextButton) nextButton.style.visibility = currentIndex >= maxIndex ? 'hidden' : 'visible';
        };

        const nextSlide = () => {
            const { maxIndex } = getMetrics();
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateCarousel();
        };

        const prevSlide = () => {
            const { maxIndex } = getMetrics();
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            updateCarousel();
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 5000); // 5 segundos
        };

        // Eventos de botones
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            });
        }

        // Eventos de los puntitos (indicadores), si el carrusel los tiene
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                stopAutoSlide();
                const index = parseInt(indicator.dataset.index);
                if (!isNaN(index) && index !== currentIndex) {
                    currentIndex = index;
                    updateCarousel();
                }
                startAutoSlide();
            });
        });

        // Pausa al pasar el mouse por encima
        root.addEventListener('mouseenter', stopAutoSlide);
        root.addEventListener('mouseleave', startAutoSlide);

        // Recalcula el desplazamiento si cambia el tamaño de ventana (celular <-> escritorio)
        window.addEventListener('resize', updateCarousel);

        // Inicialización local
        updateCarousel();
        startAutoSlide();
    };

    // --- INICIALIZACIÓN DE LOS DOS CARRUSELES ---
    initCarousel('.presidents-history');
    initCarousel('.trophy-carousel-container');

});
