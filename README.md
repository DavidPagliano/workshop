
# Workshop

Aplicación web para gestionar inscripciones a eventos, pre-inscripciones al ciclo 2027 y registro de asistencia.

El proyecto está dividido en dos aplicaciones independientes:

- `api`: backend REST construido con Node.js, Express y MongoDB.
- `web`: frontend construido con React y Vite.

## Requisitos

Antes de comenzar, instalar:

- [Node.js](https://nodejs.org/) versión 18 o superior.
- npm, incluido con Node.js.
- MongoDB local o una URI de MongoDB Atlas.
- Git, opcional para clonar el repositorio.

Verificar las versiones instaladas:

```bash
node --version
npm --version
```

## Estructura del proyecto

```text
workshop/
├── api/
│   ├── src/
│   │   ├── config/          # Configuración y conexión a MongoDB
│   │   ├── controllers/     # Manejo de solicitudes HTTP
│   │   ├── middlewares/     # Middleware de validación
│   │   ├── models/          # Modelos de Mongoose
│   │   ├── routes/          # Rutas REST
│   │   ├── schemas/         # Esquemas de validación Zod
│   │   └── services/        # Lógica de negocio y acceso a datos
│   ├── .env                 # Configuración local, no versionar
│   └── package.json
├── web/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Cliente Axios y servicios de API
│   │   ├── mock/             # Datos de prueba del frontend
│   │   └── ...
│   └── package.json
└── README.md
```

## Instalación

Instalar las dependencias de cada aplicación por separado:

```bash
cd api
npm install

cd ../web
npm install
```

## Configuración de la API

En `api/`, crear un archivo llamado `.env` a partir de `.env.example`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/event_db
JWT_SECRET=una-clave-local
```

Para MongoDB Atlas, reemplazar `MONGODB_URI` por la cadena de conexión correspondiente. No publicar el archivo `.env` ni incluir credenciales reales en el repositorio.

La API utiliza el puerto `3000` por defecto y acepta peticiones CORS desde `http://localhost:5173`.

## Levantar el proyecto en desarrollo

Abrir dos terminales desde la carpeta raíz.

### Terminal 1: API

```bash
cd api
npm run dev
```

La API quedará disponible en:

- `http://localhost:3000`
- Documentación resumida de endpoints: `http://localhost:3000/`

### Terminal 2: aplicación web

```bash
cd web
npm run dev
```

Vite mostrará en la terminal la URL de la aplicación, normalmente `http://localhost:5173`.

## Scripts disponibles

### API

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el backend con Nodemon y reinicio automático. |
| `npm start` | Inicia el archivo compilado configurado en `build/index.js`. |
| `npm test` | Placeholder; todavía no hay pruebas automatizadas configuradas. |

### Web

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo con HMR. |
| `npm run build` | Genera la versión de producción en `web/dist`. |
| `npm run preview` | Sirve localmente la build de producción. |
| `npm run lint` | Ejecuta ESLint sobre el frontend. |

## Endpoints de la API

La API utiliza el prefijo `/workshop` y `registrarId` como identificador público de cada registro.

### Inscripciones a eventos

Base URL: `/workshop/event`

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/workshop/event` | Obtiene todas las inscripciones. |
| `GET` | `/workshop/event?dni=12345678` | Busca inscripciones por DNI. |
| `GET` | `/workshop/event/:registrarId` | Obtiene una inscripción específica. |
| `POST` | `/workshop/event` | Crea una inscripción. |
| `PUT` | `/workshop/event/:registrarId` | Actualiza una inscripción. |
| `PATCH` | `/workshop/event/:registrarId/registrado` | Actualiza `seRegistro`. |
| `DELETE` | `/workshop/event/:registrarId` | Elimina una inscripción. |

El cuerpo de `PATCH` debe tener esta forma:

```json
{
 "seRegistro": true
}
```

### Pre-inscripciones al ciclo

Base URL: `/workshop/cycle`

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/workshop/cycle` | Obtiene todas las pre-inscripciones. |
| `GET` | `/workshop/cycle/:registrarId` | Obtiene una pre-inscripción específica. |
| `POST` | `/workshop/cycle` | Crea una pre-inscripción. |
| `PUT` | `/workshop/cycle/:registrarId` | Actualiza una pre-inscripción. |
| `DELETE` | `/workshop/cycle/:registrarId` | Elimina una pre-inscripción. |

## Datos y convenciones

- `registrarId` es obligatorio y debe ser único.
- Los endpoints de edición, eliminación y asistencia reciben `registrarId`, por ejemplo `W-001` o `PC-001`.
- Los timestamps de MongoDB se exponen como `creado` y `actualizado`.
- Las fechas enviadas a la API pueden utilizar formato ISO, por ejemplo `2004-03-15T00:00:00Z`.
- Los archivos dentro de `web/src/mock/` son datos de prueba y se conservan para desarrollar el frontend sin depender de la API.

## Librerías principales

### Backend

| Librería | Uso |
| --- | --- |
| `express` | Servidor HTTP y definición de rutas REST. |
| `mongoose` | Modelado de datos y conexión con MongoDB. |
| `zod` | Validación de cuerpos de las solicitudes. |
| `cors` | Configuración de acceso entre frontend y backend. |
| `dotenv` | Carga de variables desde `.env`. |
| `morgan` | Dependencia prevista para logging HTTP. |
| `jsonwebtoken` | Soporte para tokens JWT. |
| `bcryptjs` | Hash de contraseñas. |
| `nodemon` | Reinicio automático durante el desarrollo. |

### Frontend

| Librería | Uso |
| --- | --- |
| `react` | Construcción de la interfaz mediante componentes. |
| `react-dom` | Renderizado de React en el navegador. |
| `vite` | Servidor de desarrollo y empaquetado de producción. |
| `axios` | Cliente HTTP para consumir la API. |
| `react-router-dom` | Navegación y rutas de la aplicación. |
| `@mui/material` | Componentes visuales basados en Material UI. |
| `@mui/icons-material` | Iconos para la interfaz. |
| `@emotion/react` | Motor de estilos utilizado por Material UI. |
| `@emotion/styled` | Creación de componentes estilizados. |
| `react-hot-toast` | Notificaciones visuales. |
| `jwt-decode` | Decodificación de payloads JWT en el cliente. |
| `eslint` | Análisis estático y reglas de calidad del código. |

## Flujo general

1. El usuario interactúa con la aplicación React.
2. Los servicios de `web/src/services/` realizan peticiones con Axios.
3. Express recibe la solicitud mediante las rutas de `api/src/routes/`.
4. Zod valida los datos de creación.
5. Los controladores delegan la lógica a los servicios.
6. Mongoose consulta o actualiza MongoDB.
7. La API devuelve la respuesta JSON al frontend.

## Estado actual

- La estructura base de API y frontend está preparada.
- Los servicios Axios están creados aunque algunas pantallas todavía utilizan mocks.
- La autenticación JWT está contemplada como dependencia, pero no forma parte todavía del flujo principal.
- Las pruebas automatizadas del backend aún están pendientes de agregar.
