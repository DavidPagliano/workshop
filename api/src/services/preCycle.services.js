const coPreCycleRegistration = require('../models/coPreCycleRegistration');

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

exports.getAspirantById = async (id) => {
  return await coPreCycleRegistration.findById(id);
};

exports.updateAspirant = async (id, data) => {
  return await coPreCycleRegistration.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteAspirant = async (id) => {
  return await coPreCycleRegistration.findByIdAndDelete(id);
};