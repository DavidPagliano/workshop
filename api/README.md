# API — Workshop Backend

API REST construida con **Express 5** y **MongoDB (Mongoose 9)** que gestiona las inscripciones al evento Multimedia Day 2026, las pre-inscripciones al ciclo lectivo TSM 2027, la autenticación con JWT y un sistema de auditoría.

## Ejecución

```bash
npm install
npm run dev      # Desarrollo con nodemon (hot-reload)
npm start        # Producción
```

## Variables de entorno

Archivo `.env` en la raíz de `/api`:

```env
MONGODB_URI=mongodb://localhost:27017/workshop   # Obligatoria
JWT_SECRET=tu_clave_secreta                       # Obligatoria
PORT=3000                                         # Opcional (default: 3000)
NODE_ENV=development                              # Opcional (default: development)
FRONTEND_URL=http://localhost:5173                # Opcional — URL del frontend en dev
FRONTEND_PREVIEW_URL=https://localhost:4173       # Opcional — URL del frontend en preview
```

> El archivo `config/config.js` centraliza la lectura de todas las variables de entorno y valida que las obligatorias (`MONGODB_URI`, `JWT_SECRET`) existan antes de arrancar.

## Estructura de carpetas

```
api/src/
├── config/
│   ├── config.js         ← Lectura y validación de env vars
│   └── db.js             ← Conexión a MongoDB + inicialización de colecciones
├── controllers/          ← Lógica de manejo de request/response
├── middlewares/          ← Funciones intermedias (auth, roles, validación)
├── models/               ← Schemas de Mongoose (estructura de datos)
├── routes/               ← Definición de endpoints y encadenamiento de middlewares
├── schemas/              ← Schemas de validación con Zod
├── services/             ← Lógica de negocio (separada del controller)
└── index.js              ← Entry point: carga middlewares, rutas y arranca el server
```

## Principios de arquitectura

### Separación en capas (Controller → Service → Model)

La API sigue un patrón de tres capas para separar responsabilidades:

- **Routes** — Solo definen qué middlewares y controller se ejecutan para cada endpoint. No contienen lógica.
- **Controllers** — Reciben `req/res`, extraen los datos y llaman al Service correspondiente. Formatean la respuesta HTTP.
- **Services** — Contienen la lógica de negocio pura (queries a MongoDB, validaciones de reglas, generación de IDs). No conocen `req/res`.
- **Models** — Definen la estructura de los documentos en MongoDB con Mongoose. No contienen lógica de negocio.

Esto permite testear cada capa de forma independiente y reutilizar la lógica de negocio.

### Validación con Zod (schemas/)

Los schemas de Zod se ejecutan **antes** de que la petición llegue al controller (mediante el middleware `validateRequest`). Si los datos no cumplen el schema, se devuelve un 400 con los errores detallados. Esto garantiza que el controller siempre recibe datos válidos.

### Middlewares encadenados

Cada ruta encadena middlewares en orden:

```
Rate Limit → Auth (JWT) → Autorización (roles) → Validación (Zod) → Controller
```

---

## Detalle de cada capa

### `config/config.js`

Centraliza **todas** las variables de entorno en un solo objeto exportable. Valida al arrancar que las obligatorias existan; si faltan, imprime un error y hace `process.exit(1)`.

### `config/db.js`

Se conecta a MongoDB y ejecuta una **inicialización automática**:

1. Lista las colecciones existentes en la base.
2. Compara contra las 5 colecciones esperadas (`eventregistrations`, `precycleregistrations`, `users`, `audits`, `counters`).
3. Crea las que falten ejecutando `Model.init()` (que también crea los índices).
4. Imprime un `console.table` con el estado de cada colección (existe/vacía/con datos/cantidad de registros) para diagnóstico visual al arrancar.

### `models/` — Modelos de datos

| Modelo | Colección | Propósito |
| -------- | ----------- | ----------- |
| `EventRegistration` | `eventregistrations` | Inscriptos al evento. Campos: nombre, apellido, DNI (único + índice), email, teléfono, tema elegido (enum), `seRegistro` (asistencia). |
| `PreCycleRegistration` | `precycleregistrations` | Aspirantes al ciclo 2027. Campos: datos personales, edad, fecha de nacimiento, título secundario (si/no/incompleto), foto (base64), datos de iglesia opcionales. |
| `User` | `users` | Usuarios del sistema con roles. Password hasheado con bcrypt en un hook `pre('save')`. Método `comparePassword` para login. |
| `Audit` | `audits` | Log de auditoría: acción, página, detalles, dispositivo, IP, userId (opcional). |
| `Counter` | `counters` | Secuencias auto-incrementales para generar IDs legibles (ej: `evt-001`, `pcr-001`). |

Todos los modelos usan `timestamps` renombrados a español (`creado`, `actualizado`) y deshabilitan `versionKey` (__v).

### `middlewares/`

| Middleware | Archivo | Función |
| ------------ | --------- | --------- |
| **authMiddleware** | `authMiddleware.js` | Extrae el token JWT del header `Authorization: Bearer <token>`, lo verifica con `jwt.verify()` y adjunta `req.user = { id, username, role }`. Devuelve 401 si no hay token, 403 si es inválido. |
| **roleMiddleware** | `roleMiddleware.js` | Recibe una lista de roles permitidos. Compara `req.user.role` contra esa lista. Devuelve 403 si el rol no está autorizado. |
| **validateRequest** | `validateRequest.js` | Recibe un schema Zod, ejecuta `schema.parse(req.body)` y reemplaza `req.body` con los datos parseados (limpios). Si falla, devuelve 400 con array de errores `{ field, message }`. |

### `schemas/` — Validación Zod

| Schema | Archivo | Valida |
| -------- | --------- | -------- |
| `loginSchema` | `auth.schema.js` | Login: username + password |
| `registerUserSchema` | `auth.schema.js` | Creación de usuario por admin: username, email, password, role |
| `publicRegisterSchema` | `auth.schema.js` | Registro público: username, email, password |
| `eventSchema` | `registration.schema.js` | Inscripción al evento: nombre, apellido, DNI, email, teléfono, tema |
| `eventUpdateSchema` | `registration.schema.js` | Actualización parcial de inscripción al evento |
| `preCycleSchema` | `registration.schema.js` | Pre-inscripción al ciclo: todos los campos del aspirante |
| `preCycleUpdateSchema` | `registration.schema.js` | Actualización parcial de pre-inscripción |
| `auditLogSchema` | `audit.schema.js` | Log de auditoría: acción (obligatoria), página, detalles |

### `services/` — Lógica de negocio

| Servicio | Archivo | Responsabilidades |
| ---------- | --------- | ------------------- |
| **auth** | `auth.services.js` | Login (compara password, genera JWT), registro (verifica duplicados, crea usuario), listado de usuarios, cambio de estado (activo/inactivo), reset de password, eliminación, importación masiva desde Excel. |
| **event** | `event.services.js` | CRUD de inscripciones al evento. Genera `registrarId` auto-incremental con el modelo Counter (formato `evt-XXX`). Búsqueda por DNI. Marca de asistencia (toggle `seRegistro`). |
| **preCycle** | `preCycle.services.js` | CRUD de pre-inscripciones al ciclo. Genera `registrarId` auto-incremental (formato `pcr-XXX`). |

### `controllers/`

| Controller | Archivo | Endpoints que maneja |
| ------------ | --------- | --------------------- |
| **auth** | `auth.controller.js` | `login`, `register`, `listUsers`, `updateUserStatus`, `resetPassword`, `deleteUser`, `importUsers` |
| **eventRegistration** | `eventRegistration.controller.js` | `createEventRegistration`, `getAllEventRegistrations`, `getEventRegistrationByRegistrarId`, `updateEventRegistration`, `deleteEventRegistration`, `markAttendance` |
| **preCycleRegistration** | `preCycleRegistration.controller.js` | `registerAspirant`, `getAllAspirants`, `getAspirantByRegistrarId`, `updateAspirant`, `deleteAspirant` |
| **audit** | `audit.controller.js` | `createAuditLog`, `getAuditHistory` |

---

## Rutas (endpoints)

### `/workshop/auth` — Autenticación y usuarios

| Método | Ruta | Auth | Roles | Descripción |
| -------- | ------ | ------ | ------- | ------------- |
| `POST` | `/login` | ✗ | — | Inicia sesión. Rate limit: 10 intentos / 15 min. |
| `POST` | `/register` | ✗ | — | Registro público. Rate limit: 5 / hora. |
| `POST` | `/admin/create-user` | ✓ | `admin` | Crea usuario con rol específico. |
| `GET` | `/users` | ✓ | `admin` | Lista todos los usuarios. |
| `PATCH` | `/users/:id/status` | ✓ | `admin` | Activa/desactiva usuario. |
| `PATCH` | `/users/:id/reset-password` | ✓ | `admin` | Resetea contraseña. |
| `DELETE` | `/users/:id` | ✓ | `admin` | Elimina usuario. |
| `POST` | `/admin/import-users` | ✓ | `admin` | Importa usuarios desde archivo Excel (.xlsx). Multer en memoria, máx 5MB. |

### `/workshop/event` — Inscripciones al evento

| Método | Ruta | Auth | Roles | Descripción |
| -------- | ------ | ------ | ------- | ------------- |
| `POST` | `/` | ✗ | — | Inscripción pública al evento. |
| `GET` | `/` | ✓ | `admin`, `director`, `staff_registracion` | Lista todos los inscriptos. Acepta `?dni=` para búsqueda. |
| `GET` | `/:registrarId` | ✓ | `admin`, `director`, `staff_registracion` | Obtiene un inscripto por su ID. |
| `PUT` | `/:registrarId` | ✓ | `admin`, `director` | Actualiza datos de inscripción. |
| `PATCH` | `/:registrarId/registrado` | ✓ | `admin`, `director`, `staff_registracion` | Marca asistencia (toggle). |
| `DELETE` | `/:registrarId` | ✓ | `admin` | Elimina inscripción. |

### `/workshop/cycle` — Pre-inscripciones al ciclo 2027

| Método | Ruta | Auth | Roles | Descripción |
| -------- | ------ | ------ | ------- | ------------- |
| `POST` | `/` | ✗ | — | Pre-inscripción pública de aspirante. |
| `GET` | `/` | ✓ | `admin`, `director`, `staff_bedele` | Lista todos los aspirantes. |
| `GET` | `/:registrarId` | ✓ | `admin`, `director`, `staff_bedele` | Obtiene un aspirante por ID. |
| `PUT` | `/:registrarId` | ✓ | `admin`, `director`, `staff_bedele` | Actualiza datos del aspirante. |
| `DELETE` | `/:registrarId` | ✓ | `admin` | Elimina pre-inscripción. |

### `/workshop/audit` — Auditoría

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `POST` | `/log` | Opcional | — | Registra una acción de auditoría. Si tiene token, lo valida; si no, registra como anónimo. Rate limit: 150/min. |
| `GET` | `/` | ✓ | `admin` | Consulta historial de auditoría. |

---

## `index.js` — ¿Por qué está organizado así?

El entry point sigue un orden intencional:

1. **Imports y configuración** — Carga dotenv, config centralizado y conexión a DB.
2. **Whitelist de CORS** — `buildWhitelist()` genera variantes http/https de las URLs del frontend para cubrir ambos protocolos automáticamente.
3. **Middlewares globales** (en orden):
   - `rateLimit` — Protección anti-DDoS global (200 req / 15 min por IP).
   - `cors` — Solo acepta peticiones del frontend (whitelist). En dev permite peticiones sin Origin para facilitar pruebas con cURL/Postman.
   - `helmet` — Añade headers de seguridad HTTP.
   - `express.json({ limit: '500kb' })` — Parsea JSON con límite para evitar payloads enormes (fotos base64).
4. **Enrutamiento modular** — Cada prefijo delega a su archivo de rutas.
5. **Documentación dinámica** — `GET /` devuelve documentación de la API solo en desarrollo; en producción retorna solo el status.
6. **Error handler global** — Captura errores no manejados. Maneja casos específicos (duplicados MongoDB 11000, body demasiado grande). En producción no filtra stack traces.
7. **Arranque** — Primero conecta a MongoDB (`connectDB()`), y solo si la conexión es exitosa arranca el servidor HTTP.

## Dependencias y su propósito

| Paquete | Por qué se usa |
| --------- | --------------- |
| `express` | Framework HTTP principal |
| `mongoose` | ODM para MongoDB — schemas, validación, hooks |
| `bcryptjs` | Hashing de contraseñas (salt + hash en pre-save) |
| `jsonwebtoken` | Generación y verificación de tokens JWT |
| `cors` | Whitelist de orígenes permitidos |
| `helmet` | Headers de seguridad HTTP automáticos |
| `express-rate-limit` | Protección contra abuso (DoS, fuerza bruta) |
| `zod` | Validación declarativa de schemas de entrada |
| `dotenv` | Carga de variables de entorno desde `.env` |
| `multer` | Manejo de uploads de archivos (importación Excel) |
| `xlsx` | Parsing de archivos Excel para importación masiva de usuarios |
| `morgan` | Logging de peticiones HTTP (desarrollo) |
| `nodemon` | Hot-reload en desarrollo |
