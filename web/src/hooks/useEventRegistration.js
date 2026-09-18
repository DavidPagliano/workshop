import { useState } from "react";
import { registerToEvent } from "../services/eventService";

const initialFormData = {
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
  email: "",
  temas: "",
};

const initialTouched = {};

const validateField = (name, value) => {
  const normalizedValue = String(value ?? "").trim();

  switch (name) {
    case "nombre": {
      if (!normalizedValue) return "El nombre es obligatorio.";
      if (normalizedValue.length < 3) {
        return "El nombre debe tener al menos 3 caracteres.";
      }
      if (normalizedValue.length > 9) {
        return "El nombre no puede superar los 9 caracteres.";
      }
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(normalizedValue)) {
        return "El nombre solo puede contener letras.";
      }
      return "";
    }
    case "apellido": {
      if (!normalizedValue) return "El apellido es obligatorio.";
      if (normalizedValue.length < 3) {
        return "El apellido debe tener al menos 3 caracteres.";
      }
      if (normalizedValue.length > 15) {
        return "El apellido no puede superar los 15 caracteres.";
      }
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(normalizedValue)) {
        return "El apellido solo puede contener letras.";
      }
      return "";
    }
    case "dni": {
      if (!normalizedValue) return "El DNI es obligatorio.";
      if (!/^[0-9]+$/.test(normalizedValue)) {
        return "El DNI solo puede contener números.";
      }
      if (normalizedValue.length < 6) {
        return "El DNI debe tener al menos 6 dígitos.";
      }
      if (normalizedValue.length > 8) {
        return "El DNI no puede superar los 8 dígitos.";
      }
      return "";
    }
    case "telefono": {
      if (!normalizedValue) return "El teléfono es obligatorio.";
      if (!/^[0-9]{10}$/.test(normalizedValue)) {
        return "Ingresá 10 números. Ejemplo: 3411234567.";
      }
      return "";
    }
    case "email": {
      if (!normalizedValue) return "El correo electrónico es obligatorio.";
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedValue)) {
        return "Ingresá un correo válido. Ejemplo: ejemplo@gmail.com";
      }
      return "";
    }
    case "temas": {
      const validTopics = [
        "Fotografía",
        "Marketing Digital",
        "Diseño",
        "Conexión satelital",
        "Iluminación",
        "Diseño web",
        "Animación con IA",
        "Otros",
        "sin temas",
        "AI",
        "Audio",
        "video",
      ];
      if (!validTopics.includes(value)) {
        return "Seleccioná un tema de interés.";
      }
      return "";
    }
    default:
      return "";
  }
};

const validateForm = (formData) =>
  Object.keys(initialFormData).reduce((fieldErrors, fieldName) => {
    const error = validateField(fieldName, formData[fieldName]);
    if (error) fieldErrors[fieldName] = error;
    return fieldErrors;
  }, {});

export const useEventRegistration = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(initialTouched);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name === "nombre") {
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g, "").slice(0, 9);
    } else if (name === "apellido") {
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g, "").slice(0, 15);
    } else if (name === "dni") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
    } else if (name === "telefono") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "email") {
      newValue = value.replace(/\s/g, "").slice(0, 100);
    }

    setFormData((current) => ({ ...current, [name]: newValue }));
    setError("");

    setErrors((current) => ({ ...current, [name]: validateField(name, newValue) }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    setTouched(
      Object.keys(initialFormData).reduce((fields, fieldName) => {
        fields[fieldName] = true;
        return fields;
      }, {}),
    );
    setLoading(true);
    setError("");

    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const result = await registerToEvent({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        temas: formData.temas,
      });
      setRegistration(result);
    } catch (requestError) {
      setError(
        requestError?.message ||
          "No pudimos completar la inscripción. Intentá nuevamente.",
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
