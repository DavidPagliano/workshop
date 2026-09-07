const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config');
const cycle = require('./routes/preCycle.route');
const event = require('./routes/event.route');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const whitelist = [
  config.url_web_dev, // Vite por defecto usa el 5173
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como las de Postman en desarrollo o del mismo servidor)
    // Si quieres bloquear Postman, quita el `!origin`
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS. Origen no autorizado.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
  credentials: true, // Importante para cuando agreguemos las cookies o JWT
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/workshop/cycle', cycle);
app.use('/workshop/event', event);
app.get('/', (req, res) => {
  res.status(200).json({
    api_name: 'Event Registration API',
    version: '1.0.0',
    status: 'online',
    description: 'API para la gestión de inscripciones a eventos y pre-ciclo 2027.',
    endpoints: {
      eventRegistration: {
        base_url: '/workshop/event',
        methods: {
          GET: 'Obtiene la lista de inscriptos. Acepta query param opcional ?dni=DNI para búsqueda.',
          POST: 'Crea una nueva inscripción. Requiere body JSON validado por Zod.',
          PUT: 'Actualiza una inscripción completa por registrarId (/workshop/event/:registrarId).',
          PATCH: 'Actualiza solo el estado de asistencia (/workshop/event/:registrarId/registrado). Requiere { seRegistro: true|false }.',
          DELETE: 'Elimina un registro por registrarId (/workshop/event/:registrarId).'
        }
      },
      preCycleRegistration: {
        base_url: '/workshop/cycle',
        methods: {
          GET: 'Obtiene la lista de pre-inscriptos al ciclo 2027.',
          POST: 'Crea una nueva pre-inscripción. Requiere body JSON validado por Zod.',
          PUT: 'Actualiza una pre-inscripción completa por registrarId (/workshop/cycle/:registrarId).',
          DELETE: 'Elimina una pre-inscripción por registrarId (/workshop/cycle/:registrarId).'
        }
      }
    }
  });
});

// Start server
connectDB().then(() => {
  app.listen(config.port, () => console.log(`Server running hola on port ${config.port}`));
});