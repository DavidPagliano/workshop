import { useEffect, useState } from "react";

export const emptyPreCycleForm = {
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

export const usePreCycleForm = ({ open, initialData, onSave }) => {
  const [formData, setFormData] = useState(emptyPreCycleForm);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...emptyPreCycleForm,
        ...initialData,
        nombrePastor: initialData.nombrePastor ?? initialData.pastor ?? "",
        fechaNacimiento: initialData.fechaNacimiento
          ? new Date(initialData.fechaNacimiento).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData(emptyPreCycleForm);
    }
  }, [open, initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...formData,
      edad: Number(formData.edad),
      nombrePastor:
        formData.concurreAlgunaIglesias && formData.nombrePastor
          ? formData.nombrePastor.trim()
          : "",
      cual:
        formData.concurreAlgunaIglesias && formData.cual
          ? formData.cual.trim()
          : "",
      fechaNacimiento: formData.fechaNacimiento
        ? new Date(formData.fechaNacimiento).toISOString()
        : undefined,
    });
  };

  return { formData, setFormData, handleChange, handleSubmit };
};
