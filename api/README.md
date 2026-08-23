# Backend - Event Registration API 🚀

Este es el backend de la aplicación de inscripción y registro de eventos. Está construido con Node.js, Express y MongoDB, utilizando una arquitectura multicapa (Rutas, Controladores y Servicios) para garantizar la escalabilidad y un código limpio. Además, implementa validación estricta de datos utilizando Zod.

## 🛠️ Tecnologías Utilizadas

- **Entorno de ejecución:** Node.js
- **Framework web:** Express.js
- **Base de Datos:** MongoDB
- **ODM:** Mongoose
- **Validación de esquemas:** Zod
- **Otras utilidades:** CORS, Dotenv, Morgan (para logging HTTP).

## 📂 Estructura del Proyecto

El proyecto sigue una separación estricta de responsabilidades:

```text
backend/
├── src/
│   ├── config/           # Configuración de la base de datos (MongoDB)
│   ├── controllers/      # Controladores (manejo de req y res HTTP)
│   ├── middlewares/      # Interceptores (ej. validateRequest con Zod)
│   ├── models/           # Esquemas de Mongoose (EventRegistration, PreCycleRegistration)
│   ├── routes/           # Definición de endpoints y mapeo a controladores
│   ├── schemas/          # Reglas de validación estricta con Zod
│   ├── services/         # Lógica de negocio e interacción con la BD
│   └── server.js         # Punto de entrada de la aplicación
├── .env.example          # Plantilla de variables de entorno
├── package.json
└── README.md
