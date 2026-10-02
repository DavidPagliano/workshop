const auditService = require('../services/audit.services');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const parsePagination = require('../utils/pagination');

exports.createAuditLog = asyncHandler(async (req, res) => {
  await auditService.createLog(req, req.body);
  res.status(201).json({ success: true });
});

exports.getAuditHistory = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);

  if (pagination === undefined) {
    throw new AppError('Parámetros de paginación inválidos', 400);
  }

  // La auditoría siempre responde paginada; sin query usa page 1 / limit 10.
  const { page, limit } = pagination || { page: 1, limit: 10 };
  const search = String(req.query.search || '').trim();

  const result = await auditService.getHistory({ page, limit, search });
  res.status(200).json(result);
});
