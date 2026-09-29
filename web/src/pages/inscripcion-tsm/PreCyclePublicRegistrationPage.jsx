import { useMemo } from "react";
import { Box, Button, Card, CardContent, Container, Fade, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PreCycleRegistrationForm } from "../../components/inscripcion-tsm/PreCycleRegistrationForm";
import PreCycleRegistrationSuccess from "../../components/inscripcion-tsm/PreCycleRegistrationSuccess";
import { usePreCyclePublicRegistration } from "../../hooks/usePreCyclePublicRegistration";
import bgGrid from "../../assets/images/fondo/FONDO3.png";

const FloatingBookBackground = () => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={{
      position: "absolute",
      top: "10%",
      right: "8%",
      width: { xs: 30, sm: 40 },
      height: { xs: 30, sm: 40 },
      color: "#D500BA",
      filter: "drop-shadow(0px 0px 8px rgba(213, 0, 186, 0.5))",
      opacity: 0.2,
      pointerEvents: "none",
      zIndex: 1,
      animation: "floatBook 16s ease-in-out infinite",
      "@keyframes floatBook": {
        "0%": { transform: "translate(0px, 0px) rotate(0deg)" },
        "25%": { transform: "translate(-180px, 100px) rotate(-10deg)" },
        "50%": { transform: "translate(-60px, 240px) rotate(8deg)" },
        "75%": { transform: "translate(-220px, 50px) rotate(-12deg)" },
        "100%": { transform: "translate(0px, 0px) rotate(0deg)" },
      },
    }}
  >
    <path
      fill="currentColor"
      d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.65 1 5.5v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.15 5.05 19.5 6.5 19.5c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V5.5C21.5 5.25 21.25 5 21 5z"
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

const PreCyclePublicRegistrationPage = () => {
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
  } = usePreCyclePublicRegistration();

  const requiredFields = [
    "nombre", "apellido", "dni", "edad", "telefono", "email", "fechaNacimiento",
  ];

  const progress = useMemo(() => {
    const completed = requiredFields.filter(
      (field) => String(formData[field] || "").trim() && !errors[field],
    ).length;
    return Math.round((completed / requiredFields.length) * 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, formData]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        backgroundImage: `url(${bgGrid})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: { xs: "cover", md: "auto" },
        pt: { xs: 2, sm: 3.5, md: 5 },
        pb: { xs: 5, sm: 7, md: 8 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2, px: { xs: 0.5, sm: 2 } }}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#03083B",
              border: "2px solid #00B4FF",
              color: "#00B4FF",
              fontFamily: theme.typography.button.fontFamily,
              fontSize: { xs: "0.55rem", sm: "0.68rem" },
              minHeight: { xs: 38, sm: 42 },
              px: { xs: 1.2, sm: 2 },
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
            <FloatingBookBackground />
            <CardContent sx={{ p: { xs: 2, sm: 3.5, md: 4.5 }, position: "relative", zIndex: 2 }}>
              {registration ? (
                <PreCycleRegistrationSuccess
                  registration={registration}
                  onReset={resetRegistration}
                />
              ) : (
                <Box>
                  <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                      <Typography sx={{ fontFamily: theme.typography.button.fontFamily, fontSize: { xs: "0.55rem", sm: "0.68rem" }, color: "#00B4FF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Progreso de inscripción
                      </Typography>
                      <Typography sx={{ fontFamily: theme.typography.fontFamily, fontSize: { xs: "0.75rem", sm: "0.85rem" }, color: "#D500BA", fontWeight: 800, lineHeight: 1 }}>
                        {progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 0, backgroundColor: "rgba(3, 8, 59, 0.6)", border: "1px solid #00B4FF", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #00B4FF 0%, #D500BA 100%)", transition: "transform 0.4s ease" } }} />
                  </Box>
                  <Typography component="h1" align="left" sx={{ color: "#00B4FF", fontFamily: theme.typography.fontFamily, fontSize: { xs: "1.5rem", sm: "2.1rem", md: "2.45rem" }, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em", mb: 1.2, wordBreak: "break-word" }}>
                    Pre-inscripción Ciclo Electivo
                  </Typography>
                  <Typography align="left" sx={{ color: "#FFFFFF", opacity: 0.9, fontFamily: theme.typography.fontFamily, fontSize: { xs: "0.75rem", sm: "0.85rem" }, lineHeight: 1.5, maxWidth: 520, mb: { xs: 2.5, sm: 3.5 } }}>
                    Completá tus datos para pre-inscribirte al Ciclo Electivo 2027 de TSM.
                  </Typography>
                  <PreCycleRegistrationForm formData={formData} error={error} errors={errors} loading={loading} handleChange={handleChange} handleBlur={handleBlur} onSubmit={submitRegistration} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default PreCyclePublicRegistrationPage;
