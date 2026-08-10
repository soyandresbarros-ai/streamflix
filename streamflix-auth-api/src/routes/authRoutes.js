import { Router } from "express";
import { crearAuthController } from "../controllers/authController.js";
import { validarCredenciales } from "../middlewares/validarCampos.js";

/**
 * Construye el router de autenticación, recibiendo el cliente de Supabase a usar.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export function crearAuthRoutes(supabase) {
  const router = Router();
  const { registrar, iniciarSesion } = crearAuthController(supabase);

  router.post("/registro", validarCredenciales, registrar);
  router.post("/login", validarCredenciales, iniciarSesion);

  return router;
}
