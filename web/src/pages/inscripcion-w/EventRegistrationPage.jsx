import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Container, Fade, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { EventRegistrationForm } from "../../components/inscripcion-w/EventRegistrationForm";
import RegistrationSuccess from "../../components/inscripcion-w/RegistrationSuccess";
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
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 5, md: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        size="small"
        sx={{
          mb: { xs: 2, sm: 3 },
          bgcolor: "rgba(3, 8, 59, 0.95)",
          color: "primary.main",
          borderColor: "primary.main",
          boxShadow: "3px 3px 0 #D500BA",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
            p: { xs: 2, sm: 3, md: 5 },
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: { xs: "4px 4px 0 #D500BA", sm: "6px 6px 0 #D500BA" },
            borderRadius: 0,
            bgcolor: "rgba(3, 8, 59, 0.92)",
          }}
        >
          {registration ? (
            <RegistrationSuccess
              registration={registration}
              onReset={resetRegistration}
            />
          ) : (
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                Inscribite al evento
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.78)",
                  mb: { xs: 2.5, sm: 4 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Completá tus datos para reservar tu lugar en el Multimedia Day 2026.
              </Typography>
              <EventRegistrationForm
                formData={formData}
                error={error}
                loading={loading}
                handleChange={handleChange}
                onSubmit={submitRegistration}
              />
            </Box>
          )}
        </Paper>
      </Fade>
    </Container>
  );
};

export default EventRegistrationPage;
