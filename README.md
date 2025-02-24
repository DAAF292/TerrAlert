# TerrAlert - Plataforma de Monitoreo para Zonas Afectadas por el Cambio Climático

## Descripción
TerrAlert es una aplicación web diseñada para proporcionar información climática y de cambio ambiental en tiempo real. Su objetivo principal es ayudar a organizaciones ambientales y usuarios interesados en el monitoreo de zonas afectadas por el cambio climático mediante el uso de mapas interactivos, reportes geolocalizados y análisis de datos meteorológicos.

## Características Principales
- **Mapa Interactivo:** Visualización geoespacial con datos climáticos obtenidos a través de Open Meteo.
- **Reportes con IA:** Subida y clasificación automática de imágenes mediante TensorFlow.js y MobileNet.
- **Datos Climáticos en Tiempo Real:** Información de temperatura, precipitaciones, viento y humedad.
- **Tabla Dinámica con DataTables:** Organización y filtrado de información climática de forma eficiente.
- **Noticias sobre Cambio Climático:** Gestor de noticias basado en un archivo JSON local.
- **Diseño Responsivo:** Interfaz optimizada para diferentes dispositivos.

### Acceso y Pruebas
- **Correo de prueba:** prueba@gmail.com
- **Contraseña de prueba:** 123456

## Funcionamiento
### Inormación Relevante
- **Geolocalización:** En dispositivos móviles, la geolocalización puede tardar un tiempo en obtenerse, especialmente si se está utilizando por primera vez. Este retraso es debido a la obtención de la ubicación precisa a través del navegador.
  
- **Cámara en Dispositivos Móviles:** Cuando se realiza un reporte desde un dispositivo móvil, la primera vez que se selecciona la opción de tomar una foto, la aplicación utiliza por defecto la cámara delantera (Cuestión de permisos de los dispositivos). Sin embargo, si se recarga la aplicación y el dispositivo tiene otra cámara disponible, se puede cambiar entre ellas mediante el Select que aparecerá.

- **Reportes en Tiempo de Ejecución:** Los reportes generados solo existen durante la sesión actual de la aplicación. Esto significa que una vez que se cierra la aplicación , los reportes anteriores se eliminan automáticamente puesto que no hay Base de Datos que almacene dicha información.

## Tecnologías Utilizadas
- **Frontend:** HTML, CSS, JavaScript, DataTables, Leaflet.js.
- **Inteligencia Artificial:** TensorFlow.js, MobileNet.
- **APIs:** Open Meteo.
- **Alojamiento:** GitHub Pages.

## Instalación y Configuración
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/TerrAlert.git
   ```
## Uso
1. **Acceder a la plataforma desde el navegador.**
   -Bien ejecuntando la aplicación de forma local o a través del enlace de GitHub Pages: **https://daaf292.github.io/TerrAlert/**
3. **Consultar información climática por localización.**
4. **Subir reportes con fotos y categorizar los paisajes automáticamente con IA.**
5. **Visualizar tendencias climáticas y reportes previos en DataTables.**
6. **Explorar noticias relevantes sobre el cambio climático.**

## Contribución
Si deseas contribuir a TerrAlert:
1. **Haz un fork del repositorio.**
2. **Crea una nueva rama para tu funcionalidad o corrección.**
3. **Realiza un pull request con una descripción clara de los cambios.**

## Licencia
Este proyecto está bajo la licencia MIT. Puedes usarlo y modificarlo libremente bajo los términos de esta licencia.

## Contacto
Para dudas o sugerencias, puedes abrir un issue en GitHub o contactar a través del repositorio oficial.

---
**TerrAlert - Monitoreo y Conciencia para un Mundo Mejor.**

