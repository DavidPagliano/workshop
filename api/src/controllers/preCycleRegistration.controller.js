const cycleServices = require('../services/preCycle.services');

exports.registerAspirant = async (req, res) => {
  try {
    const result = await cycleServices.registerAspirant(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAspirants = async (req, res) => {
  try {
    const results = await cycleServices.getAllAspirants();
    res.status(200).json(results);
  }
  catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getAspirantByRegistrarId = async (req, res) => {
  try {
    const result = await cycleServices.getAspirantByRegistrarId(req.params.registrarId);
    if (!result) {
      return res.status(404).json({ message: 'Aspirante no encontrado' });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

exports.updateAspirant = async (req, res) => {
  try {
    const result = await cycleServices.updateAspirant(req.params.registrarId, req.body);
    if (!result) {
      return res.status(404).json({ message: 'Aspirante no encontrado para actualizar' });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }

}

exports.deleteAspirant = async (req, res) => {
  try {
    const result = await cycleServices.deleteAspirant(req.params.registrarId);
    if(!result) {
      return res.status(404).json({ message: 'Aspirante no encontrado para eliminar' });
    }
    res.status(200).json({ message: 'Aspirante eliminado correctamente' });
  } catch(error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }   
}