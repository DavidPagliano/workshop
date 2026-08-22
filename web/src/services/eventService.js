import api from './api';

export const registerToEvent = async (registrationData) => {
  try {
    const response = await api.post('/events', registrationData);
    return response.data;
  } catch (error) {
    // Extraemos el mensaje de error del backend (lanzado por Zod o el Servicio)
    throw error.response?.data || { message: 'Error de conexión con el servidor' };
  }
};

export const getEventRegistrations = async () => {
  try {
    const response = await api.get('/workshop/event');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener los registros' };
  }
};

export const updateEventRegistration = async (id, updatedData) => {
  try {
    // Apuntamos al endpoint dinámico: /events/:id
    const response = await api.put(`/workshop/event/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar el registro' };
  }
};

export const deleteEventRegistration = async (id) => {
  try {
    const response = await api.delete(`/workshop/event/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar el registro' };
  }
};