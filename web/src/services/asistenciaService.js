// src/services/asistenciaService.js
import { obtenerParticipantesSimulados, patchSeRegistroSimulado } from '../utils/dbSimulator';

export const getInscritosAPI = async () => {
  return obtenerParticipantesSimulados();
};

export const updateAsistenciaAPI = async (registrarId, seRegistroValor) => {
  return patchSeRegistroSimulado(registrarId, seRegistroValor);
};