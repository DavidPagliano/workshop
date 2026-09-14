# Backend - Event Registration API 🚀

API REST del proyecto Workshop 2026. Permite administrar las inscripciones al evento, las pre-inscripciones al ciclo 2027, los usuarios internos y el historial de auditoría. Está construida con Node.js, Express y MongoDB, siguiendo una separación por rutas, controladores, servicios y modelos.

## Tecnologías

- Node.js y Express 5
- MongoDB con Mongoose
- Zod para validar y sanear los cuerpos de las solicitudes
- JWT y bcryptjs para autenticación y contraseñas
- Helmet, CORS y `express-rate-limit` para protección básica de la API
- Dotenv para configuración mediante variables de entorno

## Estructura

```text
api/
├── src/
│   ├── config/           # Configuración, conexión y diagnóstico de MongoDB
│   ├── controllers/      # Manejo de solicitudes y respuestas HTTP
│   ├── middlewares/      # Validación, autenticación y autorización por rol
│   ├── models/           # Modelos Mongoose: evento, pre-ciclo, usuarios y auditoría
│   ├── routes/           # Rutas REST
│   ├── schemas/          # Esquemas Zod
│   ├── services/         # Lógica de negocio y acceso a datos
│   └── utils/            # Registro de acciones de auditoría
├── package.json
└── README.md
```

## Configuración y ejecución

Crear `api/.env` con, como mínimo, las siguientes variables:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/event_db
JWT_SECRET=una-clave-local-segura
```

`MONGODB_URI` y `JWT_SECRET` son obligatorias. No versionar `.env` ni utilizar secretos reales en la demo.

Desde la carpeta `api`:

```bash
npm install
npm run dev
```

La API queda disponible en `http://localhost:3000`. En desarrollo, `GET /` devuelve un resumen de los endpoints. Al iniciar, se conecta a MongoDB, inicializa las colecciones esperadas y muestra en consola su cantidad de registros.

### Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia `src/index.js` con Nodemon. |
| `npm start` | Intenta iniciar `build/index.js`; requiere que exista previamente ese build. |
| `npm test` | Aún no hay pruebas automatizadas configuradas. |

## Funcionalidades agregadas

### Inscripciones al evento

- Alta pública de participantes.
- Generación server-side de `registrarId` (`W-001`, `W-002`, etc.).
- Prevención de registros duplicados por DNI.
- Consulta general, búsqueda por DNI y consulta individual.
- Edición, eliminación y marcado/desmarcado de asistencia.
- Validación de datos con Zod y respuestas de error consistentes.

### Pre-inscripciones al ciclo 2027

- Alta pública de aspirantes.
- Generación server-side de `registrarId` (`pcr-001`, `pcr-002`, etc.).
- Prevención de más de una pre-inscripción por DNI.
- Consulta general, consulta individual, edición y eliminación.

### Autenticación y usuarios

- Inicio de sesión con JWT con vencimiento de dos horas.
- Contraseñas almacenadas con hash mediante bcryptjs.
- Creación pública del primer usuario como administrador.
- Registro público posterior como `staff_registracion`, sujeto a activación.
- Creación de usuarios por administradores con rol explícito.
- Listado, activación/desactivación y eliminación de usuarios para administradores.
- Roles disponibles: `admin`, `staff_registracion`, `staff_bedele` y `director`.

### Auditoría y protección de la API

- Registro de acciones de altas, modificaciones, eliminaciones, asistencias y cambios de usuarios.
- Registro de navegación desde el frontend mediante `POST /workshop/audit/log`.
- Consulta paginada y con búsqueda del historial para administradores.
- `Helmet`, CORS configurable y límite global de 200 solicitudes cada 15 minutos por IP.
- Límites específicos para login, registro de usuarios y creación de logs.
- Límite de 25 KB para cuerpos JSON y manejo de errores de duplicados y payloads demasiado grandes.

## Endpoints

Todas las rutas utilizan el prefijo `/workshop`.

### Autenticación: `/workshop/auth`

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/login` | Público | Inicia sesión y devuelve un JWT. |
| `POST` | `/register` | Público | Solicita el registro de un usuario. |
| `POST` | `/admin/create-user` | `admin` | Crea un usuario con rol definido. |
| `GET` | `/users` | `admin` | Lista usuarios sin exponer contraseñas. |
| `PATCH` | `/users/:id/status` | `admin` | Activa o desactiva un usuario. |
| `DELETE` | `/users/:id` | `admin` | Elimina un usuario. |

Para las rutas protegidas enviar `Authorization: Bearer <token>`.

### Inscripciones al evento: `/workshop/event`

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/` | Lista inscripciones; admite `?dni=...`. |
| `GET` | `/:registrarId` | Obtiene una inscripción. |
| `POST` | `/` | Crea una inscripción. |
| `PUT` | `/:registrarId` | Actualiza una inscripción. |
| `PATCH` | `/:registrarId/registrado` | Actualiza `seRegistro`. |
| `DELETE` | `/:registrarId` | Elimina una inscripción. |

Ejemplo de cuerpo para asistencia:

```json
{ "seRegistro": true }
```

### Pre-inscripciones: `/workshop/cycle`

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/` | Lista pre-inscripciones. |
| `GET` | `/:registrarId` | Obtiene una pre-inscripción. |
| `POST` | `/` | Crea una pre-inscripción. |
| `PUT` | `/:registrarId` | Actualiza una pre-inscripción. |
| `DELETE` | `/:registrarId` | Elimina una pre-inscripción. |

### Auditoría: `/workshop/audit`

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/log` | Público o autenticado | Registra navegación o acciones del frontend. |
| `GET` | `/` | `admin` | Consulta el historial; admite `?page=1&limit=10&search=...`. |

## Pendiente para después de la demo

- Revisar y aplicar autenticación y roles a las operaciones de gestión de `/event` y `/cycle`; actualmente sus rutas CRUD no exigen JWT.
- Preparar el flujo de producción: build real para `npm start`, variables de entorno separadas, despliegue y monitoreo.
- Revisar el manejo de errores y respuestas para unificar códigos y mensajes en todos los controladores.
- Evaluar paginación, filtros e índices adicionales cuando aumente el volumen de inscripciones.
- Revisar la generación secuencial de `registrarId` para evitar colisiones ante altas concurrentes.
- Eliminar o integrar dependencias y código no utilizados, como el logging HTTP de Morgan si finalmente no se incorpora.

## Flujo de una solicitud

1. Express recibe la petición y aplica CORS, Helmet, rate limiting y el límite de tamaño.
2. La ruta ejecuta la autenticación/autorización correspondiente y valida el cuerpo con Zod.
3. El controlador delega la operación al servicio.
4. El servicio consulta o actualiza MongoDB mediante Mongoose.
5. La acción relevante se registra en la colección `audits`.
6. La API devuelve la respuesta JSON al frontend.
