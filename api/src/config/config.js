const { config } = require('dotenv');

config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  mongoDB: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_db',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  url_web_dev: process.env.FRONTEND_URL || 'http://localhost:5173'
};