'use strict';

// Accedemos a las librerías globales ya cargadas en el HTML
const tf = window.tf; // TensorFlow.js
const mobilenet = window.mobilenet; // Modelo MobileNet para clasificación de imágenes

// Variable para almacenar el modelo cargado
let model = null;

/**
 * Carga el modelo MobileNet si no está cargado previamente.
 * @returns {Promise<any>} El modelo MobileNet listo para clasificar imágenes.
 */
export async function loadModel() {
    if (!model) {
        model = await mobilenet.load(); // Carga el modelo si aún no está en memoria
    }
    return model;
}

/**
 * Clasifica la imagen pasada y determina el tipo de paisaje.
 * @param {HTMLImageElement} imgElement - Elemento de imagen a analizar.
 * @returns {Promise<Object>} Objeto con las predicciones del modelo y la categoría de paisaje detectada.
 */
export async function classifyImage(imgElement) {
    const model = await loadModel(); // Asegura que el modelo está cargado
    const predictions = await model.classify(imgElement); // Obtiene las predicciones del modelo

    /**
     * Mapeo de categorías de paisajes a palabras clave que podrían aparecer en las predicciones.
     * Se compara la descripción de las predicciones con estos términos para clasificar la imagen.
     */
    const landscapeCategories = {
        "Playa": ["seashore", "coast", "seacoast", "sea-coast"],
        "Bosque": ["valley", "vale", "vault", "lakeside", "lakeshore"],
        "Desierto": ["sandbar", "sand bar", "conch"],
        "Montaña": ["alp"]
    };
    
    let detectedLandscape = null;
    // Recorre las categorías y compara con las predicciones del modelo
    for (const [category, keywords] of Object.entries(landscapeCategories)) {
        if (predictions.some(pred => 
            keywords.some(keyword => pred.className.toLowerCase().includes(keyword))
        )) {
            detectedLandscape = category; // Asigna la categoría detectada
            break; // Detiene la búsqueda si encuentra coincidencia
        }
    }
    
    return { predictions, detectedLandscape }; // Retorna las predicciones y el tipo de paisaje identificado
}
