const Audit = require('../models/Audit');

/**
 * Registra una acción en la colección de auditoría
 * @param {import('express').Request} req 
 * @param {string} accion 
 * @param {string} detalles 
 * @param {string} [customPath] 
 */
const logAction = async (req, accion, detalles, customPath = null) => {
  try {
    const userId = req.user ? req.user.id : null;
    const auditData = {
      userId,
      accion,
      pagina: customPath || req.originalUrl,
      detalles,
      device: req.headers['user-agent'] || 'Desconocido',
      ip: req.ip || req.connection?.remoteAddress || '0.0.0.0',
    };
    await Audit.create(auditData);
  } catch (err) {
    console.error('Error al guardar log de auditoría:', err.message);
  }
};

module.exports = { logAction };