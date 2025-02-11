// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-aoCxcFhE2nDN8xtqOUXvJgPBStJ_-uY",
    authDomain: "autentificacion-email-pass.firebaseapp.com",
    projectId: "autentificacion-email-pass",
    storageBucket: "autentificacion-email-pass.firebasestorage.app",
    messagingSenderId: "56094586528",
    appId: "1:56094586528:web:e22bbc0b2c2c4ffcf73bc5",
    measurementId: "G-966J7BSHRB"
};

// Inicializar Firebase
let app;
let auth;

// Función para inicializar Firebase
export function inicializarFirebase() {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

// Función para iniciar sesión con Firebase
export async function iniciarSesion(correo, contrasena) {
    try {
        // Espera a que el inicio de sesión se complete
        await signInWithEmailAndPassword(auth, correo, contrasena);
        alert('Inicio de sesión exitoso');
        return true;  // Inicio de sesión exitoso
    } catch (error) {
        console.log('Error en el inicio de sesión: ' + error.message);
        return false;  // Error en el inicio de sesión
    }
}


// Función para registrar un nuevo usuario con Firebase
export function registrarUsuario(correo, contrasena) {
    if (!correo || !contrasena) {
        alert('Por favor, ingresa un correo y una contraseña para registrarte.');
        return;
    }

    createUserWithEmailAndPassword(auth, correo, contrasena)
        .then((userCredential) => {
            alert('Registro exitoso. Por favor, inicia sesión.');
            
        })
        .catch((error) => {
            alert('Error en el registro: ' + error.message);
        });
}

// Función para recuperar la contraseña del usuario
export function recuperarContrasena(correo) {
    if (!correo) {
        alert('Por favor, ingresa tu correo para recuperar la contraseña.');
        return;
    }

    return sendPasswordResetEmail(auth, correo)
        .then(() => {
            alert('Correo de recuperación enviado.');
        })
        .catch((error) => {
            alert('Error al enviar correo de recuperación: ' + error.message);
        });
}
