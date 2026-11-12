import api from './api';

export const createInscriptionService = (baseUrl) => ({
  // Crear (formulario público)
  createInscription: async (inscriptionData) => {
    try {
      const response = await api.post(baseUrl, inscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión con el servidor' };
    }
  },

  // Ver o obtener todas las inscripciones
  getInscriptions: async () => {
    try {
      const response = await api.get(baseUrl);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener las inscripciones' };
    }
  },

  // Obtener una inscripción por su inscriptionId
  getInscriptionById: async (inscriptionId) => {
    try {
      const response = await api.get(`${baseUrl}/${inscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la inscripción' };
    }
  },

  // Actualizar
  updateInscription: async (inscriptionId, updatedData) => {
    try {
      const response = await api.put(`${baseUrl}/${inscriptionId}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la inscripción' };
    }
  },

  // Eliminar
  deleteInscription: async (inscriptionId) => {
    try {
      const response = await api.delete(`${baseUrl}/${inscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar la inscripción' };
    }
  },
});
