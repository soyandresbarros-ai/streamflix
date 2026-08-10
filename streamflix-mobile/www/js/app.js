/**
 * app.js
 * Punto de entrada / controlador de la aplicación móvil.
 * Orquesta eventos de UI y llamadas a la API.
 * Patrón: Controller (MVC ligero).
 */

(function () {
  "use strict";

  // --- Referencias ---
  const tabRegistro = UI.elementos.tabRegistro();
  const tabLogin = UI.elementos.tabLogin();
  const formRegistro = UI.elementos.formRegistro();
  const formLogin = UI.elementos.formLogin();
  const btnCerrarSesion = UI.elementos.btnCerrarSesion();

  // --- Eventos de pestañas ---
  tabRegistro.addEventListener("click", () => UI.cambiarFormulario("registro"));
  tabLogin.addEventListener("click", () => UI.cambiarFormulario("login"));

  // --- Toggle password visibility ---
  document.querySelectorAll(".btn-ojo").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      UI.togglePassword(target);
    });
  });

  // --- Registro ---
  formRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    UI.limpiarMensaje();

    const usuario = document.getElementById("registro-usuario").value.trim();
    const password = document.getElementById("registro-password").value;
    const boton = formRegistro.querySelector("button[type='submit']");

    if (!usuario || password.length < AppConfig.MIN_PASSWORD) {
      UI.mostrarMensaje(
        `Completa los campos. La contraseña debe tener al menos ${AppConfig.MIN_PASSWORD} caracteres.`,
        "error"
      );
      return;
    }

    UI.setCargando(boton, true);
    try {
      const { status, data } = await AuthApi.registrar(usuario, password);

      if (status === 201) {
        UI.mostrarMensaje(data.mensaje || "Usuario registrado exitosamente.", "exito");
        formRegistro.reset();
        // Opcional: cambiar a login después de registro exitoso
        setTimeout(() => UI.cambiarFormulario("login"), 1500);
      } else {
        UI.mostrarMensaje(data.error || "No se pudo completar el registro.", "error");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      UI.mostrarMensaje(error.message || "Error de conexión.", "error");
    } finally {
      UI.setCargando(boton, false);
    }
  });

  // --- Login ---
  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    UI.limpiarMensaje();

    const usuario = document.getElementById("login-usuario").value.trim();
    const password = document.getElementById("login-password").value;
    const boton = formLogin.querySelector("button[type='submit']");

    if (!usuario || !password) {
      UI.mostrarMensaje("Ingresa usuario y contraseña.", "error");
      return;
    }

    UI.setCargando(boton, true);
    try {
      const { status, data } = await AuthApi.iniciarSesion(usuario, password);

      if (status === 200) {
        const nombreUsuario = data.usuario || usuario;
        // Guardar sesión simple (localStorage)
        try {
          localStorage.setItem(
            "streamflix_sesion",
            JSON.stringify({ usuario: nombreUsuario, ts: Date.now() })
          );
        } catch (_) {
          /* ignore */
        }
        UI.mostrarExito(nombreUsuario);
      } else {
        UI.mostrarMensaje(data.error || "Error en la autenticación.", "error");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      UI.mostrarMensaje(error.message || "Error de conexión.", "error");
    } finally {
      UI.setCargando(boton, false);
    }
  });

  // --- Cerrar sesión ---
  btnCerrarSesion.addEventListener("click", () => {
    try {
      localStorage.removeItem("streamflix_sesion");
    } catch (_) {
      /* ignore */
    }
    UI.mostrarFormularios();
  });

  // --- Restaurar sesión si existe ---
  function intentarRestaurarSesion() {
    try {
      const raw = localStorage.getItem("streamflix_sesion");
      if (!raw) return;
      const sesion = JSON.parse(raw);
      if (sesion && sesion.usuario) {
        UI.mostrarExito(sesion.usuario);
      }
    } catch (_) {
      /* ignore */
    }
  }

  // --- Inicialización ---
  document.addEventListener("DOMContentLoaded", () => {
    console.log(
      `[StreamFlix] Ambiente: ${AppConfig.AMBIENTE} | API: ${AppConfig.URL_API}`
    );
    intentarRestaurarSesion();
  });
})();
