/**
 * config.js
 * Capa de configuración de la aplicación móvil StreamFlix.
 * Centraliza URLs y constantes para facilitar cambios de ambiente.
 *
 * Ambientes:
 *  - Desarrollo (emulador Android): 10.0.2.2 apunta al localhost del host
 *  - Desarrollo (navegador / emulador web): localhost
 *  - Producción: URL del servidor desplegado
 */

const AMBIENTE = "desarrollo"; // "desarrollo" | "produccion"

const CONFIGURACION = {
  desarrollo: {
    // En emulador Android, 10.0.2.2 es el alias de localhost de la máquina host.
    // Si pruebas en navegador desktop usa http://localhost:3000
    API_BASE: "http://10.0.2.2:3000/api/auth",
    API_BASE_BROWSER: "http://localhost:3000/api/auth",
  },
  produccion: {
    API_BASE: "https://tu-api-produccion.ejemplo.com/api/auth",
    API_BASE_BROWSER: "https://tu-api-produccion.ejemplo.com/api/auth",
  },
};

/**
 * Detecta si se está ejecutando dentro de un WebView de Capacitor/Android.
 */
function esCapacitorNativo() {
  return (
    typeof window !== "undefined" &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform()
  );
}

/**
 * Obtiene la URL base de la API según el ambiente y la plataforma.
 */
function obtenerUrlApi() {
  const cfg = CONFIGURACION[AMBIENTE] || CONFIGURACION.desarrollo;
  if (esCapacitorNativo()) {
    return cfg.API_BASE;
  }
  return cfg.API_BASE_BROWSER;
}

const AppConfig = {
  AMBIENTE,
  URL_API: obtenerUrlApi(),
  MIN_PASSWORD: 6,
  TIMEOUT_MS: 15000,
};

// Congelar para evitar mutaciones accidentales
Object.freeze(AppConfig);
Object.freeze(CONFIGURACION);

window.AppConfig = AppConfig;
