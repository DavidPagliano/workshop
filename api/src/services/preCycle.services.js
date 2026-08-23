const coPreCycleRegistration = require('../models/preCycleRegistration');

exports.registerAspirant = async (data) => {
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
  return await coPreCycleRegistration.findOneAndUpdate({ registrarId }, data, { new: true });
};

exports.deleteAspirant = async (registrarId) => {
  return await coPreCycleRegistration.findOneAndDelete({ registrarId });
};