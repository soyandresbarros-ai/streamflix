/**
 * src/utils/respuestas.js
 *
 * Funciones auxiliares para enviar respuestas HTTP con un formato
 * consistente en toda la API (estándar de codificación del proyecto:
 * evitar repetir la forma del JSON de respuesta en cada controlador).
 */

/**
 * Envía una respuesta exitosa.
 * @param {import('express').Response} res
 * @param {number} status Código HTTP (200, 201, etc).
 * @param {string} mensaje Mensaje descriptivo para el cliente.
 * @param {object} [datos] Información adicional opcional.
 */
export function respuestaExitosa(res, status, mensaje, datos = {}) {
  return res.status(status).json({ ok: true, mensaje, ...datos });
}

/**
 * Envía una respuesta de error.
 * @param {import('express').Response} res
 * @param {number} status Código HTTP (400, 401, 409, 500, etc).
 * @param {string} error Mensaje de error para el cliente.
 */
export function respuestaError(res, status, error) {
  return res.status(status).json({ ok: false, error });
}
