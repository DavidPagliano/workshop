const inscriptionServices = require('../services/inscriptions.services');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const parsePagination = require('../utils/pagination');
const { logAction } = require('../services/audit.services');

exports.createInscription = asyncHandler(async (req, res) => {
    const result = await inscriptionServices.createInscription(req.body);
    await logAction(req, 'REGISTRO_INSCRIPCION', `Inscripción creada: ${result.inscriptionId} (DNI: ${result.dni})`);
    res.status(201).json(result);
});

exports.getAllInscription = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);

  if (pagination === undefined) {
    throw new AppError('Parámetros de paginación inválidos', 400);
  }

  // Sin ?page/?limit se mantiene la respuesta como array (compatibilidad).
  if (pagination) {
    const result = await inscriptionServices.getAllInscriptionsPage(pagination);
    return res.status(200).json(result);
  }

  const results = await inscriptionServices.getAllInscriptions();
  res.status(200).json(results);
});

exports.getInscriptionById = asyncHandler(async (req, res) => {
  const result = await inscriptionServices.getInscriptionById(req.params.inscriptionId);
  if (!result) {
    throw new AppError('Inscripto no encontrado', 404);
  }
  res.status(200).json(result);
});

exports.updateInscription = asyncHandler(async (req, res) => {
  const result = await inscriptionServices.updateInscription(req.params.inscriptionId, req.body);
  if (!result) {
    throw new AppError('Inscripto no encontrado para actualizar', 404);
  }
  await logAction(req, 'ACTUALIZACION_INSCRIPCION', `Inscripción actualizada: ${result.inscriptionId} (DNI: ${result.dni})`);
  res.status(200).json(result);
});

exports.deleteInscription = asyncHandler(async (req, res) => {
  const result = await inscriptionServices.deleteInscription(req.params.inscriptionId);
  if (!result) {
    throw new AppError('Aspirante no encontrado para eliminar', 404);
  }
  await logAction(req, 'ELIMINACION_INSCRIPCION', `Inscripción eliminada: ${result.inscriptionId} (DNI: ${result.dni})`);
  res.status(200).json({ message: 'Inscripto eliminado correctamente' });
});
