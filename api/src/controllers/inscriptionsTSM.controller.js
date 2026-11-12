const inscriptionTSMServices = require('../services/inscriptionsTSM.services');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const parsePagination = require('../utils/pagination');
const { logAction } = require('../services/audit.services');

exports.createInscriptionTSM = asyncHandler(async (req, res) => {
    const result = await inscriptionTSMServices.createInscriptionTSM(req.body);
    await logAction(req, 'REGISTRO_INSCRIPCION_TSM', `Inscripción TSM creada: ${result.inscriptionId} (DNI: ${result.dni})`);
    res.status(201).json(result);
});

exports.getAllInscriptionsTSM = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);

  if (pagination === undefined) {
    throw new AppError('Parámetros de paginación inválidos', 400);
  }

  // Sin ?page/?limit se mantiene la respuesta como array (compatibilidad).
  if (pagination) {
    const result = await inscriptionTSMServices.getAllInscriptionsTSMPage(pagination);
    return res.status(200).json(result);
  }

  const results = await inscriptionTSMServices.getAllInscriptionsTSM();
  res.status(200).json(results);
});

exports.getInscriptionTSMById = asyncHandler(async (req, res) => {
  const result = await inscriptionTSMServices.getInscriptionTSMById(req.params.inscriptionId);
  if (!result) {
    throw new AppError('Inscripto TSM no encontrado', 404);
  }
  res.status(200).json(result);
});

exports.updateInscriptionTSM = asyncHandler(async (req, res) => {
  const result = await inscriptionTSMServices.updateInscriptionTSM(req.params.inscriptionId, req.body);
  if (!result) {
    throw new AppError('Inscripto TSM no encontrado para actualizar', 404);
  }
  await logAction(req, 'ACTUALIZACION_INSCRIPCION_TSM', `Inscripción TSM actualizada: ${result.inscriptionId} (DNI: ${result.dni})`);
  res.status(200).json(result);
});

exports.deleteInscriptionTSM = asyncHandler(async (req, res) => {
  const result = await inscriptionTSMServices.deleteInscriptionTSM(req.params.inscriptionId);
  if (!result) {
    throw new AppError('Aspirante TSM no encontrado para eliminar', 404);
  }
  await logAction(req, 'ELIMINACION_INSCRIPCION_TSM', `Inscripción TSM eliminada: ${result.inscriptionId} (DNI: ${result.dni})`);
  res.status(200).json({ message: 'Inscripto TSM eliminado correctamente' });
});
