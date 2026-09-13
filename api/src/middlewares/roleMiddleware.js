const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acceso denegado: Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = authorizeRoles;