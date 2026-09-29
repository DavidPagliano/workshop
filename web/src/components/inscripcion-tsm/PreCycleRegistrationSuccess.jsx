import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import SchoolIcon from "@mui/icons-material/School";
import ChurchIcon from "@mui/icons-material/Church";

const TITULO_LABELS = {
  si: "Sí",
  no: "No",
  incompleto: "Incompleto",
};

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

const TicketRow = ({ icon, label, value }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 1,
        px: { xs: 1, sm: 1.5 },
        "&:hover": { bgcolor: "rgba(0, 180, 255, 0.04)" },
      }}
    >
      <Box sx={{ color: "primary.main", display: "flex", fontSize: 18, mt: "2px", flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: "primary.main",
            fontFamily: theme.typography.button.fontFamily,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: { xs: "0.5rem", sm: "0.55rem" },
            display: "block",
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontFamily: theme.typography.fontFamily,
            wordBreak: "break-word",
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            lineHeight: 1.4,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const WORKSHOP_URL = "https://workshop2026.complejoiema.com.ar/";

const PreCycleRegistrationSuccess = ({ registration }) => {
  const theme = useTheme();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = WORKSHOP_URL;
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formattedDate = registration.fechaNacimiento
    ? new Date(registration.fechaNacimiento).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  return (
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
          fontFamily: theme.typography.button.fontFamily,
          fontSize: { xs: "1.2rem", sm: "1.5rem" },
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          mb: 1.5,
        }}
      >
        ¡Pre-inscripción Exitosa!
      </Typography>

      <Typography
        sx={{
          color: "#FFFFFF",
          fontFamily: theme.typography.fontFamily,
          fontSize: { xs: "0.85rem", sm: "1rem" },
          lineHeight: 1.6,
          maxWidth: 420,
          mb: 4,
        }}
      >
        Tu pre-inscripción al Ciclo Electivo 2027 fue registrada correctamente.
        Nos pondremos en contacto con vos pronto.
      </Typography>

      <Box
        sx={{
          width: "100%",
          border: "1.5px solid",
          borderColor: "primary.main",
          boxShadow: "5px 5px 0px rgba(213, 0, 186, 0.5)",
          bgcolor: "rgba(3, 8, 59, 0.95)",
          overflow: "hidden",
          mb: 2,
          textAlign: "left",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontFamily: theme.typography.fontFamily,
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              CICLO ELECTIVO{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                2027
              </Box>
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontFamily: theme.typography.button.fontFamily,
                letterSpacing: "0.05em",
                fontSize: { xs: "0.48rem", sm: "0.52rem" },
                mt: 0.5,
              }}
            >
              COMPROBANTE DE PRE-INSCRIPCIÓN
            </Typography>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 0.8,
              border: "1.5px solid",
              borderColor: "secondary.main",
              boxShadow: "3px 3px 0px rgba(0, 180, 255, 0.3)",
              textAlign: "center",
              alignSelf: { xs: "stretch", sm: "auto" },
              minWidth: 100,
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
                fontFamily: theme.typography.button.fontFamily,
                fontSize: "0.45rem",
                display: "block",
                letterSpacing: "0.05em",
              }}
            >
              N° REGISTRO
            </Typography>
            <Typography
              sx={{
                color: "secondary.main",
                fontWeight: 800,
                fontFamily: theme.typography.fontFamily,
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}
            >
              {registration.registrarId}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 1.5 }, py: 1.5 }}>
          <TicketRow
            icon={<PersonIcon fontSize="small" />}
            label="Nombre completo"
            value={`${registration.nombre} ${registration.apellido}`}
          />
          <TicketRow
            icon={<BadgeIcon fontSize="small" />}
            label="DNI"
            value={registration.dni}
          />
          <TicketRow
            icon={<EmailIcon fontSize="small" />}
            label="Email"
            value={registration.email}
          />
          <TicketRow
            icon={<PhoneIcon fontSize="small" />}
            label="Teléfono"
            value={registration.telefono}
          />
          <TicketRow
            icon={<CakeIcon fontSize="small" />}
            label="Fecha de nacimiento"
            value={`${formattedDate} — ${registration.edad} años`}
          />
          <TicketRow
            icon={<SchoolIcon fontSize="small" />}
            label="Título secundario"
            value={TITULO_LABELS[registration.tituloSecundario] || registration.tituloSecundario}
          />
          {registration.concurreAlgunaIglesias && registration.cual && (
            <TicketRow
              icon={<ChurchIcon fontSize="small" />}
              label="Iglesia"
              value={`${registration.cual}${registration.nombrePastor ? ` — Pastor: ${registration.nombrePastor}` : ""}`}
            />
          )}
        </Box>

        <Divider sx={{ borderColor: "divider" }} />

        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: theme.typography.fontFamily,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              lineHeight: 1.5,
            }}
          >
            Guardá tu número de registro. Te contactaremos al email o teléfono
            proporcionado para confirmar tu inscripción.
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          color: "#00B4FF",
          fontFamily: theme.typography.button.fontFamily,
          fontSize: { xs: "0.62rem", sm: "0.75rem" },
          letterSpacing: "0.05em",
          mb: 2,
          px: 1,
        }}
      >
        Redirigiendo al Workshop en {countdown}s...
      </Typography>

      <Button
        fullWidth
        variant="contained"
        component="a"
        href={WORKSHOP_URL}
        sx={{
          width: "100%",
          minHeight: { xs: 46, sm: 48 },
          borderRadius: 0,
          fontFamily: theme.typography.button.fontFamily,
          fontSize: { xs: "0.6rem", sm: "0.65rem" },
          background: "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
          boxShadow: { xs: "3px 3px 0px #00B4FF", sm: "4px 4px 0px #00B4FF" },
          color: "#FFFFFF",
          whiteSpace: "normal",
          wordBreak: "break-word",
          textAlign: "center",
          lineHeight: 1.3,
          px: 2,
          py: 1.2,
          "&:hover": {
            background: "linear-gradient(45deg, #D500BA 20%, #FF007F 100%)",
          },
        }}
      >
        Ir al Workshop 2026 ahora
      </Button>
    </Box>
  );
};

export default PreCycleRegistrationSuccess;
