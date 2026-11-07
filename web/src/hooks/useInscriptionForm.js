import { useMemo, useState } from "react";
import { createInscription } from "../services/inscriptionService";
import { ALL_FIELDS, FIELD_MAP, INSCRIPTION_STEPS } from "../config/inscriptionFields";

// ── Helpers para leer/escribir rutas anidadas ("fichaMedica.ObraSocial.nombre") ──
const getIn = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

const setIn = (obj, path, value) => {
  const [key, ...rest] = path.split(".");
  if (rest.length === 0) return { ...obj, [key]: value };
  return { ...obj, [key]: setIn(obj?.[key] ?? {}, rest.join("."), value) };
};

const buildInitialForm = () =>
  ALL_FIELDS.reduce(
    (form, field) =>
      setIn(form, field.name, field.kind === "switch" ? false : field.defaultValue ?? ""),
    { foto: "" },
  );

const isVisible = (field, form) => !field.showIf || field.showIf(form);

const calculateAge = (dateValue) => {
  const birth = new Date(dateValue);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ── Sanitización en tiempo real según el tipo de campo ──
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

// ── Validación de un campo según su configuración ──
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
      if (digits.length < 8) return "Ingresá al menos 8 números. Ejemplo: 3411234567.";
      if (digits.length > 15) return "No puede superar los 15 dígitos.";
      return "";
    }
    case "email":
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        return "Ingresá un correo válido. Ejemplo: ejemplo@gmail.com";
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
      if (!field.options.some((option) => option.value === value)) return "Seleccioná una opción válida.";
      return "";
    default:
      break;
  }

  if (field.min && value.length < field.min) return `Debe tener al menos ${field.min} caracteres.`;
  if (field.max && value.length > field.max) return `No puede superar los ${field.max} caracteres.`;
  return "";
};

const getStepFields = (stepIndex, form) =>
  INSCRIPTION_STEPS[stepIndex].sections
    .flatMap((section) => section.fields)
    .filter((field) => isVisible(field, form));

const validateStepFields = (stepIndex, form) =>
  getStepFields(stepIndex, form).reduce((errors, field) => {
    const error = validateField(field, getIn(form, field.name));
    if (error) errors[field.name] = error;
    return errors;
  }, {});

// ── Arma el payload limpio que espera la API ──
const buildPayload = (form) => {
  let payload = {};

  ALL_FIELDS.forEach((field) => {
    if (!isVisible(field, form)) return;
    let value = getIn(form, field.name);

    if (field.kind === "switch") {
      value = Boolean(value);
    } else {
      value = String(value ?? "").trim();
      if (!value) return; // opcional vacío: no se envía
      if (field.kind === "date") value = new Date(value).toISOString();
    }

    payload = setIn(payload, field.name, value);
  });

  // La ficha médica repite los datos personales: se completan desde el paso 2.
  payload.fichaMedica = {
    ...payload.fichaMedica,
    nombre: payload.nombre,
    apellido: payload.apellido,
    dni: payload.dni,
    fechaNacimiento: payload.fechaNacimiento,
    lugarNacimiento: payload.lugarNacimiento,
    edad: calculateAge(form.fechaNacimiento),
  };

  if (form.foto) payload.foto = form.foto;

  return payload;
};

const formatServerError = (requestError) => {
  const base = requestError?.message || "No pudimos completar la inscripción. Intentá nuevamente.";
  const details = (requestError?.errors || []).map((err) => `${err.field}: ${err.message}`);
  return details.length ? `${base} (${details.join(" · ")})` : base;
};

// Mapeo para replicar los datos de Contacto de emergencia en Familia de referencia
const EMERGENCIA_TO_FAMILIA_MAP = {
  "emergencia.NombreYApellido": "fichaMedica.familiaDeReferencia.nombreYApellido",
  "emergencia.Parentesco": "fichaMedica.familiaDeReferencia.parentesco",
  "emergencia.Telefono": "fichaMedica.familiaDeReferencia.telefono",
  "emergencia.Domicilio": "fichaMedica.familiaDeReferencia.domicilio",
  "emergencia.Localidad": "fichaMedica.familiaDeReferencia.localidad",
  provincia: "fichaMedica.familiaDeReferencia.provincia",
};

export const useInscriptionForm = () => {
  const [formData, setFormData] = useState(buildInitialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState(null);

  const isLastStep = activeStep === INSCRIPTION_STEPS.length - 1;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const field = FIELD_MAP[name];
    const newValue = type === "checkbox" ? checked : sanitize(field, value);
    let updated = setIn(formData, name, newValue);

    // Replicar automáticamente Contacto de emergencia (y provincia) en Familia de referencia
    const linkedPath = EMERGENCIA_TO_FAMILIA_MAP[name];
    if (linkedPath) {
      const prevSourceValue = getIn(formData, name) ?? "";
      const currentTargetValue = getIn(formData, linkedPath) ?? "";
      if (!currentTargetValue || currentTargetValue === prevSourceValue) {
        updated = setIn(updated, linkedPath, newValue);
      }
    }

    setFormData(updated);
    setError("");
    setErrors((prev) => {
      const next = { ...prev };
      // Limpia errores de campos que quedaron ocultos (ej. al desactivar un switch)
      ALL_FIELDS.forEach((f) => {
        if (!isVisible(f, updated)) delete next[f.name];
      });
      if (field && field.kind !== "switch" && (prev[name] !== undefined || field.kind === "select")) {
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

  const handlePhotoChange = (foto) => {
    setFormData((prev) => ({ ...prev, foto }));
    if (foto) {
      setError("");
      setErrors((prev) => {
        const next = { ...prev };
        delete next.foto;
        return next;
      });
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const validateStep = (stepIndex) => {
    if (stepIndex === 0) {
      if (!formData.foto) {
        setErrors((prev) => ({ ...prev, foto: "La foto del inscripto es obligatoria." }));
        return false;
      }
      return true;
    }

    const stepErrors = validateStepFields(stepIndex, formData);
    setErrors((prev) => {
      const next = { ...prev };
      getStepFields(stepIndex, formData).forEach((field) => delete next[field.name]);
      return { ...next, ...stepErrors };
    });
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(activeStep)) {
      setError("Revisá los campos marcados antes de continuar.");
      return;
    }
    setError("");
    setActiveStep((step) => Math.min(step + 1, INSCRIPTION_STEPS.length - 1));
    scrollTop();
  };

  const prevStep = () => {
    setError("");
    setActiveStep((step) => Math.max(step - 1, 0));
    scrollTop();
  };

  const goToStep = (stepIndex) => {
    // Solo se permite volver a pasos anteriores desde el stepper
    if (stepIndex < activeStep) {
      setError("");
      setActiveStep(stepIndex);
      scrollTop();
    }
  };

  const submitInscription = async (event) => {
    event.preventDefault();

    if (!isLastStep) {
      nextStep();
      return;
    }

    // Validación final de todos los pasos
    for (let stepIndex = 0; stepIndex < INSCRIPTION_STEPS.length; stepIndex++) {
      if (!validateStep(stepIndex)) {
        setActiveStep(stepIndex);
        setError("Revisá los campos marcados antes de confirmar.");
        scrollTop();
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      const result = await createInscription(buildPayload(formData));
      setRegistration(result);
      scrollTop();
    } catch (requestError) {
      setError(formatServerError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const resetInscription = () => {
    setFormData(buildInitialForm());
    setActiveStep(0);
    setErrors({});
    setError("");
    setRegistration(null);
    scrollTop();
  };

  // Progreso general: arranca en 0% y recién empieza a llenarse cuando se agrega la foto
  const progress = useMemo(() => {
    if (!formData.foto) return 0;
    const required = ALL_FIELDS.filter((field) => field.required && isVisible(field, formData));
    const completedFields = required.filter(
      (field) => String(getIn(formData, field.name) ?? "").trim() && !errors[field.name],
    ).length;
    const total = required.length + 1;
    return Math.round(((completedFields + 1) / total) * 100);
  }, [formData, errors]);

  return {
    formData,
    activeStep,
    isLastStep,
    errors,
    loading,
    error,
    registration,
    progress,
    getValue: (name) => getIn(formData, name),
    handleChange,
    handleBlur,
    handlePhotoChange,
    nextStep,
    prevStep,
    goToStep,
    submitInscription,
    resetInscription,
  };
};

