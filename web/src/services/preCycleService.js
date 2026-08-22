import api from './api';

// Crear
export const registerToPreCycle = async (preCycleData) => {
  try {
    const response = await api.post('/workshop/cycle', preCycleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión con el servidor' };
  }
};

// Ver o obtener a todos los registros
export const getPreCycleRegistrations = async () => {
  try {
    const response = await api.get('/workshop/cycle');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener las pre-inscripciones' };
  }
};

// Actualizar
export const updatePreCycleRegistration = async (id, updatedData) => {
  try {
    const response = await api.put(`/workshop/cycle/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar la pre-inscripción' };
  }
};

// Eliminar
export const deletePreCycleRegistration = async (id) => {
  try {
    const response = await api.delete(`/workshop/cycle/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar la pre-inscripción' };
  }
};