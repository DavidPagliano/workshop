/**
 * Envuelve un handler async para que cualquier promesa rechazada
 * se derive al middleware de errores de Express.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
