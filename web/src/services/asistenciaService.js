import { getAttendeesList, markAttendance } from './attendAsistence';

const normalizarParticipante = (participante) => ({
  ...participante,
  celular: participante.celular ?? participante.telefono,
  temasInteres: participante.temasInteres ?? (
    participante.temas ? [participante.temas] : []
  ),
});

export const getInscritosAPI = async () => {
  const participantes = await getAttendeesList();
  return Array.isArray(participantes)
    ? participantes.map(normalizarParticipante)
    : [];
};

export const updateAsistenciaAPI = async (registrarId, seRegistroValor) => {
  const participanteActualizado = await markAttendance(
    registrarId,
    seRegistroValor,
  );
  return normalizarParticipante(participanteActualizado);
};