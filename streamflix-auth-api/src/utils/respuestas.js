/**
 * @param {import('express').Response} res
 * @param {number} status 
 * @param {string} mensaje 
 * @param {object} [datos] 
 */
export function respuestaExitosa(res, status, mensaje, datos = {}) {
  return res.status(status).json({ ok: true, mensaje, ...datos });
}

/**
 * @param {import('express').Response} res
 * @param {number} status 
 * @param {string} error 
 */
export function respuestaError(res, status, error) {
  return res.status(status).json({ ok: false, error });
}
