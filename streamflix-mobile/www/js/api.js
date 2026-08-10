(function (global) {
  "use strict";

  /**
   * @param {string} endpoint 
   * @param {{ usuario: string, password: string }} body
   * @returns {Promise<{ status: number, data: object }>}
   */
  async function enviarPeticion(endpoint, body) {
    const url = `${AppConfig.URL_API}${endpoint}`;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), AppConfig.TIMEOUT_MS);

    try {
      const respuesta = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: controlador.signal,
      });

      let data;
      try {
        data = await respuesta.json();
      } catch {
        data = { ok: false, error: "Respuesta inválida del servidor." };
      }

      return { status: respuesta.status, data };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Tiempo de espera agotado. Verifica tu conexión.");
      }
      throw new Error(
        "No fue posible conectar con el servicio. Asegúrate de que la API esté en ejecución."
      );
    } finally {
      clearTimeout(temporizador);
    }
  }

  /**
   * Registra un nuevo usuario.
   * @param {string} usuario
   * @param {string} password
   */
  async function registrar(usuario, password) {
    return enviarPeticion("/registro", { usuario, password });
  }

  /**
   * Inicia sesión.
   * @param {string} usuario
   * @param {string} password
   */
  async function iniciarSesion(usuario, password) {
    return enviarPeticion("/login", { usuario, password });
  }

  global.AuthApi = {
    registrar,
    iniciarSesion,
  };
})(window);
