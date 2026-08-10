# StreamFlix Mobile – Autenticación (Capacitor + Android)

Aplicación móvil híbrida de autenticación para **StreamFlix**, desarrollada con **Capacitor** orientada a dispositivos **Android**.

Consume la API REST de autenticación (`streamflix-auth-api`) realizada previamente, que utiliza Supabase como base de datos.

---

## 1. Objetivo de la evidencia

Codificar los módulos del proyecto móvil con base en los requerimientos del sistema, orientados a dispositivos Android:

- Uso de Android Studio y SDK (vía Capacitor).
- Diagrama de paquetes / componentes / capas.
- Metodología de desarrollo.
- Mapa de navegación.
- Codificación por módulos reutilizables.
- Buenas prácticas de escritura de código.
- Patrones de diseño (MVC ligero, Service/Repository).
- Control de versiones (Git).
- Documentación de ambientes de desarrollo y pruebas.

---

## 2. Arquitectura de la aplicación

### Capas

| Capa              | Ubicación              | Responsabilidad                                      |
|-------------------|------------------------|------------------------------------------------------|
| Presentación      | `www/css`, `www/index.html`, `www/js/ui.js` | UI, estilos, feedback visual                        |
| Controlador       | `www/js/app.js`        | Orquestación de eventos y flujo de la aplicación     |
| Servicios / Datos | `www/js/api.js`        | Comunicación HTTP con la API REST                    |
| Configuración     | `www/js/config.js`     | URLs, constantes, detección de ambiente/plataforma   |

### Diagrama de paquetes (conceptual)

```
streamflix-mobile/
├── www/                    ← Web assets (capa presentación)
│   ├── css/
│   ├── js/
│   │   ├── config.js       ← Configuración
│   │   ├── api.js          ← Capa de servicios
│   │   ├── ui.js           ← Presentación (DOM)
│   │   └── app.js          ← Controlador
│   └── index.html
├── capacitor.config.json   ← Configuración Capacitor
├── package.json
└── android/                ← Proyecto nativo Android (generado)
```

### Diagrama de componentes

- **UI Module** → captura eventos de usuario (registro / login / cerrar sesión).
- **Controller (app.js)** → valida entrada básica y llama a AuthApi.
- **AuthApi** → realiza POST a `/api/auth/registro` y `/api/auth/login`.
- **API Backend** (streamflix-auth-api) → valida, hashea con bcrypt y consulta Supabase.
- **Supabase** → persistencia de usuarios.

### Mapa de navegación

```
[Pantalla Login / Registro]
        │
        ├── Tab "Registrarse" → Formulario registro → POST /registro
        │                           │
        │                           ├── Éxito → Mensaje + cambio a Login
        │                           └── Error  → Mensaje de error
        │
        └── Tab "Iniciar sesión" → Formulario login → POST /login
                                    │
                                    ├── Éxito → Pantalla de bienvenida
                                    └── Error  → Mensaje de error

[Pantalla Bienvenida]
        │
        └── "Cerrar sesión" → Vuelve a formularios + limpia localStorage
```

---

## 3. Requisitos previos

- Node.js 18+ y npm
- Android Studio (Arctic Fox o superior) + SDK Android
- Emulador Android o dispositivo físico con depuración USB
- API `streamflix-auth-api` corriendo en el puerto 3000

---

## 4. Instalación y configuración

### 4.1 Clonar / copiar el proyecto

```bash
cd streamflix-mobile
npm install
```

### 4.2 Añadir plataforma Android

```bash
npx cap add android
npx cap sync
```

### 4.3 Configurar URL de la API

Editar `www/js/config.js`:

- **Emulador Android**: `http://10.0.2.2:3000/api/auth` (10.0.2.2 = localhost del host).
- **Dispositivo físico**: usar la IP local de tu máquina (ej. `http://192.168.1.X:3000/api/auth`). Asegúrate de que el dispositivo y la PC estén en la misma red y que el firewall permita el puerto 3000.
- **Navegador (pruebas)**: se usa automáticamente `http://localhost:3000/api/auth`.

### 4.4 Ejecutar la API backend

En la carpeta de la API:

```bash
cd streamflix-auth-api
npm install
npm start          # escucha en http://localhost:3000
```

### 4.5 Abrir en Android Studio

```bash
npx cap open android
```

Desde Android Studio: Run ▶ sobre un emulador o dispositivo.

---

## 5. Ambientes de desarrollo y pruebas

| Ambiente      | URL API                                      | Cómo se detecta                          |
|---------------|----------------------------------------------|------------------------------------------|
| Desarrollo (Capacitor nativo) | `http://10.0.2.2:3000/api/auth`     | `Capacitor.isNativePlatform() === true` |
| Desarrollo (navegador)        | `http://localhost:3000/api/auth`    | Ejecución en browser                     |
| Producción                    | URL pública configurada             | Cambiar `AMBIENTE = "produccion"`       |

**Documentación de pruebas unitarias del backend**: ver carpeta `tests/` de la API (`npm test`).

**Pruebas de la app móvil**:

1. Registro de usuario nuevo → 201 + mensaje de éxito.
2. Registro de usuario duplicado → 409.
3. Login con credenciales correctas → 200 + pantalla de bienvenida.
4. Login incorrecto → 401.
5. Validación de contraseña corta → mensaje de error en cliente y en API.
6. Sin API en ejecución → mensaje de error de conexión.

---

## 6. Librerías y frameworks utilizados

### Capa de presentación (móvil)

- **Capacitor 6** – runtime híbrido (WebView + APIs nativas).
- **HTML5 + CSS3 + JavaScript (ES modules / IIFE)** – sin frameworks pesados para mantener el módulo ligero y educativo.
- **Fetch API** – comunicación HTTP.
- **localStorage** – persistencia simple de sesión.

### Backend (ya realizado)

- Express, @supabase/supabase-js, bcryptjs, cors, dotenv.

### Patrones aplicados

- **MVC ligero**: Model (API), View (HTML/CSS + ui.js), Controller (app.js).
- **Service / Repository**: AuthApi encapsula el acceso a la API.
- **Configuración centralizada**: AppConfig.
- **Separación de responsabilidades** por archivos/paquetes con nombres claros.

---

## 7. Buenas prácticas aplicadas

- Código modular y reutilizable (componentes de UI, servicio de API).
- Nombres de paquetes/archivos descriptivos (`api.js`, `ui.js`, `config.js`).
- Validación de entradas en cliente y servidor.
- Manejo de errores y timeouts.
- Accesibilidad básica (roles ARIA, aria-live).
- Mobile-first y safe-area insets.
- Sin secretos en el cliente (la API key de Supabase permanece solo en el backend).

---

## 8. Control de versiones

```bash
git init
git add .
git commit -m "feat: aplicación móvil StreamFlix Auth con Capacitor para Android"
```

Se recomienda un repositorio Git (GitHub, GitLab, etc.) y ramas por feature.

---

## 9. Estructura de archivos generados

```
streamflix-mobile/
├── capacitor.config.json
├── package.json
├── README.md
├── .gitignore
└── www/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── config.js
        ├── api.js
        ├── ui.js
        └── app.js
```

Después de `npx cap add android` se genera la carpeta `android/` con el proyecto nativo listo para Android Studio.

---

## 10. Autor

Andrés Barros – Evidencia AA5 EV02  
StreamFlix Dev
