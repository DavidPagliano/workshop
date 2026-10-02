const eventService = require('../services/event.services');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const parsePagination = require('../utils/pagination');
const { logAction } = require('../services/audit.services');

exports.createEventRegistration = asyncHandler(async (req, res) => {
  const result = await eventService.registerParticipant(req.body);
  await logAction(req, 'REGISTRO_EVENTO', `Inscripción creada: ${result.registrarId} (DNI: ${result.dni})`);
  res.status(201).json(result);
});

exports.getAllEventRegistrations = asyncHandler(async (req, res) => {
  const filters = req.query.dni ? { dni: String(req.query.dni) } : {};
  const pagination = parsePagination(req.query);

  if (pagination === undefined) {
    throw new AppError('Parámetros de paginación inválidos', 400);
  }

  // Sin ?page/?limit se mantiene la respuesta como array (compatibilidad).
  if (pagination) {
    const result = await eventService.getParticipantsPage(filters, pagination);
    return res.status(200).json(result);
  }

  const results = await eventService.getAllParticipants(filters);
  res.status(200).json(results);
});

exports.getEventRegistrationByRegistrarId = asyncHandler(async (req, res) => {
  const result = await eventService.getParticipantByRegistrarId(req.params.registrarId);
  if (!result) {
    throw new AppError('Registro no encontrado', 404);
  }
  res.status(200).json(result);
});

exports.updateEventRegistration = asyncHandler(async (req, res) => {
  const result = await eventService.updateParticipant(req.params.registrarId, req.body);
  if (!result) {
    throw new AppError('Registro no encontrado para actualizar', 404);
  }
  await logAction(req, 'ACTUALIZACION_EVENTO', `Inscripción actualizada: ${result.registrarId} (DNI: ${result.dni})`);
  res.status(200).json(result);
});

exports.deleteEventRegistration = asyncHandler(async (req, res) => {
  const result = await eventService.deleteParticipant(req.params.registrarId);
  if (!result) {
    throw new AppError('Registro no encontrado para eliminar', 404);
  }
  res.status(200).json({ message: 'Registro eliminado correctamente' });
});

exports.markAttendance = asyncHandler(async (req, res) => {
  const { registrarId } = req.params;
  const { seRegistro } = req.body;

  if (typeof seRegistro !== 'boolean') {
    throw new AppError('El campo seRegistro debe ser un booleano', 400);
  }

  const updated = await eventService.updateAttendance(registrarId, seRegistro);

  await logAction(
    req,
    seRegistro ? 'ASISTENCIA_EVENTO' : 'CANCELACION_EVENTO',
    seRegistro
      ? `Asistencia marcada para ${registrarId}`
      : `Asistencia desmarcada para ${registrarId}`,
  );

  res.status(200).json(updated);
});
