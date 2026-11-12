import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  Typography,
} from "@mui/material";
import { alpha, ThemeProvider } from "@mui/material/styles";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { useNavigate } from "react-router-dom";

import { tspTheme } from "../../config/theme";

const STEPS_PREVIEW = [
  {
    number: "01",
    title: "Foto del estudiante",
    icon: <CameraAltOutlinedIcon fontSize="small" />,
  },
  {
    number: "02",
    title: "Datos principales",
    icon: <AssignmentIndOutlinedIcon fontSize="small" />,
  },
  {
    number: "03",
    title: "Fotos del DNI",
    icon: <BadgeOutlinedIcon fontSize="small" />,
  },
  {
    number: "04",
    title: "Ficha médica",
    icon: <MedicalInformationOutlinedIcon fontSize="small" />,
  },
  {
    number: "05",
    title: "Pago de inscripción",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    number: "06",
    title: "Confirmación",
    icon: <VerifiedUserOutlinedIcon fontSize="small" />,
  },
];

const StepCard = ({ step }) => (
  <Box
    sx={(theme) => ({
      p: 1.5,
      height: "100%",
      boxSizing: "border-box",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: alpha(theme.palette.primary.main, 0.02),
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      transition: "all 0.15s ease-in-out",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
        borderColor: "primary.main",
      },
    })}
  >
    <Box
      sx={(theme) => ({
        width: 36,
        height: 36,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: alpha(theme.palette.secondary.main, 0.12),
        color: "secondary.main",
        flexShrink: 0,
      })}
    >
      {step.icon}
    </Box>

    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color: "text.secondary",
          letterSpacing: "0.06em",
          display: "block",
          lineHeight: 1.2,
        }}
      >
        PASO {step.number}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.25,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {step.title}
      </Typography>
    </Box>
  </Box>
);

const TspWelcomePage = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={tspTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          py: { xs: 2.5, sm: 4, md: 5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="md" disableGutters>
          {/* Barra superior con volver al inicio */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              boxSizing: "border-box",
              px: { xs: 1, sm: 0.5 },
              mb: { xs: 2, sm: 2.5 },
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/")}
            >
              ← Volver al inicio
            </Button>
            <Chip
              label="TSP · 2027"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, letterSpacing: "0.05em" }}
            />
          </Box>

          <Fade in timeout={500}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 4.5 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    mb: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Box
                    sx={(theme) => ({
                      width: { xs: 52, sm: 60 },
                      height: { xs: 52, sm: 60 },
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                      border: "2px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.25),
                    })}
                  >
                    <NewspaperIcon sx={{ fontSize: { xs: 28, sm: 34 } }} />
                  </Box>

                  <Typography
                    variant="overline"
                    sx={{
                      color: "secondary.main",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    CICLO LECTIVO 2027
                  </Typography>

                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      fontSize: { xs: "1.75rem", sm: "2.15rem", md: "2.35rem" },
                      fontWeight: 800,
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    ¡Bienvenidos al TSP!
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      maxWidth: 560,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    Portal de ingreso para la{" "}
                    <strong>Tecnico Superior en Periodismo</strong>. Completá tu
                    solicitud de inscripción online en simples pasos:
                  </Typography>
                </Box>

                {/* Pasos ordenados: Fila 1 (Pasos 1-4) | Fila 2 (Paso 5 y 6 centrados abajo del 2 y 3) */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 1.5,
                    mb: { xs: 3, sm: 3.5 },
                  }}
                >
                  {/* Fila 1: Paso 1 al 4 */}
                  <Box sx={{ minWidth: 0 }}>
                    <StepCard step={STEPS_PREVIEW[0]} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <StepCard step={STEPS_PREVIEW[1]} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <StepCard step={STEPS_PREVIEW[2]} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <StepCard step={STEPS_PREVIEW[3]} />
                  </Box>

                  {/* Fila 2: Paso 5 y 6 alineados exactamente abajo del Paso 2 y Paso 3 */}
                  <Box
                    sx={{
                      minWidth: 0,
                      gridColumn: { xs: "auto", md: "2 / 3" },
                    }}
                  >
                    <StepCard step={STEPS_PREVIEW[4]} />
                  </Box>
                  <Box
                    sx={{
                      minWidth: 0,
                      gridColumn: { xs: "auto", md: "3 / 4" },
                    }}
                  >
                    <StepCard step={STEPS_PREVIEW[5]} />
                  </Box>
                </Box>

                {/* Botón principal visible inmediatamente */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/inscripcion-tsp")}
                    sx={{
                      minHeight: 50,
                      px: { xs: 4, sm: 6 },
                      fontSize: "1rem",
                      fontWeight: 700,
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Comenzar inscripción
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TspWelcomePage;
