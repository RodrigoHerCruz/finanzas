# Backend de Finanzas

## Estructura

- `src/config`: variables de entorno y conexión a MySQL.
- `src/controllers`: reglas de negocio y consultas a la base de datos.
- `src/routes`: definición de endpoints `/api`.
- `src/middlewares`: manejo centralizado de errores.
- `src/utils`: constantes y validaciones reutilizables.
- `src/app.js`: configuración de Express.
- `src/server.js`: punto de inicio del servidor.

## Configuración

1. Importa `bd.sql` en MySQL.
2. Copia `.env.example` a `.env` dentro de esta carpeta y ajusta las credenciales.
3. Desde la raíz del proyecto ejecuta `pnpm server`.

El servidor escucha en `http://localhost:3001` y expone sus rutas bajo `/api`.
