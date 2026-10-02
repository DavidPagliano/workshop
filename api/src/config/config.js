const { config } = require('dotenv');

config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
  process.exit(1);
}

// Un JWT_SECRET corto es vulnerable a fuerza bruta / forja de tokens.
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET debe tener al menos 32 caracteres.');
  process.exit(1);
}

// Cantidad de proxies de confianza delante de la app. Define qué IP usa el
// rate limiter (evita que se falsifique X-Forwarded-For). Por defecto 1 en
// producción (un reverse proxy) y sin confianza en desarrollo.
const parseTrustProxy = (value) => {
  if (value === undefined) return isProduction ? 1 : false;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const num = Number(value);
  return Number.isNaN(num) ? value : num;
};

// Lee un entero positivo desde env, con fallback.
const parseNumber = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
};

// Límites de rate limiting configurables por .env.
// Pensados para el día del evento: si varios usuarios salen por la misma IP
// (red del salón), los límites por IP deben ser holgados y, cuando hay token,
// se agrupa por usuario en vez de por IP.
const rateLimits = {
  global: {
    windowMs: parseNumber(process.env.RL_GLOBAL_WINDOW_MS, 15 * 60 * 1000),
    limit: parseNumber(process.env.RL_GLOBAL_LIMIT, 10000),
  },
  login: {
    windowMs: parseNumber(process.env.RL_LOGIN_WINDOW_MS, 15 * 60 * 1000),
    limit: parseNumber(process.env.RL_LOGIN_LIMIT, 30),
  },
  register: {
    windowMs: parseNumber(process.env.RL_REGISTER_WINDOW_MS, 60 * 60 * 1000),
    limit: parseNumber(process.env.RL_REGISTER_LIMIT, 60),
  },
  audit: {
    windowMs: parseNumber(process.env.RL_AUDIT_WINDOW_MS, 60 * 1000),
    limit: parseNumber(process.env.RL_AUDIT_LIMIT, 600),
  },
};

module.exports = {
  nodeEnv,
  port: Number(process.env.PORT) || 3000,
  mongoDB: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  rateLimits,
  url_web_dev: process.env.FRONTEND_URL || 'http://localhost:5173',
  url_web_preview: process.env.FRONTEND_PREVIEW_URL || 'https://localhost:4173',
  url_web_production: process.env.FRONTEND_PRODUCTION_URL || 'https://localhost:4173',
  url_web_production_2: process.env.FRONTEND_PRODUCTION_URL_2 || 'https://localhost:4173',
  url_github: process.env.GITHUB_URL || 'https://localhost:4173',
};
