const EventRegistration = require('../models/EventRegistration');

exports.registerParticipant = async (data) => {
  // Validación de negocio: Verificar si el DNI ya está registrado
  const existingUser = await EventRegistration.findOne({ documentId: data.dni });
  
  if (existingUser) {
    throw new Error('El documento ya se encuentra registrado en el evento');
  }

  const newRegistration = new EventRegistration(data);
  return await newRegistration.save();
};

exports.getAllParticipants = async () => {
  return await EventRegistration.find().sort({ createdAt: -1 });
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
