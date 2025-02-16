/**
 * Inicializa DataTable con los datos proporcionados por la API.
 * @param {Array} datos - Array de objetos con la información climática.
 */
export function inicializarDataTable(datos) {
    // Verifica que haya datos disponibles antes de inicializar DataTable
    if (datos && datos.length > 0) {
        $('#example').DataTable({
            data: datos, // Asigna los datos a la tabla
            columns: [
                { title: 'Parámetro', data: 'name' }, // Define la columna de parámetros
                { title: 'Valor', data: 'value' } // Define la columna de valores
            ],
            destroy: true, // Permite reiniciar la tabla sin duplicar los datos previos
            paging: false, // Desactiva la paginación si los datos no son muchos
            searching: false, // Desactiva la barra de búsqueda si no es necesaria
            info: false // Desactiva la visualización del conteo de filas
        });
    } else {
        console.error("No hay datos para mostrar en la tabla."); // Mensaje de error si no hay datos
    }
}

/**
 * Prepara los datos del clima en el formato adecuado para DataTable.
 * @param {Object} datosClima - Objeto con los datos meteorológicos obtenidos.
 * @returns {Array} - Array con los datos formateados para DataTable.
 */
export function formatearDatosClima(datosClima) {
    // Verifica que el objeto datosClima no esté vacío
    if (!datosClima) {
        console.error("Datos climáticos no disponibles.");
        return [];
    }
    
    // Formatea los datos del clima en un array de objetos con claves 'name' y 'value'
    return [
        { name: 'Temperatura Actual', value: `${datosClima.temperaturaActual}°C` },
        { name: 'Humedad', value: `${datosClima.humedad}%` },
        { name: 'Viento', value: `${datosClima.viento} m/s` },
        { name: 'Temperatura Máxima', value: `${datosClima.temperaturaMaxima}°C` },
        { name: 'Temperatura Mínima', value: `${datosClima.temperaturaMinima}°C` }
    ];
}
