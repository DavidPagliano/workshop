import React from 'react';
import { Box, Paper } from '@mui/material';

// BrowserWindow es un componente de presentación (recibe props y renderiza diseño)
export default function BrowserWindow({ children }) {
  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #ccc', my: 2 }}>
      
      {/* 1. Barra de direcciones superior simulada */}
      <Box sx={{ bgcolor: '#e0e0e0', p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Botones de control del navegador (Rojo, Amarillo, Verde) */}
        <Box sx={{ display: 'flex', gap: 0.8, mr: 2 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
        </Box>
        
        {/* Input de URL que simula el endpoint de la API del profesor */}
        <Box sx={{ 
          bgcolor: 'white', 
          flexGrow: 1, 
          borderRadius: 1.5, 
          px: 2, 
          py: 0.5, 
          fontSize: '0.85rem', 
          color: 'text.secondary',
          fontFamily: 'monospace',
          border: '1px solid #dcdcdc'
        }}>
          http://base-datos.multimediaday2026.e3/workshop/event
        </Box>
      </Box>
      
      {/* 2. Cuerpo dinámico de la pestaña donde se inyecta el contenido */}
      <Box sx={{ p: 4, bgcolor: '#fafafa' }}>
        {children}
      </Box>
    </Paper>
  );
}