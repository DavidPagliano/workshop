const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

/**
 * Valida que el parámetro de ruta indicado sea un ObjectId de MongoDB válido.
 * Devuelve 400 en lugar de dejar que Mongoose lance un CastError.
 */
const validateObjectId = (param = 'id') => (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params[param])) {
    return next(new AppError(`Parámetro "${param}" inválido`, 400));
  }
  return next();
};

module.exports = validateObjectId;
