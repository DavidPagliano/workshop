const Counter = require('../models/Counter');
const EventRegistration = require('../models/EventRegistration');

// Genera el próximo registrarId secuencial (W-001, W-002, ...)
const generateRegistrarId = async () => {
  // Si el contador no existe aún, inicializarlo con el máximo actual de la colección
  const existing = await Counter.findById('event_seq');
  if (!existing) {
    const lastDoc = await EventRegistration.findOne()
      .sort({ registrarId: -1 })
      .select('registrarId')
      .lean();
    const currentMax = lastDoc?.registrarId
      ? parseInt(lastDoc.registrarId.split('-').pop(), 10) || 0
      : 0;
    await Counter.findByIdAndUpdate(
      'event_seq',
      { $setOnInsert: { seq: currentMax } },
      { upsert: true }
    );
  }

  const counter = await Counter.findByIdAndUpdate(
    'event_seq',
    { $inc: { seq: 1 } },
    { returnDocument: 'after' }
  );
  return `W-${String(counter.seq).padStart(3, '0')}`;
};

exports.registerParticipant = async (data) => {
  // Generar registrarId en el servidor
  data.registrarId = await generateRegistrarId();

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
  return await EventRegistration.findOneAndUpdate(
    { registrarId },
    { $set: data },
    { returnDocument: 'after', runValidators: true, context: 'query' }
  );
};

exports.deleteParticipant = async (registrarId) => {
  return await EventRegistration.findOneAndDelete({ registrarId });
};

// Marcar asistencia
exports.updateAttendance = async (registrarId, seRegistro) => {
  const updatedRegistration = await EventRegistration.findOneAndUpdate(
    { registrarId },
    { seRegistro: seRegistro },
    { returnDocument: 'after' }
  );

  if (!updatedRegistration) {
    throw new Error('Registro no encontrado');
  }

  return updatedRegistration;
};

