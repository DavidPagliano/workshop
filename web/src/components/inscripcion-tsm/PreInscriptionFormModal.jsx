import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const emptyForm = {
  registrarId: "",
  nombre: "",
  apellido: "",
  dni: "",
  edad: "",
  telefono: "",
  email: "",
  fechaNacimiento: "",
  tituloSecundario: "no",
  concurreAlgunaIglesias: false,
  cual: "",
};

const fields = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "apellido", label: "Apellido", type: "text", required: true },
  { name: "dni", label: "DNI / Documento", type: "text", required: true },
  { name: "edad", label: "Edad", type: "number", required: true, min: 1, max: 120 },
  { name: "telefono", label: "Teléfono de Contacto", type: "text", required: true },
  { name: "email", label: "Correo Electrónico", type: "email", required: true },
  {
    name: "fechaNacimiento",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
    shrink: true,
  },
];

/**
 * Modal de formulario para crear o editar una pre-inscripción.
 *
 * @param {boolean} open - Controla visibilidad del modal
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {Function} onSave - Callback con los datos del formulario (formData)
 * @param {object|null} initialData - null = crear, objeto = editar
 * @param {boolean} loading - Indica si se está procesando la petición
 */
export const PreinscriptionFormModal = ({
  open,
  onClose,
  onSave,
  initialData = null,
  loading = false,
}) => {
  const isEditMode = Boolean(initialData);
  const [formData, setFormData] = useState(emptyForm);

  // Sincroniza el formulario con el registro seleccionado al abrir el modal.
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Modo editar: cargar datos existentes
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          ...emptyForm,
          ...initialData,
          // Convertir fecha ISO a formato input date (YYYY-MM-DD)
          fechaNacimiento: initialData.fechaNacimiento
            ? new Date(initialData.fechaNacimiento).toISOString().split("T")[0]
            : "",
        });
      } else {
        // Modo crear: limpiar formulario
        setFormData(emptyForm);
      }
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      edad: Number(formData.edad),
      cual: formData.cual.trim(),
      fechaNacimiento: formData.fechaNacimiento
        ? new Date(formData.fechaNacimiento).toISOString()
        : undefined,
    };
    onSave(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 300 },
        paper: {
          sx: {
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
            borderRadius: 0,
            bgcolor: "background.paper",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
        }}
      >
        <Box sx={{ fontWeight: 700 }}>
          {isEditMode ? "Editar Pre-inscripción" : "Nueva Pre-inscripción"}
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            {/* Mostrar registrarId como solo lectura en modo editar */}
            {isEditMode && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="N° Registro"
                  value={formData.registrarId}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(255,255,255,0.5)",
                    },
                  }}
                />
              </Grid>
            )}

            {fields.map((field) => (
              <Grid size={{ xs: 12 }} key={field.name}>
                <TextField
                  required={field.required}
                  fullWidth
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  inputProps={{ min: field.min, max: field.max }}
                  slotProps={{
                    inputLabel: field.shrink ? { shrink: true } : undefined,
                  }}
                />
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel id="titulo-secundario-label">
                  Título secundario
                </InputLabel>
                <Select
                  labelId="titulo-secundario-label"
                  name="tituloSecundario"
                  value={formData.tituloSecundario}
                  label="Título secundario"
                  onChange={handleChange}
                >
                  <MenuItem value="si">Sí</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="incompleto">Incompleto</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      name="concurreAlgunaIglesias"
                      checked={formData.concurreAlgunaIglesias}
                      onChange={handleChange}
                    />
                  }
                  label="¿Concurre a alguna iglesia?"
                />
                <FormHelperText>
                  Activá esta opción si participa actualmente en una iglesia.
                </FormHelperText>
              </FormControl>
            </Grid>

            {formData.concurreAlgunaIglesias && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="¿A cuál iglesia concurre?"
                  name="cual"
                  value={formData.cual}
                  onChange={handleChange}
                  inputProps={{ maxLength: 120 }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
          <Button onClick={onClose} disabled={loading} variant="outlined">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading
              ? "Guardando..."
              : isEditMode
              ? "Guardar Cambios"
              : "Registrar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
