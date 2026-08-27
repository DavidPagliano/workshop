# Frontend - Event Registration App 🎨

Este proyecto está construido con **React (Vite)** y **Material UI**, utilizando JavaScript puro. Para mantener el código escalable, limpio y fácil de mantener, seguimos una arquitectura estricta que separa la lógica de la interfaz.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🏗️ Arquitectura y Flujo de Trabajo

El flujo de información en esta aplicación se divide en cuatro capas principales: **Hooks, Components, Pages y el Enrutador (App.jsx)**.

### 1. Custom Hooks (`/src/hooks`) - *La Lógica*

Los hooks (ej. `useForm`, `useAlert`, `usePreCycleForm`) son el "cerebro" de las vistas.

- **¿Qué hacen?** Encapsulan los estados (`useState`), los efectos (`useEffect`) y la lógica de negocio (validaciones, llamadas a los servicios de Axios).
- **Regla de oro:** No devuelven HTML/JSX. Solo devuelven datos y funciones para modificar esos datos.

### 2. Components (`/src/components`) - *La Presentación*

Son las piezas de Lego reutilizables de nuestra interfaz (ej. `EventCard`, botones personalizados, inputs).

- **¿Qué hacen?** Reciben información a través de `props` y la muestran en pantalla utilizando Material UI.
- **Regla de oro:** Deben ser lo más "tontos" posible. Si un componente tiene demasiada lógica o maneja llamadas a la API directamente, esa lógica debe extraerse a un Hook.

### 3. Pages (`/src/pages`) - *El Ensamblaje*

Son las vistas completas que el usuario ve en su pantalla (ej. `HomePage`, `AdminDashboard`).

- **¿Qué hacen?** Actúan como directores de orquesta. Importan los **Components** visuales y los conectan con los datos y funciones que proveen los **Hooks**.
- **Flujo:** La *Page* llama al *Hook*, obtiene el estado y las funciones, y se las inyecta a los *Components* como props.

### 4. App.jsx - *El Enrutador*

Es el punto de entrada lógico de la aplicación visual.

- **¿Qué hace?** Utiliza `react-router-dom` para mapear las URLs (ej. `/pre-ciclo`) a sus respectivas **Pages**.
- **Flujo:** Cuando un componente (como el `EventCard`) ejecuta `useNavigate('/ruta')`, cambia la URL del navegador. `App.jsx` detecta este cambio, desmonta la *Page* actual y monta la nueva *Page* correspondiente.

---

### 🔄 Ejemplo del Flujo Completo

1. El usuario entra a `http://localhost:5173/`.
2. **`App.jsx`** lee la URL `/` y decide renderizar la página **`HomePage`**.
3. **`HomePage`** importa e inicializa el hook **`useAlert`** para preparar el sistema de notificaciones.
4. **`HomePage`** renderiza el componente **`EventCard`**, pasándole por props el título y la ruta de destino (`/registro-evento`).
5. El usuario hace clic en el botón dentro de **`EventCard`**.
6. El componente dispara `useNavigate('/registro-evento')`.
7. **`App.jsx`** detecta el cambio de URL y reemplaza `HomePage` con la página del formulario, reiniciando el ciclo.
