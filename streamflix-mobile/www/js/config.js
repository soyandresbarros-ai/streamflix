const AMBIENTE = "desarrollo"; 

const CONFIGURACION = {
  desarrollo: {
    API_BASE: "http://10.0.2.2:3000/api/auth",
    API_BASE_BROWSER: "http://localhost:3000/api/auth",
  },
  produccion: {
    API_BASE: "https://tu-api-produccion.ejemplo.com/api/auth",
    API_BASE_BROWSER: "https://tu-api-produccion.ejemplo.com/api/auth",
  },
};

function esCapacitorNativo() {
  return (
    typeof window !== "undefined" &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform()
  );
}

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

Object.freeze(AppConfig);
Object.freeze(CONFIGURACION);

window.AppConfig = AppConfig;
