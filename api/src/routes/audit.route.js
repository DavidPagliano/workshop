const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const router = express.Router();
const config = require('../config/config');
const { createAuditLog, getAuditHistory } = require('../controllers/audit.controller');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { auditLogSchema } = require('../schemas/audit.schema');

// Se agrupa por token (usuario) para no bloquear a todos cuando comparten IP.
const auditLogLimiter = rateLimit({
  windowMs: config.rateLimits.audit.windowMs,
  limit: config.rateLimits.audit.limit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) return `u:${auth.slice(7)}`;
    return ipKeyGenerator(req.ip);
  },
  message: { message: 'Demasiados logs de auditoría' },
});

// Requiere autenticación: evita que terceros inserten registros arbitrarios
// en la auditoría. El tracking de páginas se hace con el token del usuario.
router.post('/log', auditLogLimiter, authenticateToken, validateRequest(auditLogSchema), createAuditLog);

router.get('/', authenticateToken, authorizeRoles('admin'), getAuditHistory);

module.exports = router;