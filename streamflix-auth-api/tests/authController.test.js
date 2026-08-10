import test from "node:test";
import assert from "node:assert/strict";
import { crearAuthController } from "../src/controllers/authController.js";
import bcrypt from "bcryptjs";

function crearSupabaseFalso(usuariosIniciales = []) {
  const usuarios = [...usuariosIniciales];

  return {
    from(tabla) {
      if (tabla !== "usuarios") {
        throw new Error(`Tabla no soportada en el mock: ${tabla}`);
      }

      return {
        select() {
          return {
            eq(campo, valor) {
              return {
                async maybeSingle() {
                  const encontrado = usuarios.find((u) => u[campo] === valor);
                  return { data: encontrado ?? null, error: null };
                },
              };
            },
          };
        },
        async insert(registro) {
          usuarios.push({ id: String(usuarios.length + 1), ...registro });
          return { error: null };
        },
      };
    },
    _usuarios: usuarios,
  };
}

function crearReqRes(body) {
  const res = {
    statusCode: null,
    payload: null,
    status(codigo) {
      this.statusCode = codigo;
      return this;
    },
    json(datos) {
      this.payload = datos;
      return this;
    },
  };
  return { req: { body }, res };
}

test("registrar() crea un usuario nuevo y devuelve 201", async () => {
  const supabaseFalso = crearSupabaseFalso();
  const { registrar } = crearAuthController(supabaseFalso);
  const { req, res } = crearReqRes({ usuario: "ana", password: "clave123" });

  await registrar(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.ok, true);
  assert.match(res.payload.mensaje, /registrado exitosamente/i);
  assert.equal(supabaseFalso._usuarios.length, 1);
  assert.notEqual(supabaseFalso._usuarios[0].password, "clave123");
});

test("registrar() rechaza un usuario duplicado con 409", async () => {
  const passwordHash = await bcrypt.hash("clave123", 4);
  const supabaseFalso = crearSupabaseFalso([{ id: "1", usuario: "ana", password: passwordHash }]);
  const { registrar } = crearAuthController(supabaseFalso);
  const { req, res } = crearReqRes({ usuario: "ana", password: "otraClave" });

  await registrar(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(res.payload.ok, false);
  assert.match(res.payload.error, /ya se encuentra registrado/i);
});

test("iniciarSesion() responde 'Autenticación satisfactoria' con credenciales correctas", async () => {
  const passwordHash = await bcrypt.hash("clave123", 4);
  const supabaseFalso = crearSupabaseFalso([{ id: "1", usuario: "ana", password: passwordHash }]);
  const { iniciarSesion } = crearAuthController(supabaseFalso);
  const { req, res } = crearReqRes({ usuario: "ana", password: "clave123" });

  await iniciarSesion(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.ok, true);
  assert.equal(res.payload.mensaje, "Autenticación satisfactoria.");
});

test("iniciarSesion() responde error de autenticación con contraseña incorrecta", async () => {
  const passwordHash = await bcrypt.hash("clave123", 4);
  const supabaseFalso = crearSupabaseFalso([{ id: "1", usuario: "ana", password: passwordHash }]);
  const { iniciarSesion } = crearAuthController(supabaseFalso);
  const { req, res } = crearReqRes({ usuario: "ana", password: "claveIncorrecta" });

  await iniciarSesion(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.payload.ok, false);
  assert.equal(res.payload.error, "Error en la autenticación.");
});

test("iniciarSesion() responde error de autenticación si el usuario no existe", async () => {
  const supabaseFalso = crearSupabaseFalso([]);
  const { iniciarSesion } = crearAuthController(supabaseFalso);
  const { req, res } = crearReqRes({ usuario: "usuarioinexistente", password: "clave123" });

  await iniciarSesion(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.payload.error, "Error en la autenticación.");
});
