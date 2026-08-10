# Ambientes de desarrollo y pruebas – StreamFlix Mobile

## Backend (API)

| Variable                | Valor de ejemplo                          | Descripción                          |
|-------------------------|-------------------------------------------|--------------------------------------|
| SUPABASE_URL            | https://xxx.supabase.co                   | URL del proyecto Supabase            |
| SUPABASE_SERVICE_KEY    | sb_secret_...                             | Service role key (solo backend)      |
| PORT                    | 3000                                      | Puerto del servidor Express          |

Comando de arranque:
```bash
npm start   # o npm run dev
```

Health check: `GET http://localhost:3000/api/health`

## Frontend móvil (Capacitor)

| Ambiente                | URL base API                              | Notas                                |
|-------------------------|-------------------------------------------|--------------------------------------|
| Emulador Android        | http://10.0.2.2:3000/api/auth             | 10.0.2.2 = localhost del host        |
| Dispositivo físico      | http://<IP-local>:3000/api/auth           | Misma red Wi-Fi                      |
| Navegador / emulador.html | http://localhost:3000/api/auth          | Detectado automáticamente            |
| Producción              | https://api.streamflix.ejemplo.com/...    | Cambiar AMBIENTE en config.js        |

## Pruebas recomendadas

1. API health → 200
2. Registro válido → 201
3. Registro duplicado → 409
4. Login correcto → 200 + datos de usuario
5. Login incorrecto → 401
6. Validación de campos → 400
7. App móvil sin API → mensaje de error de conexión
8. Persistencia de sesión con localStorage
