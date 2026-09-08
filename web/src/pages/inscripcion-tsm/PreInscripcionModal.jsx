import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Estilos extraídos fuera del componente para evitar recrearlos en cada render
const INPUT_STYLE = {
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': { borderColor: '#00e5ff' },
    '&:hover fieldset': { borderColor: '#00b4ff' },
    '&.Mui-focused fieldset': { borderColor: '#00e5ff' },
  },
  '& .MuiInputLabel-root': { color: '#8fa0dd' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00e5ff' },
  '& .MuiSelect-icon': { color: '#00e5ff' },
};

const INITIAL_FORM_STATE = {
  nombre: '',
  apellido: '',
  dni: '',
  edad: '',
  telefono: '',
  email: '',
  fechaNacimiento: '',
  tituloSecundario: 'no',
  concurreAlgunaIglesias: false,
  cual: ''
};

export const PreInscripcionModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalización segura de la fecha
    let fechaIso = '';
    if (formData.fechaNacimiento) {
      const parsedDate = new Date(formData.fechaNacimiento);
      if (!isNaN(parsedDate.getTime())) {
        fechaIso = parsedDate.toISOString();
      }
    }

    const dataToSubmit = {
      ...formData,
      fechaNacimiento: fechaIso,
      // Si deshabilita la opción de iglesia, reseteamos el campo "cual"
      cual: formData.concurreAlgunaIglesias ? formData.cual : ''
    };

    onSubmit(dataToSubmit);
    resetForm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: '#1b2348',
          color: '#ffffff',
          border: '1px solid #00e5ff',
          borderRadius: 1
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          Nueva Pre-inscripción
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#00e5ff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, borderColor: '#2b3566' }}>
          <TextField
            label="Nombre *"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          />
          <TextField
            label="Apellido *"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          />
          <TextField
            label="DNI / Documento *"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          />
          <TextField
            label="Edad *"
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            inputProps={{ min: 0 }}
            sx={INPUT_STYLE}
          />
          <TextField
            label="Teléfono de Contacto *"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          />
          <TextField
            label="Correo Electrónico *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          />
          <TextField
            label="Fecha de Nacimiento *"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          />
          <TextField
            select
            label="Título secundario *"
            name="tituloSecundario"
            value={formData.tituloSecundario}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={INPUT_STYLE}
          >
            <MenuItem value="si">Sí</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="incompleto">Incompleto</MenuItem>
          </TextField>

          <Box mt={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.concurreAlgunaIglesias}
                  onChange={handleChange}
                  name="concurreAlgunaIglesias"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00e5ff',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00e5ff',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  ¿Concurre a alguna iglesia?
                </Typography>
              }
            />
            <Typography variant="caption" sx={{ color: '#00e5ff', display: 'block', mt: 0.5 }}>
              Activá esta opción si participa actualmente en una iglesia.
            </Typography>
          </Box>

          {formData.concurreAlgunaIglesias && (
            <TextField
              label="¿A cuál iglesia concurre?"
              name="cual"
              value={formData.cual}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={INPUT_STYLE}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between', gap: 1 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            sx={{ 
              color: '#ffffff', 
              borderColor: '#d500ba',
              '&:hover': { borderColor: '#ff007f' }
            }}
          >
            CANCELAR
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              bgcolor: '#00e5ff', 
              color: '#03083b', 
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#00b4ff' }
            }}
          >
            REGISTRAR
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};