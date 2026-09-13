const eventService = require('../services/event.services');
const { logAction } = require('../utils/auditLogger');

exports.createEventRegistration = async (req, res) => {
  try {
    const result = await eventService.registerParticipant(req.body);
    await logAction(req, 'REGISTRO_EVENTO', `Inscripción creada: ${result.registrarId} (DNI: ${result.dni})`)
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000 || error.message.includes('ya se encuentra registrado')) {
      return res.status(409).json({ message: error.message });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos de registro inválidos' });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEventRegistrations = async (req, res) => {
  try {
    const filters = req.query.dni ? { dni: String(req.query.dni) } : {};
    const results = await eventService.getAllParticipants(filters);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getEventRegistrationByRegistrarId = async (req, res) => {
  try {
    const result = await eventService.getParticipantByRegistrarId(req.params.registrarId);
    if (!result) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateEventRegistration = async (req, res) => {
  try {
    const result = await eventService.updateParticipant(req.params.registrarId, req.body);
    if (!result) {
        return res.status(404).json({ message: 'Registro no encontrado  para actualizar' });
    }
    await logAction(req, 'ACTUALIZACION_EVENTO', `Inscripción actualizada: ${result.registrarId} (DNI: ${result.dni})`)
    res.status(200).json(result);
  } catch(error) {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}   

exports.deleteEventRegistration = async (req, res) => {
  try {
    const result = await eventService.deleteParticipant(req.params.registrarId);
    if (!result) {
      return res.status(404).json({ message: 'Registro no encontrado para eliminar' });
    }
    res.status(200).json({ message: 'Registro eliminado correctamente' });
  } catch(error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

exports.markAttendance = async (req, res) => {
  try {
    const { registrarId } = req.params;
    const { seRegistro } = req.body;

    if (typeof seRegistro !== 'boolean') {
      return res.status(400).json({ message: 'El campo attended debe ser un booleano' });
    }

    const updated = await eventService.updateAttendance(registrarId, seRegistro);
    if (seRegistro) {
      await logAction(req, 'ASISTENCIA_EVENTO', `Asistencia marcada para ${registrarId}`);
    } else {
      await logAction(req, 'CANCELACION_EVENTO', `Asistencia desmarcada para ${registrarId}`);
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};