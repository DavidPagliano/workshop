const cycleServices = require('../services/preCycle.services');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const parsePagination = require('../utils/pagination');
const { logAction } = require('../services/audit.services');

exports.registerAspirant = asyncHandler(async (req, res) => {
  const result = await cycleServices.registerAspirant(req.body);
  await logAction(req, 'REGISTRO_PRECICLO', `Inscripción creada: ${result.registrarId} (DNI: ${result.dni})`);
  res.status(201).json(result);
});

exports.getAllAspirants = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);

  if (pagination === undefined) {
    throw new AppError('Parámetros de paginación inválidos', 400);
  }

  // Sin ?page/?limit se mantiene la respuesta como array (compatibilidad).
  if (pagination) {
    const result = await cycleServices.getAspirantsPage(pagination);
    return res.status(200).json(result);
  }

  const results = await cycleServices.getAllAspirants();
  res.status(200).json(results);
});

exports.getAspirantByRegistrarId = asyncHandler(async (req, res) => {
  const result = await cycleServices.getAspirantByRegistrarId(req.params.registrarId);
  if (!result) {
    throw new AppError('Aspirante no encontrado', 404);
  }
  res.status(200).json(result);
});

exports.updateAspirant = asyncHandler(async (req, res) => {
  const result = await cycleServices.updateAspirant(req.params.registrarId, req.body);
  if (!result) {
    throw new AppError('Aspirante no encontrado para actualizar', 404);
  }
  await logAction(req, 'ACTUALIZACION_PRECICLO', `Inscripción actualizada: ${result.registrarId} (DNI: ${result.dni})`);
  res.status(200).json(result);
});

exports.deleteAspirant = asyncHandler(async (req, res) => {
  const result = await cycleServices.deleteAspirant(req.params.registrarId);
  if (!result) {
    throw new AppError('Aspirante no encontrado para eliminar', 404);
  }
  await logAction(req, 'ELIMINACION_PRECICLO', `Inscripción eliminada: ${result.registrarId} (DNI: ${result.dni})`);
  res.status(200).json({ message: 'Aspirante eliminado correctamente' });
});
