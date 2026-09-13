const Audit = require('../models/Audit');
const User = require('../models/User');

exports.createAuditLog = async (req, res) => {
  try {
    const { accion, path, detalles } = req.body;
    const userId = req.user ? req.user.id : null;

    const newLog = new Audit({
      userId,
      accion: accion || 'PAGE_VIEW',
      pagina: path,
      detalles: detalles || `Navegó a ${path}`,
      device: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    });

    await newLog.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar auditoría' });
  }
};

exports.getAuditHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Sanitizar para evitar ReDoS (inyección de regex maliciosa)
    const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let query = {};

    if (sanitizedSearch) {
      const users = await User.find({
        $or: [
          { username: { $regex: sanitizedSearch, $options: 'i' } },
          { email: { $regex: sanitizedSearch, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(u => u._id);

      query = {
        $or: [
          { userId: { $in: userIds } },
          { accion: { $regex: sanitizedSearch, $options: 'i' } },
          { detalles: { $regex: sanitizedSearch, $options: 'i' } }
        ]
      };
    }

    const [logs, total] = await Promise.all([
      Audit.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username email role'),
      Audit.countDocuments(query)
    ]);

    res.status(200).json({
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial de auditoría' });
  }
};