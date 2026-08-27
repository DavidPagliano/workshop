// src/pages/HomePage.jsx
import { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import EventCard from '../components/EventCard';
import { useAlert } from '../hooks/useAlert'; // Importamos nuestro hook

const HomePage = () => {
  // 1. Estado tradicional en la vista
  const [testClicks, setTestClicks] = useState(0);

  // 2. Consumiendo el Custom Hook
  const { alertConfig, showAlert, closeAlert } = useAlert();

  const handleTestClick = () => {
    setTestClicks(testClicks + 1);
    showAlert(`Has hecho clic ${testClicks + 1} veces`, 'info');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Portal de Eventos
      </Typography>

      {/* Botón de prueba para usar el estado local y el Hook de alerta */}
      <Button variant="outlined" onClick={handleTestClick} sx={{ mb: 3 }}>
        Probar Estado Global (Clics: {testClicks})
      </Button>

      <Box sx={{ display: 'flex' }}>
        {/* Usamos el componente y le decimos a qué ruta de React Router debe ir */}
        <EventCard 
          title="Evento General" 
          description="Inscripción para el próximo evento de la comunidad."
          routePath="/registro-evento" 
        />
        
        <EventCard 
          title="Pre-Ciclo 2027" 
          description="Aspirantes al ciclo terciario del próximo año."
          routePath="/pre-ciclo" 
        />
      </Box>

      {/* Renderizado de la alerta controlada por el Hook */}
      <Snackbar 
        open={alertConfig.open} 
        autoHideDuration={3000} 
        onClose={closeAlert}
      >
        <Alert severity={alertConfig.severity} onClose={closeAlert}>
          {alertConfig.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;