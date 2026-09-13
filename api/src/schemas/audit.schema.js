const { z } = require('zod');

const auditLogSchema = z.object({
  accion: z.string().min(1).max(50).default('PAGE_VIEW'),
  path: z.string().min(1).max(500),
  detalles: z.string().max(500).optional(),
}).strict();

module.exports = { auditLogSchema };
