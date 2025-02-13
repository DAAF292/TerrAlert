'use strict';

// Accedemos a las librerías globales ya cargadas en el HTML
const tf = window.tf;
const mobilenet = window.mobilenet;

let model = null;

/**
 * Carga el modelo MobileNet si no está cargado.
 * @returns {Promise<any>} El modelo cargado.
 */
export async function loadModel() {
    if (!model) {
        model = await mobilenet.load();
    }
    return model;
}

/**
 * Clasifica la imagen pasada y determina el tipo de paisaje.
 * @param {HTMLImageElement} imgElement 
 * @returns {Promise<Object>} Objeto con las predicciones y, si es posible, el paisaje detectado.
 */
export async function classifyImage(imgElement) {
    const model = await loadModel();
    const predictions = await model.classify(imgElement);
    const landscapeCategories = {
        "Playa": ["seashore", "coast", "seacoast", "sea-coast"],
        "Bosque": ["valley", "vale", "vault", "lakeside", "lakeshore"],
        "Desierto": ["sandbar", "sand bar", "conch"],
        "Montaña": ["alp"]
    };
    let detectedLandscape = null;
    for (const [category, keywords] of Object.entries(landscapeCategories)) {
        if (predictions.some(pred => 
            keywords.some(keyword => pred.className.toLowerCase().includes(keyword))
        )) {
            detectedLandscape = category;
            break;
        }
    }
    return { predictions, detectedLandscape };
}
