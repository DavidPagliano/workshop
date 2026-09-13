const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no provisto' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authenticateToken;