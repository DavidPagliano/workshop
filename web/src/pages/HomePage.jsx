import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h3" align="center" gutterBottom color="primary">
        Portal de Eventos y Pre-Inscripciones
      </Typography>

      <Stack spacing={4} sx={{ mt: 4 }}>
        {/* Sección de Registro a Eventos (Original) */}
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Inscripción a Eventos
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿No estás en la lista? Registrate ahora mismo en el evento.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/registro')}
          >
            REGISTRARME
          </Button>
        </Paper>

        {/* Sección Pre-Ciclo 2027 */}
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Pre-Ciclo 2027
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aspirantes al ciclo terciario del próximo año. Realiza tu pre-inscripción online.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            onClick={() => navigate('/pre-ciclo')}
          >
            PRE-INSCRIBIRME
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
};

export default HomePage;