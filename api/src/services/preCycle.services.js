const coPreCycleRegistration = require('../models/PreCycleRegistration');

exports.registerAspirant = async (data) => {
  const existingAspirant = await PreCycleRegistration.findOne({ dni: data.dni });
  
  if (existingAspirant) {
    throw new Error('El aspirante ya tiene una pre-inscripción registrada');
  }

  const newAspirant = new PreCycleRegistration(data);
  return await newAspirant.save();
};

exports.getAllAspirants = async () => {
  return await PreCycleRegistration.find();
};

exports.getAspirantById = async (id) => {
  return await PreCycleRegistration.findById(id);
};

exports.updateAspirant = async (id, data) => {
  return await PreCycleRegistration.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteAspirant = async (id) => {
  return await PreCycleRegistration.findByIdAndDelete(id);
};