# API Gateway - Ropa Deportiva

Este proyecto representa el **API Gateway** del sistema distribuido de Ropa Deportiva. Su objetivo es actuar como punto de entrada único para los distintos microservicios (por ejemplo, `auth-service`, `producto-service`, etc.), facilitando el enrutamiento de peticiones, manejo de tokens y autenticación centralizada.

## Tecnologías utilizadas

- Node.js
- Express.js
- Axios
- JWT (JSON Web Tokens)
- Middleware personalizado para validación

## Estructura del proyecto

```
api-gateway/
├── config/            # Variables de entorno y configuración
├── middleware/        # Middlewares personalizados (auth, checkRole, etc.)
├── routes/            # Rutas por microservicio (usuario, producto, etc.)
├── app.js             # Configuración principal del servidor Express
└── ...
```

## Variables de entorno `.env`

A continuación se detallan las variables necesarias que debes configurar en un archivo `.env` en la raíz del proyecto:

```env
# App Configuration
APP_PORT=5000                   # Puerto donde corre el API Gateway
NODE_ENV=desarrollo             # Entorno de ejecución: desarrollo, producción
FRONTEND_URL=http://localhost:3002   # URL del frontend que consume el Gateway
USUARIO_SERVICE=http://localhost:3000  # URL base del servicio de usuarios (auth-service)

# JWT Configuration
SECRET_JWT_KEY=ejemplo123@ # Clave secreta para firmar tokens JWT
```

> Asegúrate de que el `USUARIO_SERVICE` apunte a la URL correcta donde corre el microservicio de autenticación (`auth-service`).

## 🔐 Seguridad

- Se utiliza autenticación por medio de **JWT**, firmados con la clave `SECRET_JWT_KEY`.
- Los middlewares `verifyToken` y `checkPermisosDesdeRoles` pueden ser usados para proteger rutas.

## 📦 Instalación

```bash
git clone https://github.com/Daniel-615/api-gateway
cd api-gateway
npm install
cp .env .env # luego editar con tus valores reales
npm run dev
```
