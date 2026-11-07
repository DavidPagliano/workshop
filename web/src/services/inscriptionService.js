import api from './api';

const BASE_URL = '/tsm2027/inscription';

// Crear (formulario público)
export const createInscription = async (inscriptionData) => {
  try {
    const response = await api.post(BASE_URL, inscriptionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión con el servidor' };
  }
};

// Ver o obtener todas las inscripciones
export const getInscriptions = async () => {
  try {
    const response = await api.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener las inscripciones' };
  }
};

// Obtener una inscripción por su inscriptionId
export const getInscriptionById = async (inscriptionId) => {
  try {
    const response = await api.get(`${BASE_URL}/${inscriptionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener la inscripción' };
  }
};

// Actualizar
export const updateInscription = async (inscriptionId, updatedData) => {
  try {
    const response = await api.put(`${BASE_URL}/${inscriptionId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar la inscripción' };
  }
};

// Eliminar
export const deleteInscription = async (inscriptionId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${inscriptionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar la inscripción' };
  }
};

