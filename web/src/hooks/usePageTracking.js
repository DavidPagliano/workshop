import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const handle = window.requestIdleCallback 
      ? window.requestIdleCallback(() => sendLog(location.pathname))
      : setTimeout(() => sendLog(location.pathname), 250);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, [location.pathname]);
};

const sendLog = (pathname) => {
  api.post('/workshop/audit/log', {
    accion: 'PAGE_VIEW',
    path: pathname,
    detalles: `Navegó a ${pathname}`
  }).catch(() => {});
};