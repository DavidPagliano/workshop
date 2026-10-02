const Counter = require('../models/Counter');
const coPreCycleRegistration = require('../models/preCycleRegistration');
const AppError = require('../utils/AppError');

// Genera el próximo registrarId secuencial (pcr-001, pcr-002, ...)
const generateRegistrarId = async () => {
  // Si el contador no existe aún, inicializarlo con el máximo actual de la colección
  const existing = await Counter.findById('cycle_seq');
  if (!existing) {
    // Se ordena por fecha de creación (no por registrarId, cuyo orden
    // lexicográfico se rompería pasando pcr-999) para tomar el mayor secuencial.
    const lastDoc = await coPreCycleRegistration.findOne()
      .sort({ creado: -1 })
      .select('registrarId')
      .lean();
    const currentMax = lastDoc?.registrarId
      ? parseInt(lastDoc.registrarId.split('-').pop(), 10) || 0
      : 0;
    await Counter.findByIdAndUpdate(
      'cycle_seq',
      { $setOnInsert: { seq: currentMax } },
      { upsert: true }
    );
  }

  const counter = await Counter.findByIdAndUpdate(
    'cycle_seq',
    { $inc: { seq: 1 } },
    { returnDocument: 'after' }
  );
  return `pcr-${String(counter.seq).padStart(3, '0')}`;
};

exports.registerAspirant = async (data) => {
  // Generar registrarId en el servidor
  data.registrarId = await generateRegistrarId();

  const existingAspirant = await coPreCycleRegistration.findOne({ dni: data.dni });

  if (existingAspirant) {
    throw new AppError('El aspirante ya tiene una pre-inscripción registrada', 409);
  }

  const newAspirant = new coPreCycleRegistration(data);
  return await newAspirant.save();
};

exports.getAllAspirants = async () => {
  return await coPreCycleRegistration.find().sort({ creado: -1 });
};

exports.getAspirantsPage = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    coPreCycleRegistration.find().sort({ creado: -1 }).skip(skip).limit(limit),
    coPreCycleRegistration.countDocuments(),
  ]);

  return {
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

exports.getAspirantByRegistrarId = async (registrarId) => {
  return await coPreCycleRegistration.findOne({ registrarId });
};

exports.updateAspirant = async (registrarId, data) => {
  return await coPreCycleRegistration.findOneAndUpdate(
    { registrarId },
    { $set: data },
    { returnDocument: 'after', runValidators: true, context: 'query' }
  );
};

exports.deleteAspirant = async (registrarId) => {
  return await coPreCycleRegistration.findOneAndDelete({ registrarId });
};