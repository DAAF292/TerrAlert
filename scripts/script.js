'use strict';
import * as domDinamico from './domDinamico.js';

$(document).ready(function() { inicio(); });

async function inicio() {
    // Dibuja la pantalla de login
    domDinamico.dibujarLogin();
}
