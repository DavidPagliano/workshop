import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Fade
} from '@mui/material';
import toast from 'react-hot-toast';
import { registerToPreCycle, getPreCycleRegistrations } from '../../services/preCycleService';

const formatRegistrarId = (num) => {
  return String(num).padStart(4, '0');
};

export const CyclePreinscriptionPage = () => {
  const [formData, setFormData] = useState({
    registrarId: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    fechaNacimiento: ''
  });

  const [loading, setLoading] = useState(false);
  const [showFields, setShowFields] = useState(false);

  useEffect(() => {
    setShowFields(true);
    fetchNextRegistrarId();
  }, []);

  const fetchNextRegistrarId = async () => {
    try {
      const registrations = await getPreCycleRegistrations();
      let nextNum = 1;

      if (Array.isArray(registrations) && registrations.length > 0) {
        const numericIds = registrations
          .map((reg) => parseInt(reg.registrarId, 10))
          .filter((id) => !isNaN(id));

        if (numericIds.length > 0) {
          nextNum = Math.max(...numericIds) + 1;
        } else {
          nextNum = registrations.length + 1;
        }
      }

      const generatedId = formatRegistrarId(nextNum);

      setFormData((prev) => ({
        ...prev,
        registrarId: generatedId
      }));
    } catch (error) {
      console.error('Error al generar el ID:', error);
      setFormData((prev) => ({
        ...prev,
        registrarId: formatRegistrarId(1)
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento
          ? new Date(formData.fechaNacimiento).toISOString()
          : undefined
      };

      await registerToPreCycle(payload);
      toast.success('Pre-inscripción completada con éxito');

      setFormData({
        registrarId: '',
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        email: '',
        fechaNacimiento: ''
      });

      await fetchNextRegistrarId();
    } catch (error) {
      console.error(error);
      const errorMsg = error?.message || 'Error al procesar la pre-inscripción';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Orden vertical de campos (uno debajo de otro)
  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, delay: 100 },
    { name: 'apellido', label: 'Apellido', type: 'text', required: true, delay: 200 },
    { name: 'dni', label: 'DNI / Documento', type: 'text', required: true, delay: 300 },
    { name: 'telefono', label: 'Teléfono de Contacto', type: 'text', required: false, delay: 400 },
    { name: 'email', label: 'Correo Electrónico', type: 'email', required: true, delay: 500 },
    { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', required: false, delay: 600, shrink: true }
  ];

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Pre-inscripción al Ciclo 2027
        </Typography>
        
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 4 }}>
          Ingresa tus datos a continuación para registrar tu pre-inscripción.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            {fields.map((field) => (
              /* xs={12} asegura que cada campo ocupe el 100% del ancho (1 columna) */
              <Grid item xs={12} key={field.name}>
                <Fade in={showFields} timeout={field.delay + 300} style={{ transitionDelay: `${field.delay}ms` }}>
                  <TextField
                    required={field.required}
                    fullWidth
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    InputLabelProps={field.shrink ? { shrink: true } : undefined}
                  />
                </Fade>
              </Grid>
            ))}

            {/* Botón de envío al final de la columna */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Fade in={showFields} timeout={1000} style={{ transitionDelay: '700ms' }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.registrarId}
                >
                  {loading ? 'Registrando...' : 'Completar Pre-inscripción'}
                </Button>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};