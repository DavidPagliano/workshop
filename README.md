# Workshop — Multimedia Day 2026 & Pre-inscripción TSM

Sistema web completo para la gestión del evento **Multimedia Workshop Day 2026** y la **pre-inscripción al ciclo lectivo 2027** del Técnico Superior en Multimedia (TSM). Consta de una API REST y un cliente web SPA, ambos desplegables de forma independiente.

## Descripción

La plataforma cubre dos flujos principales:

1. **Inscripción al evento Multimedia Day 2026** — Formulario público para que cualquier persona se registre al evento, seleccione un tema de interés y reciba un ticket PDF. El staff del evento puede luego tomar asistencia y ver estadísticas en tiempo real.
2. **Pre-inscripción al ciclo lectivo TSM 2027** — Formulario de aspirantes que recopila datos personales, foto, estado de secundario e información institucional. El equipo de bedelería gestiona el listado y puede exportarlo a Excel.

## Estructura del proyecto

```
workshop/
├── api/            ← Backend (Express + MongoDB)
│   └── README.md   ← Documentación detallada de la API
├── web/            ← Frontend (React + Vite + MUI)
│   └── README.md   ← Documentación detallada del cliente
└── README.md       ← Este archivo
```

## Tecnologías principales

| Capa | Tecnología | Propósito |
| ------ | ----------- | ----------- |
| **Backend** | Express 5 + Node.js | Servidor HTTP y enrutamiento REST |
| **Base de datos** | MongoDB + Mongoose 9 | Persistencia de datos con ODM |
| **Autenticación** | JWT + bcryptjs | Tokens stateless y hashing de contraseñas |
| **Validación** | Zod 4 | Validación de schemas en el servidor |
| **Seguridad** | Helmet + CORS + Rate Limit | Headers seguros, whitelist de orígenes, protección anti-DDoS |
| **Frontend** | React 19 + Vite 8 | SPA con HMR y build optimizado |
| **UI** | Material UI 9 (MUI) | Componentes, responsive y theming |
| **Ruteo** | React Router DOM 7 | Navegación SPA con lazy loading |
| **HTTP Client** | Axios | Peticiones al backend con interceptors |
| **Gráficos** | Recharts | Visualización de estadísticas |
| **Exportaciones** | jsPDF + jspdf-autotable | Reportes PDF estilizados |
| | xlsx-js-style | Exportación Excel .xlsx con formato |

## Requisitos previos

- **Node.js** ≥ 18
- **MongoDB** (local o Atlas)
- **npm** ≥ 9

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/DavidPagliano/workshop.git
cd workshop
```

### 2. Configurar la API

```bash
cd api
npm install
```

Crear el archivo `api/.env`:

```env
# Obligatorias
MONGODB_URI=mongodb://localhost:27017/workshop
JWT_SECRET=tu_clave_secreta_jwt

# Opcionales (tienen valores por defecto)
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FRONTEND_PREVIEW_URL=https://localhost:4173
```

> `MONGODB_URI` y `JWT_SECRET` son obligatorias. Si faltan, el servidor no arranca.

### 3. Configurar el Frontend

```bash
cd web
npm install
```

Crear el archivo `web/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Ejecutar en desarrollo

En dos terminales separadas:

```bash
# Terminal 1 — API
cd api
npm run dev          # nodemon con hot-reload

# Terminal 2 — Web
cd web
npm run dev          # Vite dev server en http://localhost:5173
```

### 5. Build de producción (web)

```bash
cd web
npm run build        # Genera /dist
npm run preview      # Sirve /dist para verificar
```

## Roles del sistema

| Rol | Descripción | Accesos |
| ----- | ------------ | --------- |
| `admin` | Administrador total | Todo: CRUD usuarios, importación Excel, estadísticas, auditoría |
| `director` | Director académico | Gestión de inscripciones, pre-inscripciones, estadísticas |
| `staff_registracion` | Staff del evento | Tomar asistencia en el evento |
| `staff_bedele` | Staff de bedelería | Gestión de pre-inscripciones al ciclo TSM |

## Autor

**David Pagliano** — [GitHub](https://github.com/DavidPagliano)
