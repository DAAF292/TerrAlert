'use strict';
import * as firebase from './firebase.js';
import * as datos from './extraccionInformacion.js';
import * as tabla from './dataTable.js';
import * as mapa from './leaflet.js';


/**
* Función para dibujar la pantalla de inicio de sesión.
* - Agrega estilos específicos para el login.
* - Crea la estructura HTML de la pantalla de inicio de sesión.
* - Maneja el evento de envío del formulario para autenticación.
*/
export function dibujarLogin() {
    let $css = $('<link>', { rel: 'stylesheet', href: '../estilos/styles_login.css' });
    $('head').append($css);
    $('body').empty(); // Limpiar el contenido previo
    firebase.inicializarFirebase(); // Inicializa Firebase

    // Creación de la barra de navegación
    let barraNavegacion = $('<nav>');
    let contenedorNav = $('<div>').addClass('contenedor-nav');
    let divLogo = $('<div>').addClass('logo');
    let imagenLogo = $('<img>').attr({src: '../media/logo1.png', alt: 'Logo de TerrAlert'});
    let divNombreApp = $('<div>').addClass('nombre-app');
    let tituloApp = $('<h1>').text('TerrAlert');

    divLogo.append(imagenLogo);
    divNombreApp.append(tituloApp);
    contenedorNav.append(divLogo, divNombreApp);
    barraNavegacion.append(contenedorNav);

    // Creación del formulario de inicio de sesión
    let contenedorLogin = $('<div>').addClass('contenedor-login');
    let cajaLogin = $('<div>').addClass('caja-login');
    let tituloLogin = $('<h2>').text('Iniciar sesión');
    let formulario = $('<form>').attr({action: '#', method: 'POST'});

    // Entrada de correo
    let grupoCorreo = $('<div>').addClass('grupo-entrada');
    let etiquetaCorreo = $('<label>').attr('for', 'correo').text('Correo Electrónico');
    let entradaCorreo = $('<input>').attr({type: 'email', id: 'correo', name: 'correo', placeholder: 'Introduce tu correo', required: true});
    grupoCorreo.append(etiquetaCorreo, entradaCorreo);

    // Entrada de contraseña
    let grupoContrasena = $('<div>').addClass('grupo-entrada');
    let etiquetaContrasena = $('<label>').attr('for', 'contrasena').text('Contraseña');
    let entradaContrasena = $('<input>').attr({type: 'password', id: 'contrasena', name: 'contrasena', placeholder: 'Introduce tu contraseña', required: true});
    grupoContrasena.append(etiquetaContrasena, entradaContrasena);

    // Botón de inicio de sesión y enlaces adicionales
    let divAcciones = $('<div>').addClass('acciones');
    let botonLogin = $('<button>').addClass('btn-login').attr('type', 'submit').text('Entrar');
    let enlaceOlvidoContrasena = $('<a>').attr('href', '#').text('¿Olvidaste tu contraseña?');
    divAcciones.append(botonLogin, enlaceOlvidoContrasena);

    let enlaceRegistro = $('<div>').addClass('enlace-registro');
    let textoRegistro = $('<p>').html('¿No tienes cuenta? <a href="#">Regístrate</a>');
    enlaceRegistro.append(textoRegistro);

    formulario.append(grupoCorreo, grupoContrasena, divAcciones, enlaceRegistro);
    cajaLogin.append(tituloLogin, formulario);
    contenedorLogin.append(cajaLogin);

    $('body').append(barraNavegacion, contenedorLogin);

    // Manejo del evento de inicio de sesión
    formulario.on('submit', async function(e) {
        e.preventDefault();
        const correo = $('#correo').val();
        const contrasena = $('#contrasena').val();
        const inicioExitoso = await firebase.iniciarSesion(correo, contrasena);
        if (inicioExitoso) {
            dibujarDashboard();
        } else {
            alert('No se pudo iniciar sesión. Verifica tus datos.');
        }
    });

    // Manejo de recuperación de contraseña
    enlaceOlvidoContrasena.on('click', function(e) {
        e.preventDefault();
        const correo = $('#correo').val();
        firebase.recuperarContrasena(correo);
    });

    // Manejo del registro de usuario
    enlaceRegistro.find('a').on('click', function(e) {
        e.preventDefault();
        const correo = $('#correo').val();
        const contrasena = $('#contrasena').val();
        firebase.registrarUsuario(correo, contrasena);
    });
}


/**
* Función para dibujar la interfaz del dashboard.
* - Elimina los estilos del login y añade los del dashboard.
* - Crea el sidebar con los enlaces a distintas secciones.
* - Define eventos para manejar la navegación dentro de la aplicación.
*/
export function dibujarDashboard() {
    $('link[href$="styles_login.css"]').remove();
    let $css = $('<link>', { rel: 'stylesheet', href: '../estilos/styles_dashboard.css' });
    $('head').append($css);
    $('body').empty();

    // Creación del sidebar
    let $sidebar = $('<aside>', { class: 'sidebar' });
    let $logoContainer = $('<div>', { class: 'logo-container' })
        .append($('<img>', { src: '../media/logo1.png', alt: 'Logo de TerrAlert' }))
        .append($('<h2>', { class: 'app-name', text: 'TerrAlert' }));

    let $menu = $('<nav>', { class: 'menu' })
        .append($('<ul>')
            .append($('<li>').append($('<a>', { href: '#', text: 'Inicio', id: 'inicio-link' })))
            .append($('<li>').append($('<a>', { href: '#', text: 'Mapa de Zonas', id: 'mapa-link' })))
            .append($('<li>').append($('<a>', { href: '#', text: 'Análisis', id: 'analisis-link' })))
            .append($('<li>').append($('<a>', { href: '#', text: 'Reportes', id: 'reportes-link' })))
            .append($('<li>').append($('<a>', { href: '#', text: 'Configuración', id: 'configuracion-link' })))
        );

    $sidebar.append($logoContainer, $menu);
    let $main = $('<main>', { class: 'dashboard-main', id: 'main' });
    $('body').append($sidebar, $main);

    // Asignación de eventos a los enlaces
    $('#inicio-link').on('click', function(event) {
        event.preventDefault();
        dibujarInicio();
    });
    $('#mapa-link').on('click', function(event) {
        event.preventDefault();
        dibujarMapa();
    });
    $('#analisis-link').on('click', function(event) {
        event.preventDefault();
        dibujarAnalisis();
    });
    $('#reportes-link').on('click', function(event) {
        event.preventDefault();
        dibujarReportes();
    });
    $('#configuracion-link').on('click', function(event) {
        event.preventDefault();
        dibujarConfiguracion();
    });
    
    dibujarInicio(); // Mostrar la pantalla inicial por defecto
}


/**
* Función para dibujar la pantalla de inicio.
* Esta función se encarga de limpiar el contenido actual del main, 
* crear las secciones de noticias relevantes y el carrusel de imágenes 
* del cambio climático, y de cargar la información desde archivos JSON.
*/
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
  
    // Obtener las imágenes del archivo JSON
    fetch('../json/imagenes.json')
        .then(response => response.json())
        .then(imagenes => {
            // Seleccionar 5 imágenes aleatorias
            const randomImages = [];
            while (randomImages.length < 5) {
                const randomIndex = Math.floor(Math.random() * imagenes.length);
                if (!randomImages.includes(imagenes[randomIndex])) {
                    randomImages.push(imagenes[randomIndex]);
                }
            }
  
            // Crear los elementos del carrusel con las imágenes aleatorias
            randomImages.forEach((src, index) => {
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
  
            // Iniciar el carrusel
            inicializarCarrusel();
        })
        .catch(error => {
            console.error('Error al cargar las imágenes del carrusel:', error);
        });
  
    /**
     * Función para inicializar el carrusel de imágenes.
     * Permite navegar entre las imágenes y ajusta la posición de los elementos 
     * del carrusel al hacer clic en los botones de navegación.
     */
    function inicializarCarrusel() {
        let currentIndex = 0;
        const carouselItems = $('#carousel .carousel-item');
        const prevButton = $('.prev');
        const nextButton = $('.next');
        
        // Función para mostrar el item actual del carrusel
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
  
        // Manejo del clic en el botón anterior
        prevButton.on('click', function() {
            currentIndex--;
            showCarouselItem(currentIndex);
        });
  
        // Manejo del clic en el botón siguiente
        nextButton.on('click', function() {
            currentIndex++;
            showCarouselItem(currentIndex);
        });
  
        // Iniciar el carrusel mostrando el primer item
        showCarouselItem(currentIndex);
    }
}


/**
* Función para dibujar la sección de mapa y mostrar la información meteorológica.
* Se obtiene la ubicación del usuario y se muestra un mapa centrado en esa ubicación, 
* además de mostrar los datos climáticos actuales y la predicción.
*/
export function dibujarMapa() {
    // Limpiar el contenido del main antes de agregar el mapa y la información
    $('#main').empty(); 
  
    // Crear el contenedor principal para el mapa
    let $mapContainer = $('<div>', { id: 'map', class: 'map-container' });
  
    // Crear un contenedor para la información meteorológica
    let $infoContainer = $('<div>', { id: 'weather-info', class: 'weather-info' });
  
    // Agregar el contenedor del mapa y la información meteorológica al main
    $('#main').append($mapContainer, $infoContainer);
  
    // Inicializar el mapa
    mapa.inicializarMapa(); // Llama a la función para inicializar el mapa
  
    // Obtener la ubicación actual del usuario
    mapa.obtenerUbicacionUsuario()
        .then(async (ubicacion) => {
            const lat = ubicacion.lat;
            const lon = ubicacion.lon;
  
            // Centrar el mapa en la ubicación del usuario y agregar el marcador
            mapa.centrarEnUbicacionUsuario();
  
            // Obtener los datos climáticos y actualizar la interfaz
            const clima = await mapa.obtenerDatosClima(lat, lon);
  
            // Agregar la información meteorológica al contenedor
            $('#weather-info').html(`
                <h3>Información Meteorológica</h3>
                <p><strong>Temperatura:</strong> ${clima.temperatura}°C</p>
                <p><strong>Viento:</strong> ${clima.viento} km/h</p>
                <p><strong>Humedad:</strong> ${clima.humedad}%</p>
                <p><strong>Presión:</strong> ${clima.presion} hPa</p>
                <p><strong>Descripción:</strong> ${clima.descripcion}</p>
            `);
        })
        .catch((error) => {
            console.error('Error al obtener la ubicación del usuario:', error);
            alert('No se pudo obtener la ubicación del usuario.');
        });
}


/**
* Función para dibujar la sección de análisis climático.
* Muestra un formulario de búsqueda de ciudad y una tabla con los datos climáticos 
* de la ciudad seleccionada, además de mostrar tendencias climáticas a partir de los datos obtenidos.
*/
export function dibujarAnalisis() {
    // Limpiar el contenido del main antes de agregar la sección de análisis
    $('#main').empty();
  
    // Crear el contenedor principal
    let $analisisContainer = $('<div>', { id: 'analisis-container', class: 'analisis-container' });
  
    // Crear el formulario de búsqueda de ciudad
    let $form = $(`
        <form id="form-busqueda-ciudad" class="clima-form">
            <input type="text" id="input-ciudad" class="input-ciudad" placeholder="Ingresa una ciudad">
            <button type="submit" class="boton-buscar">Buscar</button>
        </form>
    `);
  
    // Crear un contenedor para mostrar la información meteorológica
    let $infoContainer = $('<div>', { id: 'info-clima', class: 'info-clima' });
  
    // Crear una tabla para los datos meteorológicos
    let $tabla = $(`
        <table id="tabla-clima" class="display clima-tabla">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Temp. Máx (°C)</th>
                    <th>Temp. Mín (°C)</th>
                    <th>Humedad (%)</th>
                    <th>Viento (m/s)</th>
                    <th>Anomalía (°C)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `);
  
    // Agregar los elementos al contenedor principal
    $analisisContainer.append($form, $infoContainer, $tabla);
    $('#main').append($analisisContainer);
  
    // Inicializar DataTables para la tabla de clima
    let dataTable = $('#tabla-clima').DataTable({
        destroy: true, // Permite reinicializar la tabla si ya existe
        responsive: true,
        autoWidth: false,
        columns: [
            { title: "Fecha" },
            { title: "Temp. Máx (°C)" },
            { title: "Temp. Mín (°C)" },
            { title: "Humedad (%)" },
            { title: "Viento (m/s)" },
            { title: "Anomalía (°C)" }
        ]
    });
  
    /**
     * Función para obtener y mostrar los datos meteorológicos.
     * Se obtienen los datos de clima y las tendencias climáticas, 
     * y luego se actualiza la interfaz con estos datos.
     */
    async function actualizarDatos(lat, lon, ciudad) {
        try {
            const datosClima = await datos.obtenerDatosMeteorologicos(lat, lon);
            const tendenciasClimaticas = await datos.obtenerTendenciasClimaticas(lat, lon);
  
            if (!datosClima) throw new Error('No se pudieron obtener los datos climáticos.');
  
            // Formatear los datos para DataTable
            const datosTabla = tabla.formatearDatosClima(datosClima, tendenciasClimaticas);
  
            // Mostrar la información en el contenedor con datos de cambio climático
            $infoContainer.html(`
                <div class="clima-resumen">
                    <h3>Condiciones Meteorológicas en ${ciudad}</h3>
                    <p><strong>Temperatura Actual:</strong> ${datosClima.temperaturaActual}°C</p>
                    <p><strong>Humedad:</strong> ${datosClima.humedad}%</p>
                    <p><strong>Viento:</strong> ${datosClima.viento} m/s</p>
                    <p><strong>Temperatura Máxima:</strong> ${datosClima.temperaturaMaxima}°C</p>
                    <p><strong>Temperatura Mínima:</strong> ${datosClima.temperaturaMinima}°C</p>
                </div>
                <div class="clima-alerta">
                    <h4>Variabilidad Climática</h4>
                    <p><strong>Temperatura Promedio Histórica:</strong> ${tendenciasClimaticas.promedioHistorico}°C</p>
                    <p><strong>Anomalía de Temperatura:</strong> ${tendenciasClimaticas.anomalia}°C</p>
                    <p class="alerta-texto">${tendenciasClimaticas.mensaje}</p>
                </div>
            `);
  
            // Vaciar la tabla antes de actualizar
            dataTable.clear();
  
            // Agregar nuevos datos
            dataTable.row.add([
                new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
                `${datosClima.temperaturaMaxima} °C`,
                `${datosClima.temperaturaMinima} °C`,
                `${datosClima.humedad} %`,
                `${datosClima.viento} m/s`,
                `${tendenciasClimaticas.anomalia} °C`
            ]);
  
            // Redibujar la tabla con los nuevos datos
            dataTable.draw();
  
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            $infoContainer.html('<p>Error al obtener los datos meteorológicos.</p>');
        }
    }
  
    // Obtener ubicación del usuario y cargar datos iniciales
    datos.getCurrentLocation()
        .then(({ latitude, longitude }) => actualizarDatos(latitude, longitude, 'Ubicación Actual'))
        .catch(error => {
            console.error("Error al obtener la ubicación del usuario:", error);
            $infoContainer.html('<p>No se pudo obtener la ubicación del usuario.</p>');
        });
  
    // Manejar la búsqueda de ciudad
    $form.on('submit', async function (event) {
        event.preventDefault(); // Evitar la recarga de la página
  
        let ciudad = $('#input-ciudad').val().trim();
        if (!ciudad) {
            alert('Por favor, ingresa una ciudad.');
            return;
        }
  
        try {
            const coordenadas = await datos.obtenerCoordenadas(ciudad);
            if (coordenadas.error) {
                alert(coordenadas.error);
                return;
            }
  
            // Actualizar los datos con la nueva ciudad
            actualizarDatos(coordenadas.latitude, coordenadas.longitude, coordenadas.name);
  
        } catch (error) {
            console.error("Error en la búsqueda de ciudad:", error);
            alert('Hubo un problema al buscar la ciudad.');
        }
    });
}
