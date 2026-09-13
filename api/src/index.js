const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const cycle = require('./routes/preCycle.route');
const event = require('./routes/event.route');
const auth = require('./routes/auth.route');
const audit = require('./routes/audit.route');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const isDev = config.nodeEnv === 'development';

const whitelist = [config.url_web_dev];

const corsOptions = {
  origin: function (origin, callback) {
    // En producción rechazar solicitudes sin Origin (cURL, scripts).
    // En desarrollo se permite para facilitar pruebas.
    if (whitelist.indexOf(origin) !== -1 || (isDev && !origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS. Origen no autorizado.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

// Rate limiter global: protección contra DoS en todos los endpoints
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  limit: 200,                 // 200 peticiones por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.' },
});

app.use(globalLimiter);
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '25kb' }));

// Enrutamiento modular
app.use('/workshop/auth', auth);
app.use('/workshop/cycle', cycle);
app.use('/workshop/event', event);
app.use('/workshop/audit', audit);

app.get('/', (req, res) => {
  // Solo exponer documentación detallada en desarrollo
  if (isDev) {
    return res.status(200).json({
      api_name: 'Event Registration API',
      version: '1.0.0',
      status: 'online',
      description: 'API para la gestión de inscripciones a eventos y pre-ciclo 2027.',
      endpoints: {
        auth: {
          base_url: '/workshop/auth',
          methods: {
            POST_login: '/login - Inicia sesión y retorna JWT token.',
            POST_register: '/register - Requiere token de admin para crear usuarios.',
          },
        },
        eventRegistration: {
          base_url: '/workshop/event',
          methods: {
            GET: 'Obtiene inscriptos. Acepta ?dni=DNI para búsqueda.',
            POST: 'Crea inscripción pública.',
            PUT: 'Actualiza por registrarId (/workshop/event/:registrarId).',
            PATCH: 'Actualiza asistencia (/workshop/event/:registrarId/registrado).',
            DELETE: 'Elimina registro por registrarId (/workshop/event/:registrarId).',
          },
        },
        preCycleRegistration: {
          base_url: '/workshop/cycle',
          methods: {
            GET: 'Obtiene lista de pre-inscriptos.',
            POST: 'Crea pre-inscripción.',
            PUT: 'Actualiza por registrarId (/workshop/cycle/:registrarId).',
            DELETE: 'Elimina pre-inscripción por registrarId (/workshop/cycle/:registrarId).',
          },
        },
      },
    });
  }

  // En producción, solo status mínimo
  res.status(200).json({
    api_name: 'Event Registration API',
    status: 'online',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.code === 11000) {
    return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'El cuerpo de la petición es demasiado grande' });
  }
  // En producción no filtrar stack traces
  if (isDev) {
    console.error(error);
  } else {
    console.error(`[ERROR] ${error.message}`);
  }
  return res.status(500).json({ message: 'Error interno del servidor' });
});

// Start server
connectDB().then(() => {
  app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
});