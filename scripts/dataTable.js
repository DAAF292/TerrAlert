/**
 * Inicializa DataTable con los datos proporcionados por la API.
 * @param {Array} datos - Array de objetos con la información climática.
 */
export function inicializarDataTable(datos) {
    // Inicializa DataTable solo cuando hay datos disponibles
    if (datos && datos.length > 0) {
        $('#example').DataTable({
            data: datos,
            columns: [
                { title: 'Parámetro', data: 'name' },
                { title: 'Valor', data: 'value' }
            ],
            destroy: true, // Permite reiniciar la tabla sin duplicar los datos
            paging: false, // Opcional: desactiva la paginación si los datos no son muchos
            searching: false, // Opcional: desactiva la barra de búsqueda si no es necesaria
            info: false // Opcional: desactiva el conteo de filas
        });
    } else {
        console.error("No hay datos para mostrar en la tabla.");
    }
}

/**
 * Prepara los datos del clima en el formato adecuado para DataTable.
 * @param {Object} datosClima - Objeto con los datos meteorológicos obtenidos.
 * @returns {Array} - Array con los datos formateados para DataTable.
 */
export function formatearDatosClima(datosClima) {
    // Formatea los datos del clima en un array de objetos con name y value
    return [
        { name: 'Temperatura Actual', value: `${datosClima.temperaturaActual}°C` },
        { name: 'Humedad', value: `${datosClima.humedad}%` },
        { name: 'Viento', value: `${datosClima.viento} m/s` },
        { name: 'Temperatura Máxima', value: `${datosClima.temperaturaMaxima}°C` },
        { name: 'Temperatura Mínima', value: `${datosClima.temperaturaMinima}°C` }
    ];
}

