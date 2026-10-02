/**
 * Error de aplicación con código HTTP asociado.
 * Permite que servicios y controladores lancen errores "operacionales"
 * y que el manejador central decida la respuesta sin repetir try/catch.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = options.details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
