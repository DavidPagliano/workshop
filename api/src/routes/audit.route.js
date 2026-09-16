const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { createAuditLog, getAuditHistory } = require('../controllers/audit.controller');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { auditLogSchema } = require('../schemas/audit.schema');

const auditLogLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  limit: 150,                 // 150 logs por minuto por IP (suficiente para navegación normal)
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados logs de auditoría' },
});

router.post('/log', auditLogLimiter, (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}, validateRequest(auditLogSchema), createAuditLog);

router.get('/', authenticateToken, authorizeRoles('admin'), getAuditHistory);

module.exports = router;