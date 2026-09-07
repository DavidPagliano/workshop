


import { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  Card, 
  CardContent, 
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

// Lista de cursos disponibles para inscripción
const CURSOS_DISPONIBLES = [
  { value: 'react-basico', label: 'React desde Cero' },
  { value: 'mern-stack', label: 'Fullstack MERN (MongoDB, Express, React, Node)' },
  { value: 'material-ui', label: 'Diseño de Interfaces con Material UI' },
  { value: 'git-avanzado', label: 'Git y GitHub para Equipos' }
];

// ÚNICA exportación por defecto de la página
export default function InscripcionPage() {
  // 1. Declaración de Hooks (Estados locales internos)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    curso: '',
    comentarios: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // 2. Manejador dinámico de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // 3. Validación de seguridad en el cliente
  const validarFormulario = () => {
    const { nombre, email, curso } = formData;
    if (!nombre.trim() || !email.trim() || !curso) {
      setError('Todos los campos marcados con (*) son obligatorios.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    return true;
  };

  // 4. Manejador asíncrono para enviar datos con Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/inscripciones', formData);

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        // Limpiamos los campos tras el registro exitoso
        setFormData({
          nombre: '',
          email: '',
          curso: '',
          comentarios: ''
        });
      }
    } catch (err) {
      const mensajeError = err.response?.data?.message || 'Ocurrió un error al registrar la inscripción.';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // 5. El bloque RETURN del componente (Estrictamente dentro de la función)
  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
            Formulario de Inscripción
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Completa tus datos para registrarte en el taller seleccionado.
          </Typography>

          {/* Feedback interactivo mediante alertas Material UI */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Inscripción completada con éxito! Te hemos enviado un correo de confirmación.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
                variant="outlined"
              />

              <TextField
                required
                fullWidth
                type="email"
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                variant="outlined"
              />

              <TextField
                required
                fullWidth
                select
                label="Selecciona un Curso"
                name="curso"
                value={formData.curso}
                onChange={handleChange}
                disabled={loading}
                variant="outlined"
              >
                {CURSOS_DISPONIBLES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comentarios u Observaciones"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                disabled={loading}
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Inscribirme'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}