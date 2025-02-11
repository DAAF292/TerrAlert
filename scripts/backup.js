export function dibujarInicio() {
    console.log('Dibujar la pantalla de Inicio');
    // Primero, vaciar el contenido actual del main
    $('main').empty();
  
    // Crear la sección de Noticias Relevantes
    const noticiasSection = $('<section>', { id: 'noticias', class: 'main-section' });
  
    const noticiasTitle = $('<h2>', { text: 'Noticias Relevantes' });
    noticiasSection.append(noticiasTitle);
  
    const newsCards = $('<div>', { class: 'news-cards' });
  
    // Obtener las noticias desde el archivo JSON
    fetch('../json/noticias.json')
        .then(response => response.json())
        .then(noticias => {
            // Seleccionar tres noticias aleatorias
            const randomNoticias = [];
            while (randomNoticias.length < 3) {
                const randomIndex = Math.floor(Math.random() * noticias.length);
                if (!randomNoticias.includes(noticias[randomIndex])) {
                    randomNoticias.push(noticias[randomIndex]);
                }
            }
  
            // Crear las tarjetas de noticias con las noticias aleatorias
            randomNoticias.forEach((news, index) => {
                const card = $('<div>', { class: 'card', id: 'news-card-' + (index + 1) });
  
                const cardTitle = $('<h3>', { text: news.title });
                card.append(cardTitle);
  
                const cardSummary = $('<p>', { text: news.summary });
                card.append(cardSummary);
  
                const readMoreLink = $('<a>', { href: news.link, text: 'Leer más', class: 'read-more' });
                card.append(readMoreLink);
  
                newsCards.append(card);
            });
  
            noticiasSection.append(newsCards);
            $('main').append(noticiasSection);
        })
        .catch(error => {
            console.error('Error al cargar las noticias:', error);
        });
  
    // Crear la sección del Carrusel
    const carruselSection = $('<section>', { id: 'carrusel', class: 'main-section' });
  
    const carruselTitle = $('<h2>', { text: 'Imágenes del Cambio Climático' });
    carruselSection.append(carruselTitle);
  
    const carouselContainer = $('<div>', { class: 'carousel-container' });
  
    const carousel = $('<div>', { class: 'carousel', id: 'carousel' });
  
    // Imágenes para el carrusel
    const carouselImages = [
        '../media/muestra.jpg',
        '../media/muestra.jpg',
        '../media/muestra.jpg'
    ];
  
    carouselImages.forEach((src, index) => {
        const carouselItem = $('<div>', { class: 'carousel-item', id: 'carousel-item-' + (index + 1) });
  
        const img = $('<img>', { src: src, alt: 'Imagen del cambio climático' });
        carouselItem.append(img);
        carousel.append(carouselItem);
    });
  
    carouselContainer.append(carousel);
  
    // Botones de navegación del carrusel
    const prevButton = $('<button>', { class: 'prev', html: '&#10094;' });
    const nextButton = $('<button>', { class: 'next', html: '&#10095;' });
  
    carouselContainer.append(prevButton);
    carouselContainer.append(nextButton);
  
    carruselSection.append(carouselContainer);
    $('main').append(carruselSection);
  
    function inicializarCarrusel() {
        let currentIndex = 0;
        const carouselItems = $('#carousel .carousel-item');
        const prevButton = $('.prev');
        const nextButton = $('.next');
        
        function showCarouselItem(index) {
            const totalItems = carouselItems.length;
            if (index >= totalItems) {
                currentIndex = 0; // Vuelve al inicio del carrusel
            } else if (index < 0) {
                currentIndex = totalItems - 1; // Vuelve al final del carrusel
            }
            const offset = -currentIndex * 100; // Mover el carrusel
            carouselItems.each(function() {
                $(this).css('transform', `translateX(${offset}%)`);
            });
        }
  
        prevButton.on('click', function() {
            currentIndex--;
            showCarouselItem(currentIndex);
        });
  
        nextButton.on('click', function() {
            currentIndex++;
            showCarouselItem(currentIndex);
        });
  
        // Iniciar el carrusel
        showCarouselItem(currentIndex);
    }
    // Iniciar el carrusel
    inicializarCarrusel();
  }