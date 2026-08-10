const URL_BASE_API = "http://localhost:3000/api/auth";

const tabRegistro = document.getElementById("tab-registro");
const tabLogin = document.getElementById("tab-login");
const formRegistro = document.getElementById("form-registro");
const formLogin = document.getElementById("form-login");
const elementoMensaje = document.getElementById("mensaje");

/**
 * Muestra un mensaje al usuario en la región `aria-live`, con estilo de éxito o de error según corresponda.
 * @param {string} texto
 * @param {"exito"|"error"} tipo
 */
function mostrarMensaje(texto, tipo) {
  elementoMensaje.textContent = texto;
  elementoMensaje.className = `mensaje ${tipo}`;
}

/**
 * Alterna la pestaña activa y muestra el formulario correspondiente.
 * @param {"registro"|"login"} formularioAMostrar
 */
function cambiarFormulario(formularioAMostrar) {
  const esRegistro = formularioAMostrar === "registro";

  tabRegistro.classList.toggle("activa", esRegistro);
  tabLogin.classList.toggle("activa", !esRegistro);
  formRegistro.classList.toggle("oculto", !esRegistro);
  formLogin.classList.toggle("oculto", esRegistro);

  elementoMensaje.textContent = "";
  elementoMensaje.className = "mensaje";
}

tabRegistro.addEventListener("click", () => cambiarFormulario("registro"));
tabLogin.addEventListener("click", () => cambiarFormulario("login"));

/**
 * Envía una petición POST en formato JSON al endpoint indicado.
 * @param {string} endpoint
 * @param {{usuario: string, password: string}} body
 * @returns {Promise<{status: number, data: object}>}
 */
async function enviarPeticion(endpoint, body) {
  const respuesta = await fetch(`${URL_BASE_API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await respuesta.json();
  return { status: respuesta.status, data };
}

formRegistro.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const usuario = document.getElementById("registro-usuario").value;
  const password = document.getElementById("registro-password").value;
  const botonEnviar = formRegistro.querySelector("button[type='submit']");

  botonEnviar.disabled = true;
  try {
    const { data, status } = await enviarPeticion("/registro", { usuario, password });

    if (status === 201) {
      mostrarMensaje(data.mensaje, "exito");
      formRegistro.reset();
    } else {
      mostrarMensaje(data.error, "error");
    }
  } catch (error) {
    console.error("Error al registrar:", error);
    mostrarMensaje("No fue posible conectar con el servicio. Intenta más tarde.", "error");
  } finally {
    botonEnviar.disabled = false;
  }
});

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const usuario = document.getElementById("login-usuario").value;
  const password = document.getElementById("login-password").value;
  const botonEnviar = formLogin.querySelector("button[type='submit']");

  botonEnviar.disabled = true;
  try {
    const { data, status } = await enviarPeticion("/login", { usuario, password });

    if (status === 200) {
      mostrarMensaje(data.mensaje, "exito");
    } else {
      mostrarMensaje(data.error, "error");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    mostrarMensaje("No fue posible conectar con el servicio. Intenta más tarde.", "error");
  } finally {
    botonEnviar.disabled = false;
  }
});
