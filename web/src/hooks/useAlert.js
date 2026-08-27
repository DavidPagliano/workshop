import { useState } from 'react';

export const useAlert = () => {
  // Estado local del hook
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success', 'error', 'warning', 'info'
  });

  const showAlert = (message, severity = 'success') => {
    setAlertConfig({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, open: false }));
  };

  return { alertConfig, showAlert, closeAlert };
};