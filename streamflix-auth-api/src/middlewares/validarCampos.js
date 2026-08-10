import { respuestaError } from "../utils/respuestas.js";

const LONGITUD_MINIMA_PASSWORD = 6;

export function validarCredenciales(req, res, next) {
  const { usuario, password } = req.body ?? {};

  if (!usuario || typeof usuario !== "string" || usuario.trim().length === 0) {
    return respuestaError(res, 400, "El campo 'usuario' es obligatorio.");
  }

  if (!password || typeof password !== "string") {
    return respuestaError(res, 400, "El campo 'password' es obligatorio.");
  }

  if (password.length < LONGITUD_MINIMA_PASSWORD) {
    return respuestaError(
      res,
      400,
      `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
    );
  }

  req.body.usuario = usuario.trim().toLowerCase();

  next();
}
