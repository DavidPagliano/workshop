const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const config = require('./config/config');
const cycle = require('./routes/preCycle.route');
const event = require('./routes/event.route');
const auth = require('./routes/auth.route');
const audit = require('./routes/audit.route');
const connectDB = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

const isDev = config.nodeEnv === 'development';

// Genera variantes http y https de cada URL para cubrir ambos protocolos sin trailing slashes
const buildWhitelist = (...urls) => {
  const set = new Set();
  for (const url of urls) {
    if (!url) continue;
    const cleanUrl = url.trim().replace(/\/+$/, '');
    set.add(cleanUrl);
    if (cleanUrl.startsWith('http://')) set.add(cleanUrl.replace('http://', 'https://'));
    else if (cleanUrl.startsWith('https://')) set.add(cleanUrl.replace('https://', 'http://'));
  }
  return [...set];
};

const whitelist = buildWhitelist(config.url_web_dev, config.url_web_preview, config.url_github, config.url_web_production, config.url_web_production_2);

const corsOptions = {
  origin: function (origin, callback) {
    // En producción rechazar solicitudes sin Origin (cURL, scripts).
    // En desarrollo se permite para facilitar pruebas.
    if (whitelist.indexOf(origin) !== -1 || (isDev && !origin)) {
      callback(null, true);
    } else {
      callback(new AppError('No permitido por CORS. Origen no autorizado.', 403));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

// Rate limiter global: protección contra DoS en todos los endpoints.
// Límites configurables (RL_GLOBAL_*) y agrupados por token cuando hay sesión,
// para no bloquear entre sí a usuarios que comparten una misma IP (NAT/WiFi).
const globalLimiter = rateLimit({
  windowMs: config.rateLimits.global.windowMs,
  limit: config.rateLimits.global.limit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) return `u:${auth.slice(7)}`;
    return ipKeyGenerator(req.ip);
  },
  message: { message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.' },
});
app.set('trust proxy', config.trustProxy);
app.use(globalLimiter);
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '500kb' }));

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
            POST: 'Crea pre-inscripción pública (sin foto).',
            POST_admin: 'Crea pre-inscripción con foto (/workshop/cycle/admin). Requiere autenticación.',
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

// Health check para monitoreo/despliegue (incluye estado de la conexión a Mongo)
const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];
app.get('/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbOk = readyState === 1;

  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    db: DB_STATES[readyState] || 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 y manejador central de errores (siempre al final)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
connectDB().then(() => {
  const server = app.listen(config.port, () =>
    console.log(`Server running on port ${config.port}`),
  );

  // Cierre ordenado: dejar de aceptar peticiones y cerrar MongoDB.
  const shutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB desconectado. Bye.');
        process.exit(0);
      } catch (error) {
        console.error('Error al cerrar MongoDB:', error.message);
        process.exit(1);
      }
    });

    // Fuerza la salida si algo queda colgado.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
});