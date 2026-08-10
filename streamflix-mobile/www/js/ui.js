/**
 * ui.js
 * Capa de presentación - manipulación del DOM y feedback visual.
 * Responsabilidad única: actualizar la interfaz.
 */

(function (global) {
  "use strict";

  const elementos = {
    tabRegistro: () => document.getElementById("tab-registro"),
    tabLogin: () => document.getElementById("tab-login"),
    formRegistro: () => document.getElementById("form-registro"),
    formLogin: () => document.getElementById("form-login"),
    mensaje: () => document.getElementById("mensaje"),
    pantallaExito: () => document.getElementById("pantalla-exito"),
    textoBienvenida: () => document.getElementById("texto-bienvenida"),
    btnCerrarSesion: () => document.getElementById("btn-cerrar-sesion"),
  };

  /**
   * Muestra un mensaje de éxito o error.
   * @param {string} texto
   * @param {"exito"|"error"} tipo
   */
  function mostrarMensaje(texto, tipo) {
    const el = elementos.mensaje();
    el.textContent = texto;
    el.className = `mensaje ${tipo}`;
  }

  function limpiarMensaje() {
    const el = elementos.mensaje();
    el.textContent = "";
    el.className = "mensaje";
  }

  /**
   * Alterna entre formulario de registro y login.
   * @param {"registro"|"login"} formulario
   */
  function cambiarFormulario(formulario) {
    const esRegistro = formulario === "registro";
    elementos.tabRegistro().classList.toggle("activa", esRegistro);
    elementos.tabLogin().classList.toggle("activa", !esRegistro);
    elementos.tabRegistro().setAttribute("aria-selected", String(esRegistro));
    elementos.tabLogin().setAttribute("aria-selected", String(!esRegistro));
    elementos.formRegistro().classList.toggle("oculto", !esRegistro);
    elementos.formLogin().classList.toggle("oculto", esRegistro);
    limpiarMensaje();
  }

  /**
   * Activa/desactiva el estado de carga de un botón de envío.
   * @param {HTMLButtonElement} boton
   * @param {boolean} cargando
   */
  function setCargando(boton, cargando) {
    boton.disabled = cargando;
    const texto = boton.querySelector(".btn-texto");
    const spinner = boton.querySelector(".btn-spinner");
    if (texto) texto.classList.toggle("oculto", cargando);
    if (spinner) spinner.classList.toggle("oculto", !cargando);
  }

  /**
   * Muestra la pantalla de bienvenida post-login.
   * @param {string} usuario
   */
  function mostrarExito(usuario) {
    elementos.formRegistro().classList.add("oculto");
    elementos.formLogin().classList.add("oculto");
    document.querySelector(".pestanas").classList.add("oculto");
    elementos.pantallaExito().classList.remove("oculto");
    elementos.textoBienvenida().textContent = `Hola, ${usuario}. Has iniciado sesión correctamente.`;
    limpiarMensaje();
  }

  /**
   * Restaura la vista de formularios (cerrar sesión).
   */
  function mostrarFormularios() {
    elementos.pantallaExito().classList.add("oculto");
    document.querySelector(".pestanas").classList.remove("oculto");
    cambiarFormulario("login");
  }

  /**
   * Alterna visibilidad de contraseña.
   * @param {string} idInput
   */
  function togglePassword(idInput) {
    const input = document.getElementById(idInput);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
  }

  global.UI = {
    elementos,
    mostrarMensaje,
    limpiarMensaje,
    cambiarFormulario,
    setCargando,
    mostrarExito,
    mostrarFormularios,
    togglePassword,
  };
})(window);
