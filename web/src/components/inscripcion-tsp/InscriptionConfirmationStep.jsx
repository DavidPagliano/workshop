import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import { AÑOS_A_CURSAR } from "../../config/inscriptionFields";

export const InscriptionConfirmationStep = ({
  formData,
  career = "TSP",
}) => {
  const añoLabel =
    AÑOS_A_CURSAR.find((opt) => opt.value === formData.añoACursar)?.label ||
    formData.añoACursar;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Mensaje formal principal */}
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 2,
          border: "2px solid",
          borderColor: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          textAlign: "center",
        })}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <VerifiedUserIcon sx={{ fontSize: { xs: 54, sm: 64 }, color: "primary.main" }} />
        </Box>

        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 800, mb: 1.5, color: "primary.main" }}
        >
          Confirmación y verificación de la solicitud
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            maxWidth: 620,
            mx: "auto",
            lineHeight: 1.7,
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            fontWeight: 500,
          }}
        >
          <strong>Verificaremos su inscripción, ficha médica y comprobante de pago</strong>.
          Una vez enviada la solicitud, el equipo directivo y administrativo revisará la documentación ingresada
          y nos comunicaremos con usted a la brevedad para continuar con su proceso formal de inscripción
          al Ciclo Lectivo 2027.
        </Typography>
      </Paper>

      {/* Resumen del postulante */}
      <Card variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "text.secondary",
            mb: 2,
          }}
        >
          Resumen de datos y documentación — {career}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "center", sm: "flex-start" }}
          sx={{ mb: 2.5 }}
        >
          <Avatar
            src={formData.foto || undefined}
            alt={formData.nombre}
            sx={{
              width: 72,
              height: 72,
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <PersonIcon />
          </Avatar>

          <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {formData.nombre} {formData.apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DNI: {formData.dni} · Carrera: {career} · {añoLabel || "1er año"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tel: {formData.telefono} · Correo: {formData.email}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Lista de verificación de archivos */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "text.secondary",
            display: "block",
            mb: 1.5,
          }}
        >
          Estado de la documentación adjunta:
        </Typography>

        <Stack spacing={1}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Fotografía de perfil del estudiante adjunta
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Documento Nacional de Identidad (DNI frente y dorso) cargado
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Ficha médica y datos de emergencia completados
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Comprobante de pago de inscripción adjunto
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

