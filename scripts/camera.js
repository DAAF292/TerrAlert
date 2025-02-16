// camera.js
'use strict';

// Variable global para almacenar el stream actual de la cámara
let currentStream = null;

/**
 * Verifica si hay dispositivos de cámara disponibles.
 * @returns {Promise<boolean>} Devuelve true si hay al menos una cámara disponible, de lo contrario false.
 */
export async function checkCameraAvailability() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices(); // Obtiene todos los dispositivos multimedia
        const cameras = devices.filter(device => device.kind === 'videoinput'); // Filtra solo los dispositivos de video
        return cameras.length > 0; // Retorna true si hay al menos una cámara disponible
    } catch (e) {
        console.error(e);
        return false; // En caso de error, retorna false
    }
}

/**
 * Inicia la cámara en el elemento video proporcionado.
 * Si hay más de una cámara disponible, muestra una interfaz para seleccionar una.
 * @param {HTMLVideoElement} videoElement - Elemento HTML donde se mostrará el video.
 * @param {HTMLElement} container – Contenedor donde se insertará el selector de cámaras (opcional).
 */
export async function startCamera(videoElement, container) {
    const devices = await navigator.mediaDevices.enumerateDevices(); // Obtiene todos los dispositivos multimedia
    const cameras = devices.filter(device => device.kind === 'videoinput'); // Filtra solo cámaras
    let selectedDeviceId;

    if (cameras.length > 1) {
        // Crear interfaz de selección de cámara si hay más de una disponible
        const selectionDiv = document.createElement('div');
        selectionDiv.id = 'cameraSelection';
        selectionDiv.style.marginTop = '10px';
        selectionDiv.innerHTML = '<label for="cameraSelect">Selecciona la cámara:</label>';
        
        const select = document.createElement('select');
        select.id = 'cameraSelect';
        
        cameras.forEach((camera, index) => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.textContent = camera.label || `Cámara ${index + 1}`;
            select.appendChild(option);
        });
        
        selectionDiv.appendChild(select);
        
        const selectButton = document.createElement('button');
        selectButton.textContent = 'Iniciar Cámara';
        selectionDiv.appendChild(selectButton);
        
        if (container) {
            container.appendChild(selectionDiv);
        }
        
        // Espera a que el usuario seleccione una cámara y presione el botón
        await new Promise(resolve => {
            selectButton.addEventListener('click', async () => {
                selectedDeviceId = select.value;
                selectionDiv.remove(); // Elimina la interfaz de selección tras elegir la cámara
                currentStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } });
                videoElement.srcObject = currentStream;
                resolve();
            });
        });
    } else if (cameras.length === 1) {
        // Si solo hay una cámara, la usa directamente
        selectedDeviceId = cameras[0].deviceId;
        currentStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } });
        videoElement.srcObject = currentStream;
    }
}

/**
 * Detiene el stream de la cámara liberando los recursos.
 */
export function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop()); // Detiene todos los tracks de video
        currentStream = null; // Restablece la variable global
    }
}

/**
 * Captura una imagen del video en reproducción y la retorna en formato base64 (dataURL).
 * @param {HTMLVideoElement} videoElement - Elemento HTMLVideoElement de donde se capturará la imagen.
 * @returns {string} La imagen capturada en formato dataURL (base64).
 */
export function captureImage(videoElement) {
    const canvas = document.createElement('canvas'); // Crea un elemento canvas temporal
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height); // Dibuja el fotograma del video en el canvas
    return canvas.toDataURL('image/png'); // Retorna la imagen en formato base64
}
