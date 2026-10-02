import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { getInscritosAPI, updateAsistenciaAPI } from '../services/asistenciaService';

export const useAsistencia = () => {
  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await getInscritosAPI();
      setParticipantes(datos);
    } catch (requestError) {
      setParticipantes([]);
      setError(requestError.message || 'No se pudo cargar la lista de asistencia.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(cargarDatos);
  }, [cargarDatos]);

  // El input responde al instante; el filtrado se difiere para no bloquear
  // el tipeo cuando la lista es grande.
  const busquedaDiferida = useDeferredValue(busqueda);

  const participantesFiltrados = useMemo(() => {
    const term = busquedaDiferida.trim().toLowerCase();
    if (!term) return participantes;
    return participantes.filter((p) => (
      (p.registrarId && p.registrarId.toLowerCase().includes(term)) ||
      (p.dni && p.dni.includes(term)) ||
      (p.nombre && p.nombre.toLowerCase().includes(term)) ||
      (p.apellido && p.apellido.toLowerCase().includes(term))
    ));
  }, [participantes, busquedaDiferida]);

  const handleSeleccionarUsuario = useCallback((p) => {
    setUsuarioSeleccionado(p);
  }, []);

  const handleConfirmarAsistencia = useCallback(async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      const participanteActualizado = await updateAsistenciaAPI(id, nuevoEstado);

      setParticipantes((prev) =>
        prev.map((item) =>
          (item._id === id || item.registrarId === id)
            ? { ...item, ...participanteActualizado }
            : item
        )
      );

      setUsuarioSeleccionado((prev) =>
        prev && (prev._id === id || prev.registrarId === id)
          ? { ...prev, ...participanteActualizado }
          : prev
      );

      // Si nuevoEstado es TRUE -> Asistencia confirmada
      // Si nuevoEstado es FALSE -> Asistencia anulada
      if (nuevoEstado) {
        setMensaje('✔ ¡REGISTRO EXITOSO! Asistencia confirmada.');
      } else {
        setMensaje('⚠️ Asistencia anulada. El participante figura como ausente.');
      }

      setError('');
      setTimeout(() => setMensaje(''), 4000);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar la asistencia.');
    }
  }, []);

  return {
    busqueda,
    setBusqueda,
    participantesFiltrados,
    usuarioSeleccionado,
    handleSeleccionarUsuario,
    handleConfirmarAsistencia,
    mensaje,
    error,
    cargando
  };
};
