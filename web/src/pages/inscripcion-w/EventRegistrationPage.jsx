import { useMemo } from "react";
import { Box, Button, Card, CardContent, Container, Fade, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { EventRegistrationForm } from "../../components/inscripcion-w/EventRegistrationForm";
import RegistrationSuccess from "../../components/inscripcion-w/RegistrationSuccess";
import { useEventRegistration } from "../../hooks/useEventRegistration";
import bgGrid from "../../assets/images/fondo/FONDO3.png";

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
        "0%": { transform: "translate(0px, 0px) rotate(0deg)" },
        "25%": { transform: "translate(200px, 120px) rotate(12deg)" },
        "50%": { transform: "translate(90px, 280px) rotate(-8deg)" },
        "75%": { transform: "translate(260px, 60px) rotate(15deg)" },
        "100%": { transform: "translate(0px, 0px) rotate(0deg)" },
      },
    }}
  >
    <path
      fill="currentColor"
      d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L10.13 16.7L6.64 19.47C6.26 19.77 5.71 19.7 5.4 19.32C5.22 19.09 5.14 18.8 5.17 18.51L7.54 2.89C7.62 2.34 8.13 1.95 8.68 2.03C8.91 2.07 9.12 2.19 9.27 2.37L20.44 14.54C20.8 14.95 20.75 15.58 20.34 15.94C20.12 16.14 19.82 16.23 19.53 16.18L14.77 15.34L16.95 20.14C17.18 20.64 16.97 21.24 16.47 21.47L13.64 21.97Z"
    />
  </Box>
);

const CornerDots = ({ size = 8, offset = -5, color = "#00B4FF" }) => {
  const positions = [
    { top: offset, left: offset },
    { top: offset, right: offset },
    { bottom: offset, left: offset },
    { bottom: offset, right: offset },
  ];

  return positions.map((position, index) => (
    <Box
      key={index}
      sx={{ position: "absolute", width: size, height: size, bgcolor: color, ...position }}
    />
  ));
};

const EventRegistrationPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    formData,
    loading,
    error,
    errors = {},
    registration,
    handleChange,
    handleBlur,
    submitRegistration,
    resetRegistration,
  } = useEventRegistration();

  const progress = useMemo(() => {
    const fields = ["nombre", "apellido", "dni", "telefono", "email", "temas"];
    const completed = fields.filter(
      (field) => String(formData[field] || "").trim() && !errors[field],
    ).length;
    return Math.round((completed / fields.length) * 100);
  }, [errors, formData]);

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
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#03083B",
              border: "2px solid #00B4FF",
              color: "#00B4FF",
              fontFamily: theme.typography.button.fontFamily,
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

        <Fade in timeout={500}>
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
            <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 4.5 }, position: "relative", zIndex: 2 }}>
              {registration ? (
                <RegistrationSuccess
                  registration={registration}
                  onReset={resetRegistration}
                />
              ) : (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                      <Typography sx={{ fontFamily: theme.typography.button.fontFamily, fontSize: { xs: "0.58rem", sm: "0.68rem" }, color: "#00B4FF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Progreso de inscripción
                      </Typography>
                      <Typography sx={{ fontFamily: theme.typography.button.fontFamily, fontSize: { xs: "0.6rem", sm: "0.7rem" }, color: "#D500BA", fontWeight: "bold" }}>
                        {progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 0, backgroundColor: "rgba(3, 8, 59, 0.6)", border: "1px solid #00B4FF", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #00B4FF 0%, #D500BA 100%)", transition: "transform 0.4s ease" } }} />
                  </Box>
                  <Typography component="h1" align="left" sx={{ color: "#00B4FF", fontFamily: theme.typography.fontFamily, fontSize: { xs: "1.8rem", sm: "2.25rem", md: "2.45rem" }, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.025em", mb: 1.2 }}>
                    Inscribite al evento
                  </Typography>
                  <Typography align="left" sx={{ color: "#FFFFFF", opacity: 0.9, fontFamily: theme.typography.fontFamily, fontSize: { xs: "0.75rem", sm: "0.85rem" }, lineHeight: 1.5, maxWidth: 520, mb: 3.5 }}>
                    Completá tus datos para reservar tu lugar en el Multimedia Day 2026.
                  </Typography>
                  <EventRegistrationForm formData={formData} error={error} errors={errors} loading={loading} handleChange={handleChange} handleBlur={handleBlur} onSubmit={submitRegistration} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default EventRegistrationPage;
