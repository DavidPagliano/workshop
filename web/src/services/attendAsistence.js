import api from './api';

/**
 * Obtiene la lista completa de inscriptos para el control de asistencia.
 * (Puedes expandirlo para aceptar parámetros de paginación o filtros por evento)
 */
export const getAttendeesList = async () => {
  try {
    const response = await api.get('/workshop/event');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener la lista de asistencia' };
  }
};

/**
 * Actualiza el estado de asistencia de un participante.
 * @param {string} registrarId - El identificador público del registro.
 * @param {boolean} seRegistro - true si está presente, false si está ausente.
 */
export const markAttendance = async (registrarId, seRegistro) => {
  try {
    // Usamos PATCH porque solo modificaremos el flag de asistencia
    const response = await api.patch(`/workshop/event/${registrarId}/registrado`, {
       seRegistro: seRegistro,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al registrar la asistencia' };
  }
};