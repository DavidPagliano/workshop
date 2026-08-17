const eventService = require('../services/event.services');

exports.createEventRegistration = async (req, res) => {
  try {
    const result = await eventService.registerParticipant(req.body);
    res.status(201).json(result);
  } catch (error) {
    // Captura los errores lanzados por el servicio (ej. DNI duplicado)
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEventRegistrations = async (req, res) => {
  try {
    const results = await eventService.getAllParticipants();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getEventRegistrationById = async (req, res) => {
  try {
    const result = await eventService.getParticipantById(req.params.id);
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
    const result = await eventService.updateParticipant(req.params.id, req.body);
        if (!result) {
            return res.status(404).json({ message: 'Registro no encontrado  para actualizar' });
        }
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}   

exports.deleteEventRegistration = async (req, res) => {
    try {
        const result = await eventService.deleteParticipant(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Registro no encontrado para eliminar' });
        }
        res.status(200).json({ message: 'Registro eliminado correctamente' });
    } catch(error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}