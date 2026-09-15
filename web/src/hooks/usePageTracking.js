import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Envía el log en cada cambio de ruta sin bloquear la UI
    api.post('/workshop/audit/log', {
      accion: 'PAGE_VIEW',
      path: location.pathname,
      detalles: `Navegó a ${location.pathname}`
    }).catch((err) => console.debug('Audit log skipped:', err.message));
  }, [location]);
};