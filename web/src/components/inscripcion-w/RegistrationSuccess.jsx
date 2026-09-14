import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Box, Button, Typography } from "@mui/material";

const RegistrationSuccess = ({ registration, onReset }) => {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 2, sm: 4 } }}>
      <CheckCircleOutlineIcon
        sx={{ color: "primary.main", fontSize: { xs: 48, sm: 64 }, mb: 1 }}
      />
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 1, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
      >
        ¡Inscripción confirmada!
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.78)", mb: 3 }}>
        {registration.nombre}, ya estás registrado para el Multimedia Day 2026.
      </Typography>
      <Box sx={{ p: 2, mb: 3, border: "1px dashed", borderColor: "secondary.main" }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          Tu número de inscripción
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "secondary.main",
            fontWeight: 800,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          {registration.registrarId}
        </Typography>
      </Box>
      <Button variant="outlined" onClick={onReset}>
        Registrar a otra persona
      </Button>
    </Box>
  );
};

export default RegistrationSuccess;
