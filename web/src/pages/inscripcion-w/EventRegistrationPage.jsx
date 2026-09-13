import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Box, Button, Container, Fade, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { EventRegistrationForm } from "../../components/inscripcion-w/EventRegistrationForm";
import { useEventRegistration } from "../../hooks/useEventRegistration";

const EventRegistrationPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    error,
    registration,
    handleChange,
    submitRegistration,
    resetRegistration,
  } = useEventRegistration();

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: { xs: 5, sm: 8 } }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{
          mb: 3,
          bgcolor: "rgba(3, 8, 59, 0.95)",
          color: "primary.main",
          borderColor: "primary.main",
          boxShadow: "3px 3px 0 #D500BA",
          "&:hover": {
            bgcolor: "primary.main",
            color: "#03083B",
            borderColor: "primary.main",
          },
        }}
      >
        Volver al inicio
      </Button>

      <Fade in timeout={500}>
        <Paper
          sx={{
            p: { xs: 2.5, sm: 5 },
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "6px 6px 0 #D500BA",
            borderRadius: 0,
            bgcolor: "rgba(3, 8, 59, 0.92)",
          }}
        >
          {registration ? (
            <Box sx={{ textAlign: "center", py: { xs: 2, sm: 4 } }}>
              <CheckCircleOutlineIcon sx={{ color: "primary.main", fontSize: 64, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                ¡Inscripción confirmada!
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.78)", mb: 3 }}>
                {registration.nombre}, ya estás registrado para el Multimedia Day 2026.
              </Typography>
              <Box sx={{ p: 2, mb: 3, border: "1px dashed", borderColor: "secondary.main" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Tu número de inscripción
                </Typography>
                <Typography variant="h5" sx={{ color: "secondary.main", fontWeight: 800 }}>
                  {registration.registrarId}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={resetRegistration}>
                Registrar a otra persona
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                Inscribite al evento
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.78)", mb: 4 }}>
                Completá tus datos para reservar tu lugar en el Multimedia Day 2026.
              </Typography>
              <EventRegistrationForm
                formData={formData}
                error={error}
                loading={loading}
                handleChange={handleChange}
                onSubmit={submitRegistration}
              />
            </>
          )}
        </Paper>
      </Fade>
    </Container>
  );
};

export default EventRegistrationPage;
