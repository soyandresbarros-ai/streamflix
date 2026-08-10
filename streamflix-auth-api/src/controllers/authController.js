import bcrypt from "bcryptjs";
import { respuestaExitosa, respuestaError } from "../utils/respuestas.js";

const RONDAS_SAL_BCRYPT = 10;

/**
 * Crea los controladores de autenticación ligados a un cliente de Supabase específico.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export function crearAuthController(supabase) {
  async function registrar(req, res) {
    const { usuario, password } = req.body;

    try {
      const { data: existente, error: errorConsulta } = await supabase
        .from("usuarios")
        .select("id")
        .eq("usuario", usuario)
        .maybeSingle();

      if (errorConsulta) {
        console.error("Error consultando usuario existente:", errorConsulta);
        return respuestaError(res, 500, "Error interno al validar el usuario.");
      }

      if (existente) {
        return respuestaError(res, 409, "El usuario ya se encuentra registrado.");
      }

      const passwordHash = await bcrypt.hash(password, RONDAS_SAL_BCRYPT);

      const { error: errorInsercion } = await supabase
        .from("usuarios")
        .insert({ usuario, password: passwordHash });

      if (errorInsercion) {
        console.error("Error insertando usuario:", errorInsercion);
        return respuestaError(res, 500, "Error interno al registrar el usuario.");
      }

      return respuestaExitosa(res, 201, "Usuario registrado exitosamente.");
    } catch (error) {
      console.error("Error inesperado en registrar():", error);
      return respuestaError(res, 500, "Error interno del servidor.");
    }
  }
  async function iniciarSesion(req, res) {
    const { usuario, password } = req.body;

    try {
      const { data: usuarioEncontrado, error: errorConsulta } = await supabase
        .from("usuarios")
        .select("id, usuario, password")
        .eq("usuario", usuario)
        .maybeSingle();

      if (errorConsulta) {
        console.error("Error consultando usuario para login:", errorConsulta);
        return respuestaError(res, 500, "Error interno al validar las credenciales.");
      }
      if (!usuarioEncontrado) {
        return respuestaError(res, 401, "Error en la autenticación.");
      }

      const passwordValida = await bcrypt.compare(
        password,
        usuarioEncontrado.password
      );

      if (!passwordValida) {
        return respuestaError(res, 401, "Error en la autenticación.");
      }

      return respuestaExitosa(res, 200, "Autenticación satisfactoria.", {
        usuario: usuarioEncontrado.usuario,
      });
    } catch (error) {
      console.error("Error inesperado en iniciarSesion():", error);
      return respuestaError(res, 500, "Error interno del servidor.");
    }
  }

  return { registrar, iniciarSesion };
}
