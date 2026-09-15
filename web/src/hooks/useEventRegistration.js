import { useState } from "react";
import { registerToEvent } from "../services/eventService";

const initialFormData = {
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
  email: "",
  temas: "sin temas",
};

export const useEventRegistration = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

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
  };

  return {
    formData,
    loading,
    error,
    registration,
    handleChange,
    submitRegistration,
    resetRegistration,
  };
};
