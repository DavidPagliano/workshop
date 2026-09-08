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

// ─── Assets ──────────────────────────────────────────────────────────
import bgGrid from "../../assets/images/fondo/FONDO3.png";

// Lista de cursos disponibles para inscripción
const CURSOS_DISPONIBLES = [
  { value: 'react-basico', label: 'React desde Cero' },
  { value: 'mern-stack', label: 'Fullstack MERN (MongoDB, Express, React, Node)' },
  { value: 'material-ui', label: 'Diseño de Interfaces con Material UI' },
  { value: 'git-avanzado', label: 'Git y GitHub para Equipos' }
];

// ─── Componente decorativo de esquinas (Cuadraditos azules) ────────────
const CornerDots = ({ size = 8, offset = -5, color = "#00B4FF" }) => {
  const positions = [
    { top: offset, left: offset },
    { top: offset, right: offset },
    { bottom: offset, left: offset },
    { bottom: offset, right: offset },
  ];
  return positions.map((pos, i) => (
    <Box
      key={i}
      sx={{
        position: "absolute",
        width: size,
        height: size,
        bgcolor: color,
        ...pos,
      }}
    />
  ));
};

// Estilo para adaptar los TextFields al tema oscuro
const textFieldDarkStyle = {
  '& .MuiOutlinedInput-root': {
    color: '#FFFFFF',
    '& fieldset': {
      borderColor: 'rgba(0, 180, 255, 0.4)',
    },
    '&:hover fieldset': {
      borderColor: '#00B4FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00B4FF',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#00B4FF',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#00B4FF',
  },
  '& .MuiSvgIcon-root': {
    color: '#00B4FF',
  },
};

// ÚNICA exportación por defecto de la página
export default function InscripcionPage() {
  // 1. Declaración de Hooks
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

  // 5. Render del componente
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${bgGrid})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: { xs: "cover", md: "auto" },
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 6, sm: 8, md: 10 },
        px: { xs: 1, sm: 0 },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Card 
          sx={{ 
            bgcolor: "#03083B", 
            border: "2px solid #00B4FF", 
            boxShadow: { xs: "4px 4px 0px #D500BA", sm: "6px 6px 0px #D500BA" },
            borderRadius: 0,
            position: "relative"
          }}
        >
          <CornerDots />

          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center" 
              fontWeight="800" 
              sx={{ 
                color: "#00B4FF", 
                textTransform: "uppercase", 
                letterSpacing: "-0.01em",
                fontFamily: "'Neue Haas Grotesk', sans-serif"
              }}
            >
              Formulario de Inscripción
            </Typography>

            <Typography 
              variant="body2" 
              align="center" 
              sx={{ mb: 3, color: "#FFFFFF", opacity: 0.85 }}
            >
              Completa tus datos para registrarte en el taller seleccionado.
            </Typography>

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
                  sx={textFieldDarkStyle}
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
                  sx={textFieldDarkStyle}
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
                  sx={textFieldDarkStyle}
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
                  sx={textFieldDarkStyle}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5, 
                    fontWeight: 'bold',
                    background: "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
                    color: "#FFFFFF",
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    "&:hover": {
                      opacity: 0.9,
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Inscribirme'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}