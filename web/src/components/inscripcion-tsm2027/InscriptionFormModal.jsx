import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Tab,
  Tabs,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { PhotoCapture } from "../common/PhotoCapture";
import { DocumentCapture } from "../common/DocumentCapture";
import { InscriptionSection } from "./InscriptionSection";
import {
  ALL_FIELDS,
  FIELD_MAP,
  MEDICAL_SECTIONS,
  PERSONAL_SECTIONS,
} from "../../config/inscriptionFields";

const getIn = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

const setIn = (obj, path, value) => {
  const [key, ...rest] = path.split(".");
  if (rest.length === 0) return { ...obj, [key]: value };
  return { ...obj, [key]: setIn(obj?.[key] ?? {}, rest.join("."), value) };
};

const isVisible = (field, form) => !field.showIf || field.showIf(form);

const calculateAge = (dateValue) => {
  const birth = new Date(dateValue);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const buildFormFromData = (initialData) => {
  let base = ALL_FIELDS.reduce(
    (form, field) =>
      setIn(form, field.name, field.kind === "switch" ? false : field.defaultValue ?? ""),
    { foto: "", inscriptionId: "" },
  );

  if (!initialData) return base;

  base.foto = initialData.foto || "";
  base.inscriptionId = initialData.inscriptionId || "";
  base.dniFrente = initialData.dniFrente || "";
  base.dniDorso = initialData.dniDorso || "";
  base.comprobantePago = initialData.comprobantePago || "";

  ALL_FIELDS.forEach((field) => {
    const raw = getIn(initialData, field.name);
    if (raw === undefined || raw === null) return;
    if (field.kind === "date") {
      const dateStr = raw ? new Date(raw).toISOString().split("T")[0] : "";
      base = setIn(base, field.name, dateStr);
    } else if (field.kind === "switch") {
      base = setIn(base, field.name, Boolean(raw));
    } else {
      base = setIn(base, field.name, String(raw));
    }
  });

  return base;
};

const sanitize = (field, value) => {
  if (!field || typeof value !== "string") return value;
  switch (field.kind) {
    case "name":
      return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "").slice(0, field.max);
    case "digits":
      return value.replace(/\D/g, "").slice(0, field.max);
    case "phone":
      return value.replace(/\D/g, "").slice(0, 15);
    case "email":
      return value.replace(/\s/g, "").slice(0, field.max);
    case "text":
    case "textarea":
      return field.max ? value.slice(0, field.max) : value;
    default:
      return value;
  }
};

const validateField = (field, rawValue) => {
  if (!field || field.kind === "switch") return "";
  const value = String(rawValue ?? "").trim();
  if (!value) return field.required ? "Este campo es obligatorio." : "";

  switch (field.kind) {
    case "name":
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(value)) return "Solo puede contener letras y espacios.";
      break;
    case "digits":
      if (!/^[0-9]+$/.test(value)) return "Solo puede contener números.";
      if (value.length < field.min) return `Debe tener al menos ${field.min} dígitos.`;
      if (value.length > field.max) return `No puede superar los ${field.max} dígitos.`;
      return "";
    case "phone": {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8) return "Ingresá al menos 8 números.";
      if (digits.length > 15) return "No puede superar los 15 dígitos.";
      return "";
    }
    case "email":
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        return "Ingresá un correo válido.";
      }
      break;
    case "date": {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "Fecha inválida.";
      if (date > new Date()) return "La fecha no puede ser futura.";
      if (date.getFullYear() < 1900) return "El año debe ser posterior a 1900.";
      const age = calculateAge(value);
      if (age === null || age < 1 || age > 120) return "La edad resultante debe estar entre 1 y 120 años.";
      return "";
    }
    case "select":
      if (!field.options.some((opt) => opt.value === value)) return "Seleccioná una opción válida.";
      return "";
    default:
      break;
  }

  if (field.min && value.length < field.min) return `Debe tener al menos ${field.min} caracteres.`;
  if (field.max && value.length > field.max) return `No puede superar los ${field.max} caracteres.`;
  return "";
};

const EMERGENCIA_TO_FAMILIA_MAP = {
  "emergencia.NombreYApellido": "fichaMedica.familiaDeReferencia.nombreYApellido",
  "emergencia.Parentesco": "fichaMedica.familiaDeReferencia.parentesco",
  "emergencia.Telefono": "fichaMedica.familiaDeReferencia.telefono",
  "emergencia.Domicilio": "fichaMedica.familiaDeReferencia.domicilio",
  "emergencia.Localidad": "fichaMedica.familiaDeReferencia.localidad",
  provincia: "fichaMedica.familiaDeReferencia.provincia",
};

/**
 * Modal de formulario para crear o editar una inscripción (incluyendo cambio de foto con cámara o archivo).
 */
export const InscriptionFormModal = ({
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
  const [formData, setFormData] = useState(() => buildFormFromData(initialData));
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef(null);

  if (open !== prevOpen || initialData !== prevInitialData) {
    setPrevOpen(open);
    setPrevInitialData(initialData);
    if (open) {
      setFormData(buildFormFromData(initialData));
      setErrors({});
      setActiveTab(0);
    }
  }

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open, activeTab]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const field = FIELD_MAP[name];
    const newValue = type === "checkbox" ? checked : sanitize(field, value);
    let updated = setIn(formData, name, newValue);

    const linkedPath = EMERGENCIA_TO_FAMILIA_MAP[name];
    if (linkedPath) {
      const prevSourceValue = getIn(formData, name) ?? "";
      const currentTargetValue = getIn(formData, linkedPath) ?? "";
      if (!currentTargetValue || currentTargetValue === prevSourceValue) {
        updated = setIn(updated, linkedPath, newValue);
      }
    }

    setFormData(updated);
    setErrors((prev) => {
      const next = { ...prev };
      ALL_FIELDS.forEach((f) => {
        if (!isVisible(f, updated)) delete next[f.name];
      });
      if (field && field.kind !== "switch") {
        next[name] = validateField(field, newValue);
      }
      return next;
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const field = FIELD_MAP[name];
    if (!field) return;
    setErrors((prev) => ({ ...prev, [name]: validateField(field, value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!formData.foto) {
      newErrors.foto = "La foto del inscripto es obligatoria.";
    }

    ALL_FIELDS.forEach((field) => {
      if (!isVisible(field, formData)) return;
      const err = validateField(field, getIn(formData, field.name));
      if (err) newErrors[field.name] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const hasPersonalError =
        Boolean(newErrors.foto) ||
        PERSONAL_SECTIONS.some((sec) => sec.fields.some((f) => newErrors[f.name]));
      setActiveTab(hasPersonalError ? 0 : 1);
      toast.error("Por favor revisá los campos marcados en rojo.");
      return;
    }

    let payload = {};
    ALL_FIELDS.forEach((field) => {
      if (!isVisible(field, formData)) return;
      let val = getIn(formData, field.name);
      if (field.kind === "switch") {
        val = Boolean(val);
      } else {
        val = String(val ?? "").trim();
        if (!val) return;
        if (field.kind === "date") val = new Date(val).toISOString();
      }
      payload = setIn(payload, field.name, val);
    });

    payload.fichaMedica = {
      ...payload.fichaMedica,
      nombre: payload.nombre,
      apellido: payload.apellido,
      dni: payload.dni,
      fechaNacimiento: payload.fechaNacimiento,
      lugarNacimiento: payload.lugarNacimiento,
      edad: calculateAge(formData.fechaNacimiento),
    };
    payload.foto = formData.foto;
    if (formData.dniFrente) payload.dniFrente = formData.dniFrente;
    if (formData.dniDorso) payload.dniDorso = formData.dniDorso;
    if (formData.comprobantePago) payload.comprobantePago = formData.comprobantePago;

    onSave(payload);
  };

  const hasFormErrors = Object.values(errors).some(Boolean);
  const sectionProps = {
    formData,
    getValue: (name) => getIn(formData, name),
    errors,
    loading,
    onChange: handleChange,
    onBlur: handleBlur,
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
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
        <Box sx={{ fontWeight: 700, minWidth: 0, pr: 1 }}>
          {isEditMode ? "Editar Inscripción" : "Nueva Inscripción"}
        </Box>
        <IconButton onClick={onClose} disabled={loading} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="fullWidth"
        sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}
      >
        <Tab label="1. Foto y Datos" />
        <Tab label="2. Ficha Médica" />
        <Tab label="3. DNI y Pago" />
      </Tabs>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
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
              {errors.foto || "Por favor revisá los campos marcados en rojo antes de guardar."}
            </Alert>
          )}

          {activeTab === 0 && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <PhotoCapture
                  value={formData.foto}
                  onChange={(foto) => {
                    setFormData((prev) => ({ ...prev, foto }));
                    if (foto) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.foto;
                        return next;
                      });
                    }
                  }}
                  disabled={loading}
                  allowUpload
                  label="Foto del inscripto *"
                />
              </Box>

              {isEditMode && formData.inscriptionId && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="N° Inscripción"
                    value={formData.inscriptionId}
                    disabled
                  />
                </Box>
              )}

              {PERSONAL_SECTIONS.map((section) => (
                <InscriptionSection key={section.title} section={section} {...sectionProps} />
              ))}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {MEDICAL_SECTIONS.map((section) => (
                <InscriptionSection key={section.title} section={section} {...sectionProps} />
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <DocumentCapture
                value={formData.dniFrente}
                onChange={(val) => setFormData((prev) => ({ ...prev, dniFrente: val }))}
                disabled={loading}
                label="DNI — Frente"
                helperText="Foto de la parte delantera del DNI"
              />
              <DocumentCapture
                value={formData.dniDorso}
                onChange={(val) => setFormData((prev) => ({ ...prev, dniDorso: val }))}
                disabled={loading}
                label="DNI — Dorso"
                helperText="Foto de la parte trasera del DNI"
              />
              <DocumentCapture
                value={formData.comprobantePago}
                onChange={(val) => setFormData((prev) => ({ ...prev, comprobantePago: val }))}
                disabled={loading}
                label="Comprobante de Pago"
                helperText="Imagen o documento PDF del comprobante de transferencia"
                accept="image/*,application/pdf"
                allowPdf={true}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 2.5 },
            pt: 1.5,
            gap: 1,
            flexShrink: 0,
            flexWrap: "wrap",
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            "& .MuiButton-root": {
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              minWidth: 0,
              whiteSpace: "normal",
            },
          }}
        >
          <Button onClick={onClose} disabled={loading} variant="outlined">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? "Guardando..." : isEditMode ? "Guardar Cambios" : "Registrar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

