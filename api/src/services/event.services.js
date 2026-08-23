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
  return await EventRegistration.find(filters).sort({ creado: -1 });
};

exports.getParticipantByRegistrarId = async (registrarId) => {
  return await EventRegistration.findOne({ registrarId });
};

exports.updateParticipant = async (registrarId, data) => {
  return await EventRegistration.findOneAndUpdate({ registrarId }, data, { new: true });
};

exports.deleteParticipant = async (registrarId) => {
  return await EventRegistration.findOneAndDelete({ registrarId });
};

// Marcar asistencia
exports.updateAttendance = async (registrarId, seRegistro) => {
  const updatedRegistration = await EventRegistration.findOneAndUpdate(
    { registrarId },
    { seRegistro: seRegistro },
    { new: true }
  );

  if (!updatedRegistration) {
    throw new Error('Registro no encontrado');
  }

  return updatedRegistration;
};

