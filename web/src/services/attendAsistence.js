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
 * Busca un participante específico por su DNI o Pasaporte.
 * Muy útil para un buscador rápido en la entrada del evento.
 */
export const searchAttendeeByDni = async (dni) => {
  try {
    // Asumimos que en el backend agregaremos un query param para filtrar
    const response = await api.get(`/workshop/event?dni=${dni}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al buscar el participante' };
  }
};

/**
 * Actualiza el estado de asistencia de un participante.
 * @param {string} id - El ID de MongoDB del registro.
 * @param {boolean} seRegistro - true si está presente, false si está ausente.
 */
export const markAttendance = async (id, seRegistro) => {
  try {
    // Usamos PATCH porque solo modificaremos el flag de asistencia
    const response = await api.patch(`/workshop/event/${id}/registrado`, {
      attended: seRegistro,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al registrar la asistencia' };
  }
};