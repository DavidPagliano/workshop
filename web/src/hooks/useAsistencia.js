import { useState, useEffect } from 'react';
import { getInscritosAPI, updateAsistenciaAPI } from '../services/asistenciaService';

export const useAsistencia = () => {
  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
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
  };

  useEffect(() => {
    void Promise.resolve().then(cargarDatos);
  }, []);

  const participantesFiltrados = participantes.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
      (p.registrarId && p.registrarId.toLowerCase().includes(term)) ||
      (p.dni && p.dni.includes(term)) ||
      (p.nombre && p.nombre.toLowerCase().includes(term)) ||
      (p.apellido && p.apellido.toLowerCase().includes(term))
    );
  });

  const handleSeleccionarUsuario = (p) => {
    setUsuarioSeleccionado(p);
  };

  // ACÁ ESTÁ EL FIX DEL MENSAJE 
  const handleConfirmarAsistencia = async (id, estadoActual) => {
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

      if (usuarioSeleccionado && (usuarioSeleccionado._id === id || usuarioSeleccionado.registrarId === id)) {
        setUsuarioSeleccionado((prev) => ({ ...prev, ...participanteActualizado }));
      }

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
  };

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