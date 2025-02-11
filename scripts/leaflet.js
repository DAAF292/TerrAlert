// Importar Leaflet si es necesario en tu entorno
// import L from 'leaflet';

// API de Open-Meteo (No necesita API Key)
const API_URL = "https://api.open-meteo.com/v1/forecast";

// Variable para almacenar el mapa
let map;

// Función para inicializar el mapa
export function inicializarMapa() {
    // Verificar si el contenedor del mapa existe en el DOM
    if (!document.getElementById('map')) {
        console.error("Error: El contenedor del mapa no está presente en el DOM.");
        return;
    }

    // Inicializar el mapa centrado en Castro Urdiales
    map = L.map('map').setView([43.3837, -3.2188], 13);

    // Cargar OpenStreetMap como capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    console.log("Mapa inicializado correctamente.");
}

// Función para obtener la ubicación actual del usuario
export function obtenerUbicacionUsuario() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    reject("Error al obtener la ubicación del usuario.");
                }
            );
        } else {
            reject("El navegador no soporta la geolocalización.");
        }
    });
}


// Función para obtener datos climáticos desde Open-Meteo
export async function obtenerDatosClima(lat, lon) {
    try {
        const response = await fetch(`${API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,pressure_msl`);
        const data = await response.json();
        
        console.log("Datos climáticos:", data);

        // Obtener datos climáticos actuales
        const temperatura = data.current_weather.temperature;
        const viento = data.current_weather.windspeed;
        const presion = data.hourly.pressure_msl?.slice(-1)[0] || "N/D";  // Última presión disponible
        const humedad = data.hourly.relative_humidity_2m?.slice(-1)[0] || "N/D"; // Última humedad disponible

        return {
            temperatura,
            viento,
            humedad,
            presion,
            descripcion: `Viento: ${viento} km/h, Humedad: ${humedad}%, Presión: ${presion} hPa`
        };
    } catch (error) {
        console.error("Error al obtener datos climáticos:", error);
        throw error;
    }
}


// Función para agregar un marcador con información del clima
export async function agregarMarcador(lat, lon, nombre = "Ubicación") {
    if (!map) {
        console.error("El mapa no está inicializado.");
        return;
    }

    try {
        const clima = await obtenerDatosClima(lat, lon);
        const contenidoPopup = `
            <strong>${nombre}</strong><br>
            Temperatura: ${clima.temperatura}°C<br>
            Viento: ${clima.viento} km/h<br>
            Humedad: ${clima.humedad}%<br>
            Presión: ${clima.presion} hPa<br>
            ${clima.descripcion}
        `;

        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(contenidoPopup)
            .openPopup();

        console.log(`Marcador agregado en: ${nombre}`);
    } catch (error) {
        console.error("No se pudo agregar el marcador:", error);
    }
}

// Función para centrar el mapa en la ubicación del usuario y agregar marcador
export async function centrarEnUbicacionUsuario() {
    try {
        const ubicacion = await obtenerUbicacionUsuario();
        map.setView([ubicacion.lat, ubicacion.lon], 13);
        agregarMarcador(ubicacion.lat, ubicacion.lon, "Tu ubicación");
    } catch (error) {
        alert(error);
    }
}
