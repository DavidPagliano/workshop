import React from 'react';
import { TextField, Button, Box, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText, Alert } from '@mui/material';

export function FormularioRegistro({ 
  formData, 
  handleChange, 
  handleCheckboxChange, 
  verificarDniDuplicado, 
  onSubmit, 
  loading,
  warning 
}) {
  
  // Lista de temas del Multimedia Day 2026
  const temasDisponibles = [
    'Fotografía',
    'Video',
    'Inteligencia Artificial',
    'Diseño Gráfico',
    'Marketing',
    'Otros temas relacionados a la carrera' // Opción flexible para la carrera
  ];

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Alerta de DNI Duplicado en tiempo real */}
      {warning && (
        <Alert severity="warning" sx={{ mb: 1, fontWeight: 'medium' }}>
          {warning}
        </Alert>
      )}

      <TextField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        fullWidth
      />
      
      <TextField
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="DNI"
        name="dni"
        placeholder="Ej: 12345678"
        value={formData.dni}
        onChange={handleChange}
        // Ejecuta la consulta a la base de datos inmediatamente al salir del input
        onBlur={() => verificarDniDuplicado(formData.dni)} 
        required
        fullWidth
        helperText="Se utilizará tu documento para acreditar tu ingreso en la entrada del evento."
      />

      <TextField
        label="Celular / Teléfono"
        name="celular"
        placeholder="Ej: 1123456789"
        value={formData.celular}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="ejemplo@correo.com"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
      />
      
      {/* Grupo de Selección Múltiple (Checkboxes) */}
      <Box sx={{ mt: 1, mb: 1 }}>
        <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
          Temas de Interés (Selecciona uno o varios) *
        </FormLabel>
        <FormGroup>
          {temasDisponibles.map((tema) => (
            <FormControlLabel
              key={tema}
              control={
                <Checkbox
                  checked={formData.temasInteres.includes(tema)} // Verifica si está en el Array del Hook
                  onChange={() => handleCheckboxChange(tema)} // Lo agrega o quita
                  color="primary"
                />
              }
              label={tema}
            />
          ))}
        </FormGroup>
        <FormHelperText>Elige todas las opciones que te llamen la atención.</FormHelperText>
      </Box>
      
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        // Se deshabilita si está procesando la petición o si el DNI ya está registrado en la BD
        disabled={loading || !!warning} 
        size="large"
        sx={{ mt: 1, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
      >
        {loading ? 'Procesando registro...' : 'Confirmar e Inscribirme'}
      </Button>
    </Box>
  );
}
