import { useState, useEffect, useRef } from "react";
import {
  Alert,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { PhotoCapture } from "./PhotoCapture";

const emptyForm = {
  registrarId: "",
  nombre: "",
  apellido: "",
  dni: "",
  edad: "",
  telefono: "",
  email: "",
  foto: "",
  fechaNacimiento: "",
  tituloSecundario: "no",
  concurreAlgunaIglesias: false,
  nombrePastor: "",
  cual: "",
};

const fields = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ej: Juan Carlos",
    defaultHelperText: "Entre 2 y 60 letras.",
    maxLength: 60,
  },
  {
    name: "apellido",
    label: "Apellido",
    type: "text",
    required: true,
    placeholder: "Ej: Pérez",
    defaultHelperText: "Entre 2 y 60 letras.",
    maxLength: 60,
  },
  {
    name: "dni",
    label: "DNI / Documento",
    type: "text",
    required: true,
    placeholder: "Ej: 39123456",
    defaultHelperText: "Ingresá entre 6 y 10 números, sin puntos.",
    maxLength: 10,
  },
  {
    name: "edad",
    label: "Edad",
    type: "number",
    required: true,
    placeholder: "Ej: 20",
    defaultHelperText: "Edad en años (1 a 120).",
    min: 1,
    max: 120,
  },
  {
    name: "telefono",
    label: "Teléfono de Contacto",
    type: "text",
    required: true,
    placeholder: "Ej: 3411234567",
    defaultHelperText: "Al menos 8 números. Ejemplo: 3411234567.",
    maxLength: 15,
  },
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    required: true,
    placeholder: "Ej: ejemplo@gmail.com",
    defaultHelperText: "Ejemplo: ejemplo@gmail.com",
    maxLength: 100,
  },
  {
    name: "fechaNacimiento",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
    shrink: true,
    defaultHelperText: "Seleccioná la fecha de nacimiento.",
  },
];

/**
 * Valida un campo individual según las reglas del Pre-Ciclo 2027.
 */
const validateField = (name, value, allForm = {}) => {
  const normalizedValue = String(value ?? "").trim();

  switch (name) {
    case "nombre": {
      if (!normalizedValue) return "El nombre es obligatorio.";
      if (normalizedValue.length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
      }
      if (normalizedValue.length > 60) {
        return "El nombre no puede superar los 60 caracteres.";
      }
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(normalizedValue)) {
        return "El nombre solo puede contener letras y espacios.";
      }
      return "";
    }
    case "apellido": {
      if (!normalizedValue) return "El apellido es obligatorio.";
      if (normalizedValue.length < 2) {
        return "El apellido debe tener al menos 2 caracteres.";
      }
      if (normalizedValue.length > 60) {
        return "El apellido no puede superar los 60 caracteres.";
      }
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(normalizedValue)) {
        return "El apellido solo puede contener letras y espacios.";
      }
      return "";
    }
    case "dni": {
      if (!normalizedValue) return "El DNI / Documento es obligatorio.";
      if (!/^[0-9]+$/.test(normalizedValue)) {
        return "El DNI solo puede contener números.";
      }
      if (normalizedValue.length < 6) {
        return "El DNI debe tener al menos 6 dígitos.";
      }
      if (normalizedValue.length > 10) {
        return "El DNI no puede superar los 10 dígitos.";
      }
      return "";
    }
    case "edad": {
      if (!normalizedValue) return "La edad es obligatoria.";
      const num = Number(normalizedValue);
      if (isNaN(num) || !Number.isInteger(num)) {
        return "La edad debe ser un número entero.";
      }
      if (num < 1 || num > 120) {
        return "La edad debe estar entre 1 y 120 años.";
      }
      return "";
    }
    case "telefono": {
      if (!normalizedValue) return "El teléfono es obligatorio.";
      const digits = normalizedValue.replace(/\D/g, "");
      if (digits.length < 8) {
        return "Ingresá al menos 8 números. Ejemplo: 3411234567.";
      }
      if (digits.length > 15) {
        return "El teléfono no puede superar los 15 dígitos.";
      }
      return "";
    }
    case "email": {
      if (!normalizedValue) return "El correo electrónico es obligatorio.";
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedValue)
      ) {
        return "Ingresá un correo válido. Ejemplo: ejemplo@gmail.com";
      }
      return "";
    }
    case "fechaNacimiento": {
      if (!normalizedValue) return "La fecha de nacimiento es obligatoria.";
      const date = new Date(normalizedValue);
      if (isNaN(date.getTime())) return "Fecha de nacimiento inválida.";
      if (date > new Date()) return "La fecha de nacimiento no puede ser futura.";
      if (date.getFullYear() < 1900) return "El año debe ser posterior a 1900.";
      return "";
    }
    case "tituloSecundario": {
      if (!["si", "no", "incompleto"].includes(normalizedValue)) {
        return "Seleccioná el estado del secundario.";
      }
      return "";
    }
    case "nombrePastor": {
      if (allForm.concurreAlgunaIglesias) {
        if (!normalizedValue) return "El nombre del pastor es obligatorio.";
        if (normalizedValue.length < 2) return "Debe tener al menos 2 caracteres.";
        if (normalizedValue.length > 120) return "No puede superar los 120 caracteres.";
      }
      return "";
    }
    case "cual": {
      if (allForm.concurreAlgunaIglesias) {
        if (!normalizedValue) return "El nombre de la iglesia es obligatorio.";
        if (normalizedValue.length < 2) return "Debe tener al menos 2 caracteres.";
        if (normalizedValue.length > 120) return "No puede superar los 120 caracteres.";
      }
      return "";
    }
    default:
      return "";
  }
};

/**
 * Valida el formulario completo y devuelve un objeto de errores.
 */
const validateForm = (data) => {
  const errorsObj = {};
  const fieldsToValidate = [
    "nombre",
    "apellido",
    "dni",
    "edad",
    "telefono",
    "email",
    "fechaNacimiento",
    "tituloSecundario",
  ];

  if (data.concurreAlgunaIglesias) {
    fieldsToValidate.push("nombrePastor", "cual");
  }

  for (const fieldName of fieldsToValidate) {
    const error = validateField(fieldName, data[fieldName], data);
    if (error) {
      errorsObj[fieldName] = error;
    }
  }

  return errorsObj;
};

/**
 * Obtiene el estado inicial del formulario según si es creación o edición.
 */
const getInitialFormData = (initialData) => {
  if (!initialData) return emptyForm;
  return {
    ...emptyForm,
    ...initialData,
    nombrePastor: initialData.nombrePastor ?? initialData.pastor ?? "",
    // Convertir fecha ISO a formato input date (YYYY-MM-DD)
    fechaNacimiento: initialData.fechaNacimiento
      ? new Date(initialData.fechaNacimiento).toISOString().split("T")[0]
      : "",
  };
};

/**
 * Modal de formulario para crear o editar una pre-inscripción con validación por campo.
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isEditMode = Boolean(initialData);
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [formData, setFormData] = useState(() => getInitialFormData(initialData));
  const [errors, setErrors] = useState({});
  const [, setTouched] = useState({});
  const contentRef = useRef(null);

  // Sincroniza el formulario cuando cambia open o initialData directamente durante el render
  if (open !== prevOpen || initialData !== prevInitialData) {
    setPrevOpen(open);
    setPrevInitialData(initialData);
    if (open) {
      setFormData(getInitialFormData(initialData));
      setErrors({});
      setTouched({});
    }
  }

  // Scroll al inicio al abrir el modal (efecto exclusivo sobre el DOM)
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Sanitización en tiempo real consistente con la inscripción al evento
    if (name === "nombre" || name === "apellido") {
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "").slice(0, 60);
    } else if (name === "dni") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "edad") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    } else if (name === "telefono") {
      newValue = value.replace(/\D/g, "").slice(0, 15);
    } else if (name === "email") {
      newValue = value.replace(/\s/g, "").slice(0, 100);
    }

    const updated = {
      ...formData,
      [name]: newValue,
    };

    // Auto-cálculo de edad sugerida si se ingresa la fecha de nacimiento
    if (name === "fechaNacimiento" && newValue) {
      const birth = new Date(newValue);
      const today = new Date();
      if (!isNaN(birth.getTime()) && birth <= today) {
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calculatedAge--;
        }
        if (
          calculatedAge >= 1 &&
          calculatedAge <= 120 &&
          (!formData.edad || formData.edad === "")
        ) {
          updated.edad = String(calculatedAge);
        }
      }
    }

    setFormData(updated);

    // Si se desmarca concurreAlgunaIglesias, limpiar los errores asociados
    if (name === "concurreAlgunaIglesias" && !checked) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.nombrePastor;
        delete next.cual;
        return next;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue, updated),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    setTouched({
      nombre: true,
      apellido: true,
      dni: true,
      edad: true,
      telefono: true,
      email: true,
      fechaNacimiento: true,
      tituloSecundario: true,
      nombrePastor: true,
      cual: true,
    });

    if (Object.keys(formErrors).length > 0) {
      toast.error("Por favor revisá los campos marcados en rojo.");
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      dni: formData.dni.trim(),
      edad: Number(formData.edad),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      tituloSecundario: formData.tituloSecundario,
      concurreAlgunaIglesias: Boolean(formData.concurreAlgunaIglesias),
      fechaNacimiento: formData.fechaNacimiento
        ? new Date(formData.fechaNacimiento).toISOString()
        : undefined,
    };

    if (formData.foto && formData.foto.trim() !== "") {
      payload.foto = formData.foto;
    }

    if (formData.concurreAlgunaIglesias) {
      if (formData.nombrePastor && formData.nombrePastor.trim() !== "") {
        payload.nombrePastor = formData.nombrePastor.trim();
      }
      if (formData.cual && formData.cual.trim() !== "") {
        payload.cual = formData.cual.trim();
      }
    }

    onSave(payload);
  };

  const hasFormErrors = Object.values(errors).some(Boolean);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
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
            maxHeight: isMobile ? "100vh" : "calc(100vh - 32px)",
            height: isMobile ? "100vh" : "auto",
            width: isMobile ? "100%" : undefined,
            margin: isMobile ? 0 : undefined,
            display: "flex",
            flexDirection: "column",
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

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flex: 1,
        }}
      >
        <DialogContent
          ref={contentRef}
          sx={{
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
        >
          {hasFormErrors && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 0 }}>
              Por favor revisá los campos marcados en rojo antes de guardar.
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <PhotoCapture
                value={formData.foto}
                onChange={(foto) => setFormData((prev) => ({ ...prev, foto }))}
                disabled={loading}
              />
            </Grid>

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

            {fields.map((field) => {
              const fieldError = errors[field.name];
              const isError = Boolean(fieldError);

              return (
                <Grid size={{ xs: 12 }} key={field.name}>
                  <TextField
                    required={field.required}
                    fullWidth
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={isError}
                    helperText={isError ? fieldError : field.defaultHelperText}
                    slotProps={{
                      htmlInput: {
                        min: field.min,
                        max: field.max,
                        maxLength: field.maxLength,
                      },
                      inputLabel: field.shrink ? { shrink: true } : undefined,
                    }}
                  />
                </Grid>
              );
            })}

            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                required
                error={Boolean(errors.tituloSecundario)}
              >
                <InputLabel id="titulo-secundario-label">
                  Título secundario
                </InputLabel>
                <Select
                  labelId="titulo-secundario-label"
                  name="tituloSecundario"
                  value={formData.tituloSecundario}
                  label="Título secundario"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="si">Sí</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="incompleto">Incompleto</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.tituloSecundario ||
                    "Indicá si completaste tus estudios secundarios."}
                </FormHelperText>
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
              <>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label="¿Quién es el pastor?"
                    name="nombrePastor"
                    placeholder="Ej: Pastor Roberto Martínez"
                    value={formData.nombrePastor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.nombrePastor)}
                    helperText={
                      errors.nombrePastor || "Nombre y apellido del pastor."
                    }
                    slotProps={{ htmlInput: { maxLength: 120 } }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label="¿A cuál iglesia concurre?"
                    name="cual"
                    placeholder="Ej: Iglesia Central TSM"
                    value={formData.cual}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.cual)}
                    helperText={
                      errors.cual ||
                      "Nombre o congregación a la que asiste."
                    }
                    slotProps={{ htmlInput: { maxLength: 120 } }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 2.5 },
            pt: 1,
            gap: 1,
            flexShrink: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            "& .MuiButton-root": { flex: 1, minWidth: 0 },
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{ whiteSpace: "nowrap" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ whiteSpace: "nowrap" }}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
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