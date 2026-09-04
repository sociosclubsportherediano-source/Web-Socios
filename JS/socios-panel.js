// =========================================================================
// 🛑 ESTRUCTURA MOVIDA A window.onload PARA GARANTIZAR QUE LAS IMÁGENES
// TENGAN TIEMPO DE CARGARSE Y SUS DIMENSIONES ESTÉN DISPONIBLES.
// =========================================================================

window.addEventListener('load', () => {

    // Obtiene el número de socio desde localStorage
    const loggedInSocioNumber = localStorage.getItem('loggedInSocioNumber');

    // Lee la base de datos de socios desde localStorage
    let sociosDB = JSON.parse(localStorage.getItem('sociosDB')) || [];
    const socioData = sociosDB.find(socio => socio.numeroSocio === loggedInSocioNumber) || {
        nombre: 'Socio de Prueba',
        numeroSocio: '0000',
        telefono: 'N/A',
        fechaIngreso: 'N/A',
        tipoMembresia: 'Básico'
    };
    
    // ===== Carga la información del socio en los elementos HTML (Mantenida) =====
    function loadSocioInfo() {
        const nombreSocioSpan = document.getElementById('nombre-socio');
        const nombreSocioInfoSpan = document.getElementById('nombre-socio-info');
        
        if (nombreSocioSpan) {
            nombreSocioSpan.textContent = socioData.nombre;
        }

        if (nombreSocioInfoSpan) {
            nombreSocioInfoSpan.textContent = socioData.nombre;
        }

        const numSocioSpan = document.getElementById('num-socio');
        if (numSocioSpan) {
            numSocioSpan.textContent = socioData.numeroSocio;
        }

        const telefonoSocioSpan = document.getElementById('telefono-socio');
        if (telefonoSocioSpan) {
            telefonoSocioSpan.textContent = socioData.telefono;
        }

        const fechaIngresoInfoSpan = document.getElementById('fecha-ingreso-info');
        if (fechaIngresoInfoSpan) {
            fechaIngresoInfoSpan.textContent = socioData.fechaIngreso;
        }

        const tipoMembresiaInfoSpan = document.getElementById('tipo-membresia-info');
        if (tipoMembresiaInfoSpan) {
            tipoMembresiaInfoSpan.textContent = socioData.tipoMembresia;
        }
    }

    loadSocioInfo();

    // [ ... CÓDIGO DE LÓGICA DE CERRAR SESIÓN, FOTO, PERFIL, FORO, PAGOS MANTENIDO AQUÍ ... ]
    
    // ===== Lógica para el botón de cerrar sesión (Mantenida) =====
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInSocioNumber');
            alert('Sesión cerrada. ¡Hasta pronto!');
            window.location.href = '../index.html';
        });
    }

    // ===== Lógica para subir foto de perfil (Mantenida) =====
    const uploadInput = document.getElementById('upload-photo');
    const profileImg = document.getElementById('profile-img');

    if (uploadInput && profileImg) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ===== Lógica para el botón "Editar Perfil" (Mantenida) =====
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.getElementById('edit-profile-form');
    const nombreInput = document.getElementById('edit-nombre');
    const telefonoInput = document.getElementById('edit-telefono');
    const fechaIngresoInput = document.getElementById('edit-fecha-ingreso');
    const tipoMembresiaInput = document.getElementById('edit-tipo-membresia');
    
    if (editBtn && saveBtn && cancelBtn && editForm) {
        editBtn.addEventListener('click', () => {
            nombreInput.value = socioData.nombre;
            telefonoInput.value = socioData.telefono;
            fechaIngresoInput.value = socioData.fechaIngreso;
            tipoMembresiaInput.value = socioData.tipoMembresia;
            
            editForm.classList.add('visible');
            editBtn.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            editForm.classList.remove('visible');
            editBtn.style.display = 'block';
        });

        saveBtn.addEventListener('click', () => {
            // Actualiza los datos en el objeto socioData
            socioData.nombre = nombreInput.value;
            socioData.telefono = telefonoInput.value;

            // Actualiza la base de datos en localStorage
            let sociosDB = JSON.parse(localStorage.getItem('sociosDB')) || [];
            const socioIndex = sociosDB.findIndex(s => s.numeroSocio === socioData.numeroSocio);
            if (socioIndex !== -1) {
                sociosDB[socioIndex] = socioData;
                localStorage.setItem('sociosDB', JSON.stringify(sociosDB));
            }
            
            // Actualiza la vista
            document.getElementById('nombre-socio-info').textContent = socioData.nombre;
            document.getElementById('telefono-socio').textContent = socioData.telefono;
            document.getElementById('nombre-socio').textContent = socioData.nombre;
            
            editForm.classList.remove('visible');
            editBtn.style.display = 'block';
            
            alert('Información guardada con éxito.');
        });
    }

    // ===== Lógica para el Foro (Mantenida) =====
    const newTopicBtn = document.querySelector('.new-topic-btn');
    const newTopicForm = document.getElementById('new-topic-form');
    const cancelTopicBtn = document.getElementById('cancel-topic-btn');
    const publishTopicBtn = document.querySelector('#new-topic-form .save-btn');
    const topicTitleInput = document.getElementById('topic-title');
    const topicContentInput = document.getElementById('topic-content');
    const forumTopicsList = document.getElementById('forum-topics-list');

    if (newTopicBtn && newTopicForm && cancelTopicBtn && publishTopicBtn && forumTopicsList) {
        newTopicBtn.addEventListener('click', () => {
            newTopicForm.style.display = 'block';
            newTopicBtn.style.display = 'none';
        });

        cancelTopicBtn.addEventListener('click', () => {
            newTopicForm.style.display = 'none';
            newTopicBtn.style.display = 'block';
            topicTitleInput.value = '';
            topicContentInput.value = '';
        });

        publishTopicBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (topicTitleInput.value.trim() === '') {
                alert('¡El título no puede estar vacío!');
                return;
            }

            const newTopicItem = document.createElement('div');
            newTopicItem.classList.add('topic-item');
            newTopicItem.innerHTML = `
                <h4><a href="#">${topicTitleInput.value}</a></h4>
                <p>Creado por: ${socioData.nombre} | Última respuesta: ahora</p>
                <span class="topic-meta">0 respuestas</span>
            `;

            forumTopicsList.prepend(newTopicItem);
            newTopicForm.style.display = 'none';
            newTopicBtn.style.display = 'block';
            topicTitleInput.value = '';
            topicContentInput.value = '';
            
            alert('¡Tu tema ha sido publicado!');
        });
    }

    // ===== Lógica para simular la visualización de un tema (Mantenida) =====
    if (forumTopicsList) {
        forumTopicsList.addEventListener('click', (e) => {
            const targetLink = e.target.closest('a');
            if (targetLink && targetLink.closest('.topic-item')) {
                const topicTitle = targetLink.textContent;
                alert(`Has entrado a ver la discusión: "${topicTitle}"\n\nEn un sitio real, aquí se mostraría el contenido completo del tema.`);
            }
        });
    }

    // ===== Función para cargar los datos del historial de pagos (Mantenida) =====
    function loadPaymentHistory() {
        const historyList = document.querySelector('.payment-history ul');
        if (historyList) {
            historyList.innerHTML = ''; // Limpia el contenido existente
            const payments = [
                { year: 2025, status: 'Pagado' },
                { year: 2024, status: 'Pagado' },
                { year: 2023, status: 'Pagado' },
                { year: 2022, status: 'Pendiente' }
            ];

            payments.forEach(payment => {
                const li = document.createElement('li');
                li.innerHTML = `Pago de cuota anual ${payment.year}: <span class="${payment.status.toLowerCase()}">${payment.status}</span>`;
                historyList.appendChild(li);
            });
        }
    }

    loadPaymentHistory();
    
    
    // ======================================================================================
    // ===== SETUP CARRUSEL DE PRESIDENTES (LÓGICA AISLADA y CLASE ÚNICA) =====
    // ======================================================================================
    function setupPresidentsCarousel() {
        const carousel = document.querySelector('.presidents-carousel-unique');
        const slidesContainer = document.querySelector('.presidents-carousel-unique .presidents-slides');
        const slides = document.querySelectorAll('.presidents-carousel-unique .president-card-item'); 
        const prevBtn = document.querySelector('.prev-btn-presidents');
        const nextBtn = document.querySelector('.next-btn-presidents');

        if (!slidesContainer || slides.length === 0 || !carousel) return;

        let currentIndex = 0;
        const totalSlides = slides.length;
        const marginTotal = 30; // 15px de margen izquierdo + 15px de margen derecho

        // SOLUCIÓN DEL FILTRO ROJO
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                img.style.filter = 'none'; 
            }
        });

        // Lógica de movimiento específica para Presidentes
        function updateCarousel() {
            const itemWidth = slides[0].offsetWidth + marginTotal; 
            const visibleSlides = Math.floor(carousel.offsetWidth / itemWidth);
            if (visibleSlides === 0) return; 

            const maxIndex = totalSlides - visibleSlides; 

            if (currentIndex > maxIndex) {
                currentIndex = 0; // 🛑 CAMBIO CLAVE: Reiniciar al inicio si llega al final
            }
            if (currentIndex < 0) {
                 // Si se va hacia atrás desde 0, ir al final (última vista)
                currentIndex = maxIndex; 
            }

            const offset = -currentIndex * itemWidth;
            slidesContainer.style.transform = `translateX(${offset}px)`;
        }

        // 🛑 EVENTOS DE BOTONES: Mantenemos el movimiento por página (visibleSlides)
        prevBtn.addEventListener('click', () => {
            const itemWidth = slides[0].offsetWidth + marginTotal; 
            const visibleSlides = Math.floor(carousel.offsetWidth / itemWidth);
            currentIndex -= visibleSlides; 
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            const itemWidth = slides[0].offsetWidth + marginTotal; 
            const visibleSlides = Math.floor(carousel.offsetWidth / itemWidth);
            currentIndex += visibleSlides; 
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel(); 
        
        // Exponemos la función de actualización para el auto-slide
        return { next: () => {
            const itemWidth = slides[0].offsetWidth + marginTotal; 
            const visibleSlides = Math.floor(carousel.offsetWidth / itemWidth);
            currentIndex += visibleSlides; 
            updateCarousel();
        }};
    }

    // ===============================================
    // ===== SETUP CARRUSEL DE TROFEOS (LÓGICA AISLADA) =====
    // ===============================================
    function setupTrophyCarousel() {
        const carousel = document.querySelector('.trophy-carousel:not(.presidents-carousel-unique)');
        const slidesContainer = document.querySelector('.trophy-carousel:not(.presidents-carousel-unique) .carousel-slides');
        const slides = document.querySelectorAll('.trophy-carousel:not(.presidents-carousel-unique) .carousel-item');
        const prevBtn = document.querySelector('.trophy-carousel:not(.presidents-carousel-unique) .prev-btn');
        const nextBtn = document.querySelector('.trophy-carousel:not(.presidents-carousel-unique) .next-btn');

        if (!slidesContainer || slides.length === 0 || !carousel) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        // LÓGICA DE COLOR DE TROFEOS: Se mantiene.
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            
            if (index % 2 === 0) {
                img.style.filter = 'none'; 
                
            } else {
                img.style.filter = 'hue-rotate(320deg) brightness(1.3) saturate(1.8)'; 
            }
        });
        
        // Lógica de movimiento específica para Trofeos
        function updateCarousel() {
            const visibleSlides = Math.floor(carousel.offsetWidth / slides[0].offsetWidth);
            if (visibleSlides === 0) return; 

            const maxIndex = totalSlides - visibleSlides;

            if (currentIndex > maxIndex) {
                currentIndex = 0; // Reinicia para el loop infinito de trofeos
            }
            if (currentIndex < 0) {
                currentIndex = maxIndex; // Si se va hacia atrás desde 0, ir al final
            }

            const slideWidth = slides[0].offsetWidth; 
            const offset = -currentIndex * slideWidth;
            slidesContainer.style.transform = `translateX(${offset}px)`;
        }

        // 🛑 EVENTOS DE BOTONES SOLO PARA TROFEOS 🛑
        prevBtn.addEventListener('click', () => {
            const visibleSlides = Math.floor(carousel.offsetWidth / slides[0].offsetWidth);
            currentIndex -= visibleSlides;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            const visibleSlides = Math.floor(carousel.offsetWidth / slides[0].offsetWidth);
            currentIndex += visibleSlides;
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel(); 
        
        // Exponemos la función de actualización para el auto-slide
        return { next: () => {
            const visibleSlides = Math.floor(carousel.offsetWidth / slides[0].offsetWidth);
            currentIndex += visibleSlides;
            updateCarousel();
        }};
    }

    
    // ===============================================
    // ===== Lógica para Movimiento Automático de TROFEOS =====
    // ===============================================
    let trophyControls; // Para guardar las funciones de control
    function startTrophyAutoSlide(intervalTime = 2500) { 
        if (!trophyControls) return;

        let autoSlideInterval = setInterval(() => {
            trophyControls.next(); 
        }, intervalTime); 

        const carousel = document.querySelector('.trophy-carousel:not(.presidents-carousel-unique)');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                clearInterval(autoSlideInterval); 
                autoSlideInterval = setInterval(() => {
                    trophyControls.next();
                }, intervalTime);
            });
        }
    }

    // ===============================================
    // ===== Lógica para Movimiento Automático de PRESIDENTES (NUEVO) =====
    // ===============================================
    let presidentControls; // Para guardar las funciones de control
    function startPresidentsAutoSlide(intervalTime = 2500) { // 🛑 NUEVA FUNCIÓN
        if (!presidentControls) return;

        let autoSlideInterval = setInterval(() => {
            presidentControls.next(); 
        }, intervalTime); 

        const carousel = document.querySelector('.presidents-carousel-unique');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                clearInterval(autoSlideInterval); 
                autoSlideInterval = setInterval(() => {
                    presidentControls.next();
                }, intervalTime);
            });
        }
    }


    // 🛑 AJUSTE FINAL: Inicialización con pequeño delay para garantizar medición.
    setTimeout(() => {
        trophyControls = setupTrophyCarousel();
        presidentControls = setupPresidentsCarousel();
        
        // Iniciamos el auto-slide para ambos
        startTrophyAutoSlide();
        startPresidentsAutoSlide(); 
    }, 50); 
});