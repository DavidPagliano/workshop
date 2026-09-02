// src/hooks/useAsistencia.js
import { useState, useEffect } from 'react';
import { getInscritosAPI, updateAsistenciaAPI } from '../services/asistenciaService';

export const useAsistencia = () => {
  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    setCargando(true);
    const datos = await getInscritosAPI();
    setParticipantes(datos);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const participantesFiltrados = participantes.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
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
    
    await updateAsistenciaAPI(id, nuevoEstado);

    setParticipantes((prev) =>
      prev.map((item) =>
        (item._id === id || item.registrarId === id)
          ? { ...item, seRegistro: nuevoEstado }
          : item
      )
    );

    if (usuarioSeleccionado && (usuarioSeleccionado._id === id || usuarioSeleccionado.registrarId === id)) {
      setUsuarioSeleccionado((prev) => ({ ...prev, seRegistro: nuevoEstado }));
    }

    // Si nuevoEstado es TRUE -> Asistencia confirmada
    // Si nuevoEstado es FALSE -> Asistencia anulada
    if (nuevoEstado) {
      setMensaje('✔ ¡REGISTRO EXITOSO! Asistencia confirmada.');
    } else {
      setMensaje('⚠️ Asistencia anulada. El participante figura como ausente.');
    }

    setTimeout(() => setMensaje(''), 4000);
  };

  return {
    busqueda,
    setBusqueda,
    participantesFiltrados,
    usuarioSeleccionado,
    handleSeleccionarUsuario,
    handleConfirmarAsistencia,
    mensaje,
    cargando
  };
};