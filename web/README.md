# Frontend — Workshop Web App

Cliente web SPA construido con **React 19**, **Vite 8** y **Material UI 9** (JavaScript puro, sin TypeScript). Implementa la interfaz pública del evento Multimedia Day 2026, el formulario de pre-inscripción al ciclo TSM 2027 y el panel de gestión interno con control de acceso por roles.

## Ejecución

```bash
npm install
npm run dev          # Desarrollo — http://localhost:5173 (HMR)
npm run build        # Build de producción → /dist
npm run preview      # Sirve /dist en http://localhost:4173
```

## Variables de entorno

Archivo `.env` en la raíz de `/web`:

```env
VITE_API_URL=http://localhost:3000
```

> Vite expone solo las variables prefijadas con `VITE_`. El servicio `api.js` lee esta variable para configurar la baseURL de Axios.

---

## Estructura de carpetas

```
web/src/
├── assets/               ← Imágenes, tipografías y recursos estáticos
│   ├── images/           ← Logos, fondos, workshops, íconos 3D
│   └── tipografia/       ← Neue Haas Grotesk + Omega Pixel BIFORM
├── components/           ← Componentes reutilizables (presentación)
│   ├── admin/            ← Panel de administración
│   ├── auth/             ← ProtectedRoute (guard de rutas)
│   ├── estadisticas/     ← Secciones del dashboard de estadísticas
│   ├── home/             ← Elementos decorativos de la landing
│   ├── inscripcion-tsm/  ← Modales del CRUD de pre-inscripción
│   ├── inscripcion-w/    ← Formulario de inscripción al evento
│   ├── layout/           ← PrivateLayout (navbar + sidebar)
│   └── registracion/     ← Ficha de usuario y lista de inscriptos
├── config/
│   └── theme.js          ← Theme de MUI (paleta, tipografías, overrides)
├── context/
│   └── AuthContext.jsx   ← Contexto global de autenticación
├── hooks/                ← Custom hooks (lógica de negocio)
├── pages/                ← Vistas completas (ensamblaje de components + hooks)
├── services/             ← Módulos Axios para comunicación con la API
├── utils/                ← Utilidades (exportadores PDF/Excel, helpers)
├── App.jsx               ← Router principal + lazy loading
├── main.jsx              ← Entry point (ThemeProvider, BrowserRouter, Toaster)
└── index.css             ← @font-face de las tipografías custom
```

---

## Arquitectura — ¿Por qué está separado así?

### Principio: Separación de responsabilidades

Cada carpeta tiene un rol único y no se mezclan:

```
Hooks (lógica) → Components (presentación) → Pages (ensamblaje) → App.jsx (ruteo)
```

### 1. Custom Hooks (`/hooks`) — La lógica

Encapsulan estados (`useState`), efectos (`useEffect`) y lógica de negocio (validaciones, llamadas a services). **No devuelven JSX.**

| Hook | Propósito |
| ------ | ----------- |
| `useEventRegistration` | Estado y CRUD del formulario de inscripción al evento |
| `usePreCycleRegistrations` | Estado y CRUD de la tabla de pre-inscripciones TSM |
| `usePreCycleForm` | Lógica del formulario público de pre-inscripción |
| `useAsistencia` | Búsqueda por DNI y marcado de asistencia |
| `usePhotoCapture` | Captura de foto con cámara del dispositivo |
| `usePageTracking` | Tracking de navegación para auditoría |

### 2. Components (`/components`) — La presentación

Piezas reutilizables que reciben datos vía `props` y los renderizan con MUI. **No hacen llamadas a la API directamente.**

| Carpeta | Componentes | Función |
| --------- | ------------ | --------- |
| `admin/` | `AdminOverview`, `AdminQuickLinks`, `AuditLog`, `ImportUsersDialog`, `UserManagement` | Panel de administración: CRUD de usuarios, importación Excel, log de auditoría |
| `auth/` | `ProtectedRoute` | Guard de rutas que verifica JWT + rol del usuario. Redirige a `/login` si no está autenticado o no tiene permisos. |
| `estadisticas/` | `AsistenciaSection`, `PreCicloSection`, `TemasSection`, `MetricCards`, `CustomChartTooltip` | Secciones del dashboard de estadísticas con gráficos Recharts |
| `home/` | `schedulePanel`, `vectorBox` | Elementos decorativos de la landing page |
| `inscripcion-tsm/` | `PreInscriptionFormModal`, `PreInscriptionViewModal`, `PreInscriptionDeleteModal`, `PhotoCapture` | Modales CRUD para pre-inscripciones + captura de foto |
| `inscripcion-w/` | `EventRegistrationForm`, `RegistrationSuccess` | Formulario público de inscripción al evento + pantalla de éxito con ticket PDF |
| `layout/` | `PrivateLayout` | Layout con navbar superior y sidebar de navegación para las secciones protegidas |
| `registracion/` | `ListaInscriptos`, `FichaUsuario`, `FichaDesktop`, `ModalFichaMobile` | Vista de inscriptos con ficha detallada (desktop/mobile) para tomar asistencia |

### 3. Pages (`/pages`) — El ensamblaje

Cada page importa los hooks necesarios, obtiene los datos y funciones, y se los pasa a los components como props. Actúan como **directores de orquesta**.

| Carpeta | Page | Ruta | Acceso |
| --------- | ------ | ------ | -------- |
| — | `HomePage` | `/` | Público |
| `inscripcion-w/` | `EventRegistrationPage` | `/inscripcion` | Público |
| `auth/` | `LoginPage` | `/login` | Público |
| `auth/` | `RegisterPage` | `/registro-usuario` | Público |
| `registracion/` | `registrationPage` | `/registro`, `/dashboard/asistencia` | `admin`, `director`, `staff_registracion` |
| `dashboard/` | `DashboardHome` | `/dashboard` | Todos los roles autenticados |
| `inscripcion-tsm/` | `CyclePreinscriptionPage` | `/dashboard/pre-ciclo` | `admin`, `director`, `staff_bedele` |
| `estadisticas/` | `estadisticasPage` | `/dashboard/estadisticas` | `admin`, `director` |
| `admin/` | `AdminPage` | `/dashboard/admin` | `admin` |

### 4. `App.jsx` — El router

Usa `react-router-dom` con **lazy loading** (`React.lazy` + `Suspense`) para cargar cada page bajo demanda. Solo `HomePage` se importa estáticamente (es la landing). Las rutas protegidas se envuelven con `ProtectedRoute` que valida JWT y roles.

### 5. Services (`/services`) — Comunicación con la API

Módulos que encapsulan las llamadas HTTP con Axios. Cada service corresponde a un grupo de endpoints de la API.

| Service | Archivo | Endpoints que consume |
| --------- | --------- | ---------------------- |
| `api` | `api.js` | Instancia base de Axios con `baseURL`, interceptors para adjuntar JWT automáticamente |
| `eventService` | `eventService.js` | `/workshop/event` — CRUD de inscripciones al evento |
| `preCycleService` | `preCycleService.js` | `/workshop/cycle` — CRUD de pre-inscripciones |
| `adminService` | `adminService.js` | `/workshop/auth/users`, `/workshop/auth/admin/*` — Gestión de usuarios |
| `asistenciaService` | `asistenciaService.js` | `/workshop/event` — Búsqueda por DNI y listado para asistencia |
| `attendAsistence` | `attendAsistence.js` | `/workshop/event/:id/registrado` — Marca/desmarca asistencia |

### 6. Context (`/context`)

| Contexto | Propósito |
|----------|-----------|
| `AuthContext` | Almacena el JWT, los datos del usuario decodificado y expone `login()`, `logout()`, `isAuthenticated`. Persiste el token en `localStorage`. |

### 7. Utils (`/utils`)

| Utilidad | Archivo | Propósito |
| ---------- | --------- | ----------- |
| `exportPDF` | `exportPDF.js` | Genera un PDF estilizado con las estadísticas completas (asistencia, temas, pre-ciclo) usando jsPDF + autoTable. Paleta de colores derivada del theme. |
| `exportPreInscripcionesXLSX` | `exportPreInscripcionesXLSX.js` | Exporta las pre-inscripciones a un Excel .xlsx con celdas estilizadas (headers con fondo azul marino, texto cyan, filas alternadas, bordes magenta). |
| `generateTicketPDF` | `generateTicketPDF.js` | Genera el ticket/comprobante PDF que recibe el inscripto al evento tras completar el formulario. |
| `estadisticasUtils` | `estadisticasUtils.js` | Helpers para formatear fechas y calcular métricas de estadísticas. |

---

## Sistema de diseño

### Paleta de colores

| Color | Hex | Uso |
| ------- | ----- | ----- |
| Azul marino oscuro | `#03083B` | Background principal, fondos de cards |
| Azul medio | `#071052` | Paper (background.paper con transparencia) |
| Cyan eléctrico | `#00B4FF` | Primary — bordes, textos destacados, iconos |
| Magenta | `#D500BA` | Secondary — sombras duras, acentos, badges |
| Blanco | `#FFFFFF` | Texto principal sobre fondo oscuro |

### Tipografías

| Fuente | Uso |
|--------|-----|
| **Neue Haas Grotesk** (400, 500, 700, 900) | Texto body, descripciones, subtítulos, headings |
| **Omega Pixel BIFORM** | Títulos estilizados, botones, labels — estética pixel/retro |

Las fuentes se cargan con `@font-face` en `index.css` desde archivos locales en `/assets/tipografia/`.

### Estética

El diseño sigue una estética **neón retro / cyberpunk**: fondos oscuros, bordes nítidos (sin border-radius), sombras duras de color, animaciones de neón y pixel art. Los componentes MUI tienen overrides globales en `theme.js` que aplican:

- `borderRadius: 0` en todos los botones y cards
- Sombras tipo `4px 4px 0px #D500BA` (hard shadow magenta)
- Bordes sólidos de 2px cyan
- Efecto hover con desplazamiento `-2px, -2px` (estilo retro-pressed)

### Responsive

Todos los componentes usan el sistema de breakpoints de MUI (`xs`, `sm`, `md`, `lg`) para adaptar:

- Tamaños de fuente
- Padding y spacing
- Layout (column/row)
- Visibilidad de elementos
- Tamaños de imágenes decorativas

La landing page (`HomePage`) adapta los elementos decorativos 3D (cursor, play, más, recuadro) reposicionándolos y escalándolos por breakpoint.

## Dependencias y su propósito

| Paquete | Por qué se usa |
| --------- | --------------- |
| `react` + `react-dom` | Framework de UI |
| `vite` + `@vitejs/plugin-react` | Bundler con HMR ultra-rápido |
| `@mui/material` + `@emotion/*` | Sistema de componentes, theming, responsive |
| `@mui/icons-material` | Iconos consistentes con MUI |
| `react-router-dom` | Navegación SPA con lazy loading |
| `axios` | Cliente HTTP con interceptors (auto-attach JWT) |
| `react-hot-toast` | Notificaciones toast no-intrusivas |
| `jwt-decode` | Decodifica JWT en el cliente para leer rol/username |
| `recharts` | Gráficos de barras y torta para estadísticas |
| `jspdf` + `jspdf-autotable` | Generación de PDFs estilizados (reportes, tickets) |
| `xlsx-js-style` | Exportación Excel .xlsx con formato de celdas (colores, bordes, fuentes) |
| `@vitejs/plugin-basic-ssl` | HTTPS local para preview (requerido por cámara en algunos navegadores) |
