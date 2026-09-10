import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

import axios from "axios";

// ================================================================
// COMPONENTE
// ================================================================

import InscripcionForm from "../../components/inscripcion-w/InscripcionForm.jsx";

// ================================================================
// FONDO
// ================================================================

import bgGrid from "../../assets/images/fondo/FONDO3.png";

// ================================================================
// TIPOGRAFÍAS
// ================================================================

const FONT_MAIN = "'Neue Haas Grotesk', sans-serif";
const FONT_PIXEL = "'Omega Pixel BIFORM', monospace";

// ================================================================
// DECORACIÓN DE ESQUINAS
// ================================================================

const CornerDots = ({
  size = 8,
  offset = -5,
  color = "#00B4FF",
}) => {
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

// ================================================================
// PAGE
// ================================================================

export default function InscripcionPage() {
  const navigate = useNavigate();

  // ==============================================================
  // FORM DATA
  // ==============================================================

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    temas: "",
  });

  // ==============================================================
  // ERRORES
  // ==============================================================

  const [errors, setErrors] = useState({});

  // ==============================================================
  // ESTADOS
  // ==============================================================

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ==============================================================
  // VALIDAR CAMPO
  // ==============================================================

  const validarCampo = (name, value) => {
    const valor = value.trim();

    switch (name) {
      // ==========================================================
      // NOMBRE
      // ==========================================================

      case "nombre": {
        if (!valor) {
          return "El nombre es obligatorio.";
        }

        if (valor.length < 3) {
          return "El nombre debe tener al menos 3 caracteres.";
        }

        if (valor.length > 9) {
          return "El nombre no puede superar los 9 caracteres.";
        }

        const nombreRegex =
          /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

        if (!nombreRegex.test(valor)) {
          return "El nombre solo puede contener letras.";
        }

        return "";
      }

      // ==========================================================
      // APELLIDO
      // ==========================================================

      case "apellido": {
        if (!valor) {
          return "El apellido es obligatorio.";
        }

        if (valor.length < 3) {
          return "El apellido debe tener al menos 3 caracteres.";
        }

        if (valor.length > 15) {
          return "El apellido no puede superar los 15 caracteres.";
        }

        const apellidoRegex =
          /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

        if (!apellidoRegex.test(valor)) {
          return "El apellido solo puede contener letras.";
        }

        return "";
      }

      // ==========================================================
      // DNI
      // ==========================================================

      case "dni": {
        if (!valor) {
          return "El DNI es obligatorio.";
        }

        const dniRegex = /^[0-9]+$/;

        if (!dniRegex.test(valor)) {
          return "El DNI solo puede contener números.";
        }

        if (valor.length < 6) {
          return "El DNI debe tener al menos 6 dígitos.";
        }

        if (valor.length > 8) {
          return "El DNI no puede superar los 8 dígitos.";
        }

        return "";
      }

      // ==========================================================
      // TELEFONO
      // ==========================================================

      case "telefono": {
        if (!valor) {
          return "El teléfono es obligatorio.";
        }

        const telefonoRegex =
          /^[0-9]{10}$/;

        if (!telefonoRegex.test(valor)) {
          return "Ingresá 10 números. Ejemplo: 3411234567.";
        }

        return "";
      }

      // ==========================================================
      // EMAIL
      // ==========================================================

      case "email": {
        if (!valor) {
          return "El correo electrónico es obligatorio.";
        }

        const emailRegex =
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(valor)) {
          return "Ingresá un correo válido. Ejemplo: ejemplo@gmail.com";
        }

        return "";
      }

      // ==========================================================
      // TEMA
      // ==========================================================

      case "temas": {
        if (!value) {
          return "Seleccioná un tema de interés.";
        }

        return "";
      }

      default:
        return "";
    }
  };

  // ==============================================================
  // CAMBIO EN CAMPOS
  // ==============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    // ------------------------------------------------------------
    // NOMBRE
    // ------------------------------------------------------------

    if (name === "nombre") {
      nuevoValor = value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g,
        ""
      );

      nuevoValor = nuevoValor.slice(0, 9);
    }

    // ------------------------------------------------------------
    // APELLIDO
    // ------------------------------------------------------------

    if (name === "apellido") {
      nuevoValor = value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g,
        ""
      );

      nuevoValor = nuevoValor.slice(0, 15);
    }

    // ------------------------------------------------------------
    // DNI
    // ------------------------------------------------------------

    if (name === "dni") {
      nuevoValor = value
        .replace(/\D/g, "")
        .slice(0, 8);
    }

    // ------------------------------------------------------------
    // TELEFONO
    // ------------------------------------------------------------

    if (name === "telefono") {
      nuevoValor = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    // ------------------------------------------------------------
    // EMAIL
    // ------------------------------------------------------------

    if (name === "email") {
      nuevoValor = value
        .replace(/\s/g, "")
        .slice(0, 100);
    }

    // ============================================================
    // GUARDAR
    // ============================================================

    setFormData((prevData) => ({
      ...prevData,
      [name]: nuevoValor,
    }));

    // ============================================================
    // VALIDAR CAMPO
    // ============================================================

    const mensajeError = validarCampo(
      name,
      nuevoValor
    );

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: mensajeError,
    }));

    if (error) {
      setError(null);
    }

    if (success) {
      setSuccess(false);
    }
  };

  // ==============================================================
  // VALIDAR AL SALIR DEL CAMPO
  // ==============================================================

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const mensajeError = validarCampo(
      name,
      value
    );

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: mensajeError,
    }));
  };

  // ==============================================================
  // VALIDAR FORMULARIO COMPLETO
  // ==============================================================

  const validarFormulario = () => {
    const nuevosErrores = {};

    Object.entries(formData).forEach(
      ([name, value]) => {
        const mensajeError = validarCampo(
          name,
          value
        );

        if (mensajeError) {
          nuevosErrores[name] =
            mensajeError;
        }
      }
    );

    setErrors(nuevosErrores);

    return (
      Object.keys(nuevosErrores).length === 0
    );
  };

  // ==============================================================
  // BORRAR
  // ==============================================================

  const handleClear = () => {
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      email: "",
      temas: "",
    });

    setErrors({});
    setError(null);
    setSuccess(false);
  };

  // ==============================================================
  // ENVIAR
  // ==============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // ==========================================================
      // API
      // ==========================================================

      const response = await axios.post(
        "/workshop/event",
        formData
      );

      // ==========================================================
      // ÉXITO
      // ==========================================================

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        setSuccess(true);

        setFormData({
          nombre: "",
          apellido: "",
          dni: "",
          telefono: "",
          email: "",
          temas: "",
        });

        setErrors({});
      }
    } catch (err) {
      console.error(
        "Error al registrar inscripción:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Respuesta:",
        err.response?.data
      );

      const mensaje =
        err.response?.data?.message ||
        "Ocurrió un error al registrar la inscripción.";

      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  // RENDER
  // ==============================================================

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

        backgroundSize: {
          xs: "cover",
          md: "auto",
        },

        pt: {
          xs: 2,
          sm: 4,
          md: 6,
        },

        pb: {
          xs: 5,
          sm: 7,
          md: 8,
        },

        px: {
          xs: 1.5,
          sm: 2,
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >

        {/* ====================================================== */}
        {/* VOLVER AL INICIO                                       */}
        {/* ====================================================== */}

        <Box
          sx={{
            mb: {
              xs: 2.5,
              sm: 3,
            },
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#03083B",
              border:
                "2px solid #00B4FF",

              color: "#00B4FF",

              fontFamily: FONT_PIXEL,

              fontSize: {
                xs: "0.6rem",
                sm: "0.68rem",
              },

              minHeight: 42,

              px: {
                xs: 1.5,
                sm: 2,
              },

              boxShadow:
                "4px 4px 0px #D500BA",

              borderRadius: 0,

              textTransform: "uppercase",

              "&:hover": {
                backgroundColor:
                  "#03083B",
                color: "#FFFFFF",
                borderColor: "#00B4FF",
                boxShadow:
                  "5px 5px 0px #D500BA",
              },
            }}
          >
            ← Volver al inicio
          </Button>
        </Box>

        {/* ====================================================== */}
        {/* CARD                                                    */}
        {/* ====================================================== */}

        <Card
          sx={{
            bgcolor: "#03083B",

            border:
              "2px solid #00B4FF",

            boxShadow: {
              xs: "4px 4px 0px #D500BA",
              sm: "6px 6px 0px #D500BA",
            },

            borderRadius: 0,

            position: "relative",
          }}
        >
          <CornerDots />

          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
                md: 4.5,
              },
            }}
          >

            {/* ================================================= */}
            {/* TITULO                                             */}
            {/* ================================================= */}

            <Typography
              component="h1"
              align="left"
              sx={{
                color: "#00B4FF",

                fontFamily: FONT_MAIN,

                fontSize: {
                  xs: "1.8rem",
                  sm: "2.25rem",
                  md: "2.45rem",
                },

                fontWeight: 800,

                lineHeight: 1.05,

                letterSpacing: "-0.025em",

                mb: 1.2,
              }}
            >
              Inscribite al evento
            </Typography>

            {/* ================================================= */}
            {/* SUBTÍTULO                                          */}
            {/* ================================================= */}

            <Typography
              align="left"
              sx={{
                color: "#FFFFFF",
                opacity: 0.9,

                fontFamily: FONT_MAIN,

                fontSize: {
                  xs: "0.75rem",
                  sm: "0.85rem",
                },

                lineHeight: 1.5,

                maxWidth: 520,

                mb: 3.5,
              }}
            >
              Completá tus datos para reservar tu
              lugar en el Multimedia Day 2026.
            </Typography>

            {/* ================================================= */}
            {/* ERROR GENERAL                                       */}
            {/* ================================================= */}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  fontFamily: FONT_MAIN,
                }}
              >
                {error}
              </Alert>
            )}

            {/* ================================================= */}
            {/* ÉXITO                                              */}
            {/* ================================================= */}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 2.5,
                  fontFamily: FONT_MAIN,
                }}
              >
                ¡Inscripción completada con éxito!
              </Alert>
            )}

            {/* ================================================= */}
            {/* FORMULARIO                                          */}
            {/* ================================================= */}

            <InscripcionForm
              formData={formData}
              errors={errors}
              loading={loading}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}