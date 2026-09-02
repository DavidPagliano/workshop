// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate(); // ← AQUÍ ES DONDE DEBE IR

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        ¿No estás en la lista? Registrate ahora mismo en el evento.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/registro')}
      >
        REGISTRARME
      </Button>
    </Box>
  );
};

export default HomePage;