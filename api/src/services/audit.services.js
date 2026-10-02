const Audit = require('../models/Audit');
const User = require('../models/User');

/**
 * Registra una acción en la colección de auditoría.
 * No propaga errores: la auditoría nunca debe romper la operación principal.
 *
 * @param {import('express').Request} req
 * @param {string} accion
 * @param {string} detalles
 * @param {string} [customPath]
 */
const logAction = async (req, accion, detalles, customPath = null) => {
  try {
    await Audit.create({
      userId: req.user ? req.user.id : null,
      accion,
      pagina: customPath || req.originalUrl,
      detalles,
      device: req.headers['user-agent'] || 'Desconocido',
      ip: req.ip || req.connection?.remoteAddress || '0.0.0.0',
    });
  } catch (err) {
    console.error('Error al guardar log de auditoría:', err.message);
  }
};

exports.logAction = logAction;

exports.createLog = async (req, { accion, path, detalles }) => {
  return await Audit.create({
    userId: req.user ? req.user.id : null,
    accion: accion || 'PAGE_VIEW',
    pagina: path,
    detalles: detalles || `Navegó a ${path}`,
    device: req.headers['user-agent'],
    ip: req.ip || req.connection?.remoteAddress,
  });
};

exports.getHistory = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const skip = (page - 1) * limit;

  // Sanitizar para evitar ReDoS (inyección de regex maliciosa)
  const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let query = {};

  if (sanitizedSearch) {
    const users = await User.find({
      $or: [
        { username: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
      ],
    }).select('_id');

    const userIds = users.map((u) => u._id);

    query = {
      $or: [
        { userId: { $in: userIds } },
        { accion: { $regex: sanitizedSearch, $options: 'i' } },
        { detalles: { $regex: sanitizedSearch, $options: 'i' } },
      ],
    };
  }

  const [logs, total] = await Promise.all([
    Audit.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email role'),
    Audit.countDocuments(query),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
