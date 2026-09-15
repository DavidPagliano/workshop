import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Stack,
  SvgIcon,
} from "@mui/material";
import axios from "axios";

// ================================================================
// COMPONENTE FORMULARIO
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
// ÍCONO CHECK (Evita errores de importación de @mui/icons-material)
// ================================================================
function CheckCircleIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
    </SvgIcon>
  );
}

// ================================================================
// PUNTERO DE MOUSE ANIMADO (FONDO FORMULARIO)
// ================================================================
const FloatingCursorBackground = () => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={{
      position: "absolute",
      top: "8%",
      left: "8%",
      width: { xs: 32, sm: 44 },
      height: { xs: 32, sm: 44 },
      color: "#00B4FF",
      filter: "drop-shadow(0px 0px 8px rgba(0, 180, 255, 0.6))",
      opacity: 0.25,
      pointerEvents: "none",
      zIndex: 1,
      animation: "floatCursor 14s ease-in-out infinite",
      "@keyframes floatCursor": {
        "0%": {
          transform: "translate(0px, 0px) rotate(0deg)",
        },
        "25%": {
          transform: "translate(200px, 120px) rotate(12deg)",
        },
        "50%": {
          transform: "translate(90px, 280px) rotate(-8deg)",
        },
        "75%": {
          transform: "translate(260px, 60px) rotate(15deg)",
        },
        "100%": {
          transform: "translate(0px, 0px) rotate(0deg)",
        },
      },
    }}
  >
    <path
      fill="currentColor"
      d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L10.13 16.7L6.64 19.47C6.26 19.77 5.71 19.7 5.4 19.32C5.22 19.09 5.14 18.8 5.17 18.51L7.54 2.89C7.62 2.34 8.13 1.95 8.68 2.03C8.91 2.07 9.12 2.19 9.27 2.37L20.44 14.54C20.8 14.95 20.75 15.58 20.34 15.94C20.12 16.14 19.82 16.23 19.53 16.18L14.77 15.34L16.95 20.14C17.18 20.64 16.97 21.24 16.47 21.47L13.64 21.97Z"
    />
  </Box>
);

// ================================================================
// DECORACIÓN DE ESQUINAS
// ================================================================
const CornerDots = ({ size = 8, offset = -5, color = "#00B4FF" }) => {
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

  const initialFormState = {
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    temas: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState(null);

  const validarCampo = (name, value) => {
    const valor = typeof value === "string" ? value.trim() : "";

    switch (name) {
      case "nombre": {
        if (!valor) return "El nombre es obligatorio.";
        if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
        if (valor.length > 9) return "El nombre no puede superar los 9 caracteres.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(valor)) return "El nombre solo puede contener letras.";
        return "";
      }
      case "apellido": {
        if (!valor) return "El apellido es obligatorio.";
        if (valor.length < 3) return "El apellido debe tener al menos 3 caracteres.";
        if (valor.length > 15) return "El apellido no puede superar los 15 caracteres.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(valor)) return "El apellido solo puede contener letras.";
        return "";
      }
      case "dni": {
        if (!valor) return "El DNI es obligatorio.";
        if (!/^[0-9]+$/.test(valor)) return "El DNI solo puede contener números.";
        if (valor.length < 6) return "El DNI debe tener al menos 6 dígitos.";
        if (valor.length > 8) return "El DNI no puede superar los 8 dígitos.";
        return "";
      }
      case "telefono": {
        if (!valor) return "El teléfono es obligatorio.";
        if (!/^[0-9]{10}$/.test(valor)) return "Ingresá 10 números. Ejemplo: 3411234567.";
        return "";
      }
      case "email": {
        if (!valor) return "El correo electrónico es obligatorio.";
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(valor)) {
          return "Ingresá un correo válido. Ejemplo: ejemplo@gmail.com";
        }
        return "";
      }
      case "temas": {
        if (!value) return "Seleccioná un tema de interés.";
        return "";
      }
      default:
        return "";
    }
  };

  const progresoFormulario = useMemo(() => {
    const campos = ["nombre", "apellido", "dni", "telefono", "email", "temas"];
    let camposValidos = 0;

    campos.forEach((campo) => {
      const valor = formData[campo];
      if (valor && typeof valor === "string" && valor.trim() !== "") {
        const errorCampo = validarCampo(campo, valor);
        if (!errorCampo) {
          camposValidos += 1;
        }
      }
    });

    return Math.round((camposValidos / campos.length) * 100);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === "nombre") {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g, "").slice(0, 9);
    } else if (name === "apellido") {
      nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g, "").slice(0, 15);
    } else if (name === "dni") {
      nuevoValor = value.replace(/\D/g, "").slice(0, 8);
    } else if (name === "telefono") {
      nuevoValor = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "email") {
      nuevoValor = value.replace(/\s/g, "").slice(0, 100);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: nuevoValor,
    }));

    const mensajeError = validarCampo(name, nuevoValor);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: mensajeError,
    }));

    if (error) setError(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const mensajeError = validarCampo(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: mensajeError,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    Object.entries(formData).forEach(([name, value]) => {
      const mensajeError = validarCampo(name, value);
      if (mensajeError) {
        nuevosErrores[name] = mensajeError;
      }
    });

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validarFormulario()) return;

    setLoading(true);

    const payload = {
      ...formData,
      seRegistro: true,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    try {
      const response = await axios.post("/workshop/event", payload);

      if (response.status === 200 || response.status === 201) {
        setRegisteredEmail(formData.email);
        setSuccess(true);
        setFormData(initialFormState);
        setErrors({});
      }
    } catch (err) {
      console.error("Error al registrar inscripción:", err);
      const mensaje =
        err.response?.data?.message ||
        "Ocurrió un error al registrar la inscripción.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

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
        backgroundSize: { xs: "cover", md: "auto" },
        pt: { xs: 2, sm: 4, md: 6 },
        pb: { xs: 5, sm: 7, md: 8 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        {/* VOLVER AL INICIO */}
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#03083B",
              border: "2px solid #00B4FF",
              color: "#00B4FF",
              fontFamily: FONT_PIXEL,
              fontSize: { xs: "0.6rem", sm: "0.68rem" },
              minHeight: 42,
              px: { xs: 1.5, sm: 2 },
              boxShadow: "4px 4px 0px #D500BA",
              borderRadius: 0,
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "#03083B",
                color: "#FFFFFF",
                borderColor: "#00B4FF",
                boxShadow: "5px 5px 0px #D500BA",
              },
            }}
          >
            ← Volver al inicio
          </Button>
        </Box>

        {/* CARD PRINCIPAL */}
        <Card
          sx={{
            bgcolor: "#03083B",
            border: "2px solid #00B4FF",
            boxShadow: { xs: "4px 4px 0px #D500BA", sm: "6px 6px 0px #D500BA" },
            borderRadius: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CornerDots />
          <FloatingCursorBackground />

          <CardContent
            sx={{
              p: { xs: 2.5, sm: 4, md: 4.5 },
              position: "relative",
              zIndex: 2,
            }}
          >
            {success ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  py: { xs: 2, sm: 4 },
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: { xs: 70, sm: 90 },
                    color: "#00FF88",
                    filter: "drop-shadow(0px 0px 10px rgba(0, 255, 136, 0.6))",
                    mb: 2,
                  }}
                />

                <Typography
                  component="h2"
                  sx={{
                    color: "#00FF88",
                    fontFamily: FONT_PIXEL,
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    mb: 1.5,
                  }}
                >
                  ¡Registro Exitoso!
                </Typography>

                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: FONT_MAIN,
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    lineHeight: 1.6,
                    maxWidth: 420,
                    mb: 4,
                  }}
                >
                  Te enviamos por mail tu invitación a{" "}
                  <Box
                    component="span"
                    sx={{ color: "#00B4FF", fontWeight: "bold" }}
                  >
                    {registeredEmail}
                  </Box>
                  . ¡Te esperamos en el Multimedia Day 2026!
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setSuccess(false)}
                    sx={{
                      minHeight: 48,
                      border: "2px solid #00B4FF",
                      color: "#00B4FF",
                      fontFamily: FONT_PIXEL,
                      fontSize: "0.65rem",
                      boxShadow: "3px 3px 0px #D500BA",
                      "&:hover": {
                        backgroundColor: "rgba(0, 180, 255, 0.1)",
                        borderColor: "#00B4FF",
                      },
                    }}
                  >
                    Inscribir a otra persona
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{
                      minHeight: 48,
                      fontFamily: FONT_PIXEL,
                      fontSize: "0.65rem",
                      background: "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
                      boxShadow: "3px 3px 0px #00B4FF",
                      color: "#FFFFFF",
                    }}
                  >
                    Volver al inicio
                  </Button>
                </Stack>
              </Box>
            ) : (
              <>
                {/* CHARGEBAR */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_PIXEL,
                        fontSize: { xs: "0.58rem", sm: "0.68rem" },
                        color: "#00B4FF",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Progreso de inscripción
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_PIXEL,
                        fontSize: { xs: "0.6rem", sm: "0.7rem" },
                        color: "#D500BA",
                        fontWeight: "bold",
                      }}
                    >
                      {progresoFormulario}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={progresoFormulario}
                    sx={{
                      height: 10,
                      borderRadius: 0,
                      backgroundColor: "rgba(3, 8, 59, 0.6)",
                      border: "1px solid #00B4FF",
                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(90deg, #00B4FF 0%, #D500BA 100%)",
                        transition: "transform 0.4s ease",
                      },
                    }}
                  />
                </Box>

                {/* TÍTULO */}
                <Typography
                  component="h1"
                  align="left"
                  sx={{
                    color: "#00B4FF",
                    fontFamily: FONT_MAIN,
                    fontSize: { xs: "1.8rem", sm: "2.25rem", md: "2.45rem" },
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    mb: 1.2,
                  }}
                >
                  Inscribite al evento
                </Typography>

                {/* SUBTÍTULO */}
                <Typography
                  align="left"
                  sx={{
                    color: "#FFFFFF",
                    opacity: 0.9,
                    fontFamily: FONT_MAIN,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    lineHeight: 1.5,
                    maxWidth: 520,
                    mb: 3.5,
                  }}
                >
                  Completá tus datos para reservar tu lugar en el Multimedia Day 2026.
                </Typography>

                {/* ALERTA DE ERROR GENERAL */}
                {error && (
                  <Alert severity="error" sx={{ mb: 2.5, fontFamily: FONT_MAIN }}>
                    {error}
                  </Alert>
                )}

                {/* FORMULARIO */}
                <InscripcionForm
                  formData={formData}
                  errors={errors}
                  loading={loading}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}