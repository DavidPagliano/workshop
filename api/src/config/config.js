const { config } = require('dotenv');

config();

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  mongoDB: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  url_web_dev: process.env.FRONTEND_URL || 'http://localhost:5173',
  url_web_preview: process.env.FRONTEND_PREVIEW_URL || 'https://localhost:4173',
  url_web_production: process.env.FRONTEND_PRODUCTION_URL || 'https://localhost:4173',
  url_github: process.env.GITHUB_URL || 'https://localhost:4173',
};