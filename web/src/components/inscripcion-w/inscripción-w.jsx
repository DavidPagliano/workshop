
import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Stack, Paper } from '@mui/material';

export default function InscripcionForm() {
  // Inicializamos el estado del formulario con campos vacíos [9]
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    comentarios: '',
  });

  const [errors, setErrors] = useState({});

  // Función genérica para actualizar el estado cuando el usuario escribe [8, 10]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Limpiar el error del campo cuando el usuario empieza a modificarlo de nuevo
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Validaciones del formulario antes de proceder con el envío
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.nombre.trim()) tempErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'El formato del correo electrónico no es válido.';
    }
    if (!formData.telefono.trim()) tempErrors.telefono = 'El teléfono es obligatorio.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Controlador del evento onSubmit [11]
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto de recargar la página en HTML [11]
    if (validateForm()) {
      console.log('Datos enviados correctamente:', formData);
      alert('¡Inscripción registrada!');
      
      // Aquí realizarías la llamada de red hacia tu API (carpeta api/)
      
      // Reinicio de los campos del formulario tras un envío exitoso [12]
      setFormData({ nombre: '', email: '', telefono: '', comentarios: '' });
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Paper nos da un contenedor estilizado con sombra al estilo Material Design [13] */}
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Formulario de Inscripción
        </Typography>
        
        {/* Box renderizado como elemento <form> de HTML [14] */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {/* Stack organiza verticalmente los inputs de MUI con espacios equilibrados [15] */}
          <Stack spacing={3}>
            <TextField
              label="Nombre Completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
              required
            />
            
            <TextField
              label="Correo Eléctronico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono}
              fullWidth
              required
            />
            
            <TextField
              label="Comentarios Adicionales"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ fontWeight: 'bold', mt: 2 }}
            >
              Enviar Inscripción
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

