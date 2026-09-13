const coPreCycleRegistration = require('../models/preCycleRegistration');

// Genera el próximo registrarId secuencial (pcr-001, pcr-002, ...)
const generateRegistrarId = async () => {
  const lastDoc = await coPreCycleRegistration.findOne().sort({ creado: -1 }).select('registrarId').lean();
  if (!lastDoc || !lastDoc.registrarId) return 'pcr-001';
  const num = parseInt(lastDoc.registrarId.split('-').pop(), 10);
  const nextNum = isNaN(num) ? 1 : num + 1;
  return `pcr-${String(nextNum).padStart(3, '0')}`;
};

exports.registerAspirant = async (data) => {
  // Generar registrarId en el servidor
  data.registrarId = await generateRegistrarId();

  const existingAspirant = await coPreCycleRegistration.findOne({ dni: data.dni });

  if (existingAspirant) {
    throw new Error('El aspirante ya tiene una pre-inscripción registrada');
  }

  const newAspirant = new coPreCycleRegistration(data);
  return await newAspirant.save();
};

exports.getAllAspirants = async () => {
  return await coPreCycleRegistration.find();
};

exports.getAspirantByRegistrarId = async (registrarId) => {
  return await coPreCycleRegistration.findOne({ registrarId });
};

exports.updateAspirant = async (registrarId, data) => {
  return await coPreCycleRegistration.findOneAndUpdate(
    { registrarId },
    { $set: data },
    { new: true, runValidators: true, context: 'query' }
  );
};

exports.deleteAspirant = async (registrarId) => {
  return await coPreCycleRegistration.findOneAndDelete({ registrarId });
};