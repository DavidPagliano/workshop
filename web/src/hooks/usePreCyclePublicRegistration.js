import { useState } from "react";
import { registerToPreCycle } from "../services/preCycleService";

const initialFormData = {
  nombre: "",
  apellido: "",
  dni: "",
  edad: "",
  telefono: "",
  email: "",
  fechaNacimiento: "",
  tituloSecundario: "no",
  concurreAlgunaIglesias: false,
  nombrePastor: "",
  cual: "",
};

const initialTouched = {};

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

export const usePreCyclePublicRegistration = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(initialTouched);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let newValue = type === "checkbox" ? checked : value;

    // Sanitización en tiempo real
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

    // Auto-cálculo de edad si se ingresa la fecha de nacimiento
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
    setError("");

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

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    setTouched(
      Object.keys(initialFormData).reduce((fields, fieldName) => {
        fields[fieldName] = true;
        return fields;
      }, {})
    );
    setLoading(true);
    setError("");

    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
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

      // No incluir foto — es ruta pública

      if (formData.concurreAlgunaIglesias) {
        if (formData.nombrePastor && formData.nombrePastor.trim() !== "") {
          payload.nombrePastor = formData.nombrePastor.trim();
        }
        if (formData.cual && formData.cual.trim() !== "") {
          payload.cual = formData.cual.trim();
        }
      }

      const result = await registerToPreCycle(payload);
      setRegistration(result);
    } catch (requestError) {
      setError(
        requestError?.message ||
          "No pudimos completar la pre-inscripción. Intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetRegistration = () => {
    setFormData(initialFormData);
    setRegistration(null);
    setError("");
    setErrors({});
    setTouched(initialTouched);
  };

  return {
    formData,
    loading,
    error,
    errors,
    touched,
    registration,
    handleChange,
    handleBlur,
    submitRegistration,
    resetRegistration,
  };
};
