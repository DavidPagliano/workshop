const cycleServices = require('../services/preCycle.services');
const { logAction } = require('../utils/auditLogger');

exports.registerAspirant = async (req, res) => {
  try {
    const result = await cycleServices.registerAspirant(req.body);
    await logAction(req, 'REGISTRO_PRECICLO', `Inscripción creada: ${result.registrarId} (DNI: ${result.dni})`)
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000 || error.message.includes('ya tiene una pre-inscripción')) {
      return res.status(409).json({ message: error.message });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos de pre-inscripción inválidos' });
    }
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
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

exports.updateAspirant = async (req, res) => {
  try {
    const result = await cycleServices.updateAspirant(req.params.registrarId, req.body);
    if (!result) {
      return res.status(404).json({ message: 'Aspirante no encontrado para actualizar' });
    }
    await logAction(req, 'ACTUALIZACION_PRECICLO', `Inscripción actualizada: ${result.registrarId} (DNI: ${result.dni})`)
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
    await logAction(req, 'ELIMINACION_PRECICLO', `Inscripción eliminada: ${result.registrarId} (DNI: ${result.dni})`)
    res.status(200).json({ message: 'Aspirante eliminado correctamente' });
  } catch(error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }   
}