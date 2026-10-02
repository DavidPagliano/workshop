const config = require('../config/config');
const AppError = require('../utils/AppError');

/**
 * Middleware para rutas no encontradas (se monta después de las rutas).
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};

/**
 * Manejador central de errores. Normaliza errores de Mongoose,
 * de índices duplicados, de Multer y de payloads grandes a
 * respuestas consistentes, respetando el statusCode de AppError.
 */
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const isDev = config.nodeEnv === 'development';

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details;

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos inválidos';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Valor inválido para ${err.path}`;
  }

  // Índices únicos de MongoDB
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `Ya existe un registro con ese ${field}`
      : 'Ya existe un registro con esos datos';
  }

  // Payload demasiado grande
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'El cuerpo de la petición es demasiado grande';
  }

  // Archivos subidos con Multer
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'El archivo excede el tamaño máximo permitido de 5MB'
      : `Error al subir el archivo: ${err.message}`;
  }

  // Autenticación sin configurar
  if (err.code === 'AUTH_NOT_CONFIGURED') {
    statusCode = 503;
    message = 'Autenticación no configurada';
  }

  // Ocultar el detalle de errores no controlados en producción
  if (statusCode >= 500 && !err.isOperational && !isDev) {
    message = 'Error interno del servidor';
  }

  // Solo loguear el stack de los errores no controlados
  if (statusCode >= 500) {
    console.error(isDev ? err : `[ERROR] ${err.message}`);
  }

  const body = { message };
  if (details) body.errors = details;
  if (isDev && statusCode >= 500) body.stack = err.stack;

  return res.status(statusCode).json(body);
};

module.exports = { notFoundHandler, errorHandler };
