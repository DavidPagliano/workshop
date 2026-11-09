const Counter = require('../models/Counter');
const EventRegistration = require('../models/EventRegistration');
const AppError = require('../utils/AppError');

// Genera el próximo registrarId secuencial (W-001, W-002, ...)
const generateRegistrarId = async () => {
  const lastDoc = await EventRegistration.findOne()
    .sort({ creado: -1 })
    .select('registrarId')
    .lean();
  const currentMax = lastDoc?.registrarId
    ? parseInt(lastDoc.registrarId.split('-').pop(), 10) || 0
    : 0;

  await Counter.findByIdAndUpdate(
    'event_seq',
    { $set: { seq: currentMax } },
    { upsert: true }
  );

  const counter = await Counter.findByIdAndUpdate(
    'event_seq',
    { $inc: { seq: 1 } },
    { returnDocument: 'after' }
  );
  return `W-${String(counter.seq).padStart(3, '0')}`;
};

exports.registerParticipant = async (data) => {
  // Validación de negocio: Verificar si el DNI ya está registrado antes de tocar el contador
  const existingUser = await EventRegistration.findOne({ dni: data.dni });

  if (existingUser) {
    throw new AppError('El documento ya se encuentra registrado en el evento', 409);
  }

  const newRegistration = new EventRegistration(data);
  await newRegistration.validate(
    Object.keys(EventRegistration.schema.paths).filter((path) => path !== 'registrarId')
  );

  newRegistration.registrarId = await generateRegistrarId();

  try {
    return await newRegistration.save();
  } catch (error) {
    await Counter.findByIdAndUpdate('event_seq', { $inc: { seq: -1 } });
    throw error;
  }
};

exports.getAllParticipants = async (filters = {}) => {
  return await EventRegistration.find(filters).sort({ creado: -1 });
};

exports.getParticipantsPage = async (filters = {}, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    EventRegistration.find(filters).sort({ creado: -1 }).skip(skip).limit(limit),
    EventRegistration.countDocuments(filters),
  ]);

  return {
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
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
    throw new AppError('Registro no encontrado', 404);
  }

  return updatedRegistration;
};
