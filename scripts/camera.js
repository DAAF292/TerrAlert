// camera.js
'use strict';

let currentStream = null;

/**
 * Verifica si hay dispositivos de cámara disponibles.
 * @returns {Promise<boolean>}
 */
export async function checkCameraAvailability() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        return cameras.length > 0;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Inicia la cámara en el elemento video proporcionado.
 * Si hay más de una cámara, crea una interfaz para seleccionar.
 * @param {HTMLVideoElement} videoElement 
 * @param {HTMLElement} container – contenedor donde se insertará el selector (opcional)
 */
export async function startCamera(videoElement, container) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    let selectedDeviceId;
    if (cameras.length > 1) {
        // Crear interfaz para seleccionar la cámara
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
        await new Promise(resolve => {
            selectButton.addEventListener('click', async () => {
                selectedDeviceId = select.value;
                selectionDiv.remove();
                currentStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } });
                videoElement.srcObject = currentStream;
                resolve();
            });
        });
    } else if (cameras.length === 1) {
        selectedDeviceId = cameras[0].deviceId;
        currentStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } });
        videoElement.srcObject = currentStream;
    }
}

/**
 * Detiene el stream de la cámara.
 */
export function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

/**
 * Captura una imagen del elemento video y retorna la imagen en formato dataURL.
 * @param {HTMLVideoElement} videoElement 
 * @returns {string} dataURL de la imagen capturada.
 */
export function captureImage(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}
