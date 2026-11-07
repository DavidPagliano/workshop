import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Grid,
  Typography,
} from "@mui/material";
import { alpha, ThemeProvider } from "@mui/material/styles";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import { institutionalTheme } from "../../config/theme";
import logoTsm from "../../assets/images/logo-tsm.png";

const STEPS_PREVIEW = [
  {
    number: "01",
    title: "Foto del estudiante",
    description: "Tomate una foto de frente en el momento usando la cámara de tu dispositivo.",
    icon: <CameraAltOutlinedIcon fontSize="medium" />,
  },
  {
    number: "02",
    title: "Datos principales",
    description: "Completá tus datos personales, de contacto, estudios y contacto de emergencia.",
    icon: <AssignmentIndOutlinedIcon fontSize="medium" />,
  },
  {
    number: "03",
    title: "Ficha médica",
    description: "Ingresá tu información de salud, obra social, emergencia médica y familia de referencia.",
    icon: <MedicalInformationOutlinedIcon fontSize="medium" />,
  },
];

const TsmWelcomePage = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={institutionalTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={500}>
            <Card>
              <CardContent sx={{ p: { xs: 3, sm: 5, md: 6 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    mb: { xs: 4, sm: 5 },
                  }}
                >
                  <Box
                    component="img"
                    src={logoTsm}
                    alt="Logo TSM"
                    sx={{
                      height: { xs: 56, sm: 72 },
                      objectFit: "contain",
                      mb: 2.5,
                    }}
                  />

                  <Typography
                    variant="overline"
                    sx={{
                      color: "secondary.main",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      mb: 0.5,
                    }}
                  >
                    CICLO LECTIVO 2027
                  </Typography>

                  <Typography
                    component="h1"
                    variant="h3"
                    sx={{
                      fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.75rem" },
                      mb: 1.5,
                    }}
                  >
                    ¡Bienvenidos al TSM!
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      maxWidth: 560,
                    }}
                  >
                    Desde este portal vas a poder completar tu inscripción al Ciclo Lectivo 2027
                    de manera rápida y guiada en tres simples pasos.
                  </Typography>
                </Box>

                <Grid container spacing={2.5} sx={{ mb: { xs: 4, sm: 5 } }}>
                  {STEPS_PREVIEW.map((step) => (
                    <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                      <Box
                        sx={(theme) => ({
                          height: "100%",
                          p: 2.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.25,
                        })}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={(theme) => ({
                              width: 42,
                              height: 42,
                              borderRadius: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: "secondary.main",
                            })}
                          >
                            {step.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              color: "text.secondary",
                              letterSpacing: "0.08em",
                            }}
                          >
                            PASO {step.number}
                          </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ fontSize: "1.05rem" }}>
                          {step.title}
                        </Typography>

                        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.55 }}>
                          {step.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/inscripcion-tsm")}
                    sx={{
                      minHeight: 52,
                      px: { xs: 3, sm: 5 },
                      fontSize: "1rem",
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

export default TsmWelcomePage;

