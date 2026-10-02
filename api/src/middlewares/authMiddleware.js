const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <token>

  if (!token) {
    throw new AppError('Acceso denegado: Token no provisto', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
  } catch (error) {
    throw new AppError('Token inválido o expirado', 401);
  }

  if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) {
    throw new AppError('Token inválido', 401);
  }

  // Revalidar contra la BD: desactivar, eliminar, cambiar el rol o resetear
  // la contraseña de un usuario invalida sus JWT vigentes de inmediato.
  const user = await User.findById(decoded.id).select('username role activo tokenVersion');
  if (!user || !user.activo) {
    throw new AppError('Sesión inválida o usuario inactivo', 401);
  }

  if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
    throw new AppError('Sesión expirada. Inicie sesión nuevamente', 401);
  }

  req.user = { id: user._id.toString(), username: user.username, role: user.role };
  next();
});

module.exports = authenticateToken;
