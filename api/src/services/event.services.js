const EventRegistration = require('../models/EventRegistration');

exports.registerParticipant = async (data) => {
  // Validación de negocio: Verificar si el DNI ya está registrado
  const existingUser = await EventRegistration.findOne({ dni: data.dni });
  
  if (existingUser) {
    throw new Error('El documento ya se encuentra registrado en el evento');
  }

  const newRegistration = new EventRegistration(data);
  return await newRegistration.save();
};

exports.getAllParticipants = async (filters = {}) => {
  return await EventRegistration.find(filters).sort({ createdAt: -1 });
};

exports.getParticipantById = async (id) => {
  return await EventRegistration.findById(id);
};

exports.updateParticipant = async (id, data) => {
  return await EventRegistration.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteParticipant = async (id) => {
  return await EventRegistration.findByIdAndDelete(id);
};

// Marcar asistencia
exports.updateAttendance = async (id, seRegistro) => {
  const updatedRegistration = await EventRegistration.findByIdAndUpdate(
    id,
    { seRegistro: seRegistro },
    { new: true }
  );

  if (!updatedRegistration) {
    throw new Error('Registro no encontrado');
  }

  return updatedRegistration;
};

// Busqueda por DNI
exports.getAllEventRegistrations = async (req, res) => {
  try {
    // Si mandan ?dni=123 desde el frontend, lo pasamos como filtro
    const filters = req.query.dni ? { dni: req.query.dni } : {};
    
    const results = await getAllParticipants(filters);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};