// openMeteo.js

/**
 * Obtiene la latitud y longitud de una ciudad usando la API de geocodificación de Open-Meteo.
 * @param {string} ciudad - Nombre de la ciudad ingresada por el usuario.
 * @returns {Promise<Object>} - Objeto con latitud, longitud, nombre y país o un error.
 */
export async function obtenerCoordenadas(ciudad) {
    if (!ciudad.trim()) {
        return { error: 'Por favor, ingresa una ciudad.' };
    }

    try {
        // Llamada a la API para obtener la latitud y longitud de la ciudad
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1&language=es`);
        const data = await response.json();

        // Si no hay resultados, devolver un error
        if (!data.results) {
            return { error: 'Ciudad no encontrada.' };
        }

        // Extraer datos de la primera coincidencia
        const { latitude, longitude, name, country } = data.results[0];
        return { latitude, longitude, name, country };
    } catch (error) {
        console.error('Error obteniendo las coordenadas:', error);
        return { error: 'Error al obtener la ubicación.' };
    }
}

/**
 * Obtiene los datos del clima en base a latitud y longitud con la API Open-Meteo.
 * Devuelve un JSON con una selección de datos filtrada a partir de la respuesta.
 * @param {number} latitud - Latitud de la ubicación.
 * @param {number} longitud - Longitud de la ubicación.
 * @returns {Promise<Object>} - Objeto con datos del clima o un error.
 */
export async function obtenerDatosMeteorologicos(latitud, longitud) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,apparent_temperature,visibility,pressure_msl,uv_index,precipitation,cloudcover&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        // Aquí puedes reorganizar los datos en el formato que prefieras
        return {
            latitud: latitud,
            longitud: longitud,
            temperaturaActual: datos.hourly.temperature_2m[0],
            humedad: datos.hourly.relativehumidity_2m[0],
            viento: datos.hourly.windspeed_10m[0],
            temperaturaMaxima: datos.daily.temperature_2m_max[0],
            temperaturaMinima: datos.daily.temperature_2m_min[0],
        };

    } catch (error) {
        console.error("Error al obtener los datos meteorológicos:", error);
        return null;
    }
}

/**
 * Obtiene la geolocalización del dispositivo.
 * @returns {Promise<Object>} - Objeto con latitud y longitud o un error.
 */
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject({ error: 'Error al obtener la ubicación.' });
                }
            );
        } else {
            reject({ error: 'El navegador no soporta la geolocalización.' });
        }
    });
}
/**
 * Obtiene las tendencias climáticas a partir de datos históricos (modelo climático)
 * y la temperatura actual.
 *
 * @param {number} latitud - Latitud de la ubicación.
 * @param {number} longitud - Longitud de la ubicación.
 * @returns {Promise<Object>} - Objeto con el promedio histórico, la anomalía y un mensaje.
 */
export async function obtenerTendenciasClimaticas(latitud, longitud) {
    const start_date = '1950-01-01';
    const end_date = '2050-12-31';
    const models = "CMCC_CM2_VHR4,FGOALS_f3_H,HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S";
    const daily = "temperature_2m_max";
  
    const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${latitud}&longitude=${longitud}&start_date=${start_date}&end_date=${end_date}&models=${models}&daily=${daily}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
  
      console.log("Datos climáticos históricos recibidos:", data);
  
      if (data.error) {
        throw new Error(`Error de API: ${data.reason || 'Razón desconocida'}`);
      }
  
      if (!data.daily) {
        throw new Error("La respuesta no contiene el objeto 'daily'. Claves recibidas: " + Object.keys(data).join(", "));
      }
  
      // Buscar la clave correcta para la temperatura máxima
      const tempMaxKey = Object.keys(data.daily).find(key => key.startsWith("temperature_2m_max"));
  
      if (!tempMaxKey || !Array.isArray(data.daily[tempMaxKey])) {
        throw new Error("No se encontró una clave válida para 'temperature_2m_max'. Claves disponibles: " + Object.keys(data.daily).join(", "));
      }
  
      const tempMaxArray = data.daily[tempMaxKey];
  
      if (!data.daily.time || !Array.isArray(data.daily.time)) {
        throw new Error("La propiedad 'daily.time' no es un array válido.");
      }
  
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  
      let suma = 0;
      let contador = 0;
      for (let i = 0; i < data.daily.time.length; i++) {
        const mes = data.daily.time[i].substring(5, 7);
        if (mes === currentMonth) {
          suma += tempMaxArray[i];
          contador++;
        }
      }
  
      if (contador === 0) {
        throw new Error("No se encontraron datos históricos para el mes actual.");
      }
  
      const promedioHistorico = suma / contador;
  
      const currentData = await obtenerDatosMeteorologicos(latitud, longitud);
      if (!currentData || typeof currentData.temperaturaActual !== "number") {
        throw new Error("Datos meteorológicos actuales no disponibles.");
      }
      const currentTemp = currentData.temperaturaActual;
  
      const anomaly = currentTemp - promedioHistorico;
  
      let mensaje = "";
      if (anomaly > 1.0) {
        mensaje = "Alerta: La temperatura actual es significativamente mayor que la media histórica.";
      } else if (anomaly < -1.0) {
        mensaje = "Alerta: La temperatura actual es significativamente menor que la media histórica.";
      } else {
        mensaje = "La temperatura actual se encuentra dentro de la variabilidad histórica.";
      }
  
      return {
        promedioHistorico: promedioHistorico.toFixed(1),
        anomalia: anomaly.toFixed(1),
        mensaje: mensaje,
      };
  
    } catch (error) {
      console.error("Error en obtenerTendenciasClimaticas:", error);
      return {
        promedioHistorico: 'N/A',
        anomalia: 'N/A',
        mensaje: 'No se pudieron obtener las tendencias climáticas.'
      };
    }
  }
  