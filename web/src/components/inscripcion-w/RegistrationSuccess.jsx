import {
  Box,
  Button,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { generateTicketPDF } from "../../utils/generateTicketPDF";

/** Mapa de temas internos → etiquetas legibles */
const TOPIC_LABELS = {
  AI: "Inteligencia Artificial",
  Audio: "Audio",
  video: "Video",
  "sin temas": "Sin definir",
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

/**
 * Fila de dato del ticket con ícono, label y valor.
 */
const TicketRow = ({ icon, label, value }) => {
  const theme = useTheme();

  return (
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      py: 1,
      px: 1.5,
      "&:hover": { bgcolor: "rgba(0, 180, 255, 0.04)" },
    }}
  >
    <Box sx={{ color: "primary.main", display: "flex", fontSize: 18 }}>
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
          fontSize: "0.55rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, fontFamily: theme.typography.fontFamily, wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
    </Box>
  );
};

const RegistrationSuccess = ({ registration, onReset }) => {
  const theme = useTheme();
  //const navigate = useNavigate();

  const handleDownload = () => {
    generateTicketPDF(registration);
  };

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
      {/* ── Ícono de check con glow ── */}
      <CheckCircleIcon
        sx={{
          fontSize: { xs: 70, sm: 90 },
          color: "#00FF88",
          filter: "drop-shadow(0px 0px 10px rgba(0, 255, 136, 0.6))",
          mb: 2,
        }}
      />

      {/* ── Título con fuente pixel ── */}
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
        ¡Registro Exitoso!
      </Typography>

      {/* ── Mensaje con email ── */}
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
        ¡Te esperamos en el Multimedia Day 2026!
      </Typography>

      {/* ══════════════════════════════════════════════════════════════
          PREVISUALIZACIÓN DEL TICKET
          ══════════════════════════════════════════════════════════════ */}
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
        {/* Encabezado del ticket */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontFamily: theme.typography.fontFamily,
                fontSize: { xs: "1.15rem", sm: "1.4rem" },
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              MULTI DAY{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                2026
              </Box>
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontFamily: theme.typography.button.fontFamily,
                letterSpacing: "0.05em",
                fontSize: "0.5rem",
              }}
            >
              TICKET DE INSCRIPCIÓN
            </Typography>
          </Box>

          {/* N° de inscripción */}
          <Box
            sx={{
              px: 2,
              py: 0.8,
              border: "1.5px solid",
              borderColor: "secondary.main",
              boxShadow: "3px 3px 0px rgba(0, 180, 255, 0.3)",
              textAlign: "center",
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
              N° INSCRIPCIÓN
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

        {/* Cuerpo — datos del inscripto */}
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
            icon={<CategoryIcon fontSize="small" />}
            label="Tema de interés"
            value={TOPIC_LABELS[registration.temas] || registration.temas}
          />
        </Box>

        <Divider sx={{ borderColor: "divider" }} />

        {/* Pie — fecha, lugar y horario */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {[
            {
              icon: <EventIcon sx={{ fontSize: 16 }} />,
              label: "FECHA",
              value: "6 de Octubre, 2026",
            },
            {
              icon: <PlaceIcon sx={{ fontSize: 16 }} />,
              label: "LUGAR",
              value: "TSM",
            },
            {
              icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
              label: "HORARIO",
              value: "9:00 hs",
            },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.3,
              }}
            >
              <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
              <Typography
                sx={{
                  color: "primary.main",
                  fontFamily: theme.typography.button.fontFamily,
                  fontSize: "0.45rem",
                  letterSpacing: "0.08em",
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: "0.8rem",
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Botones ── */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%">
        <Button
          fullWidth
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            minHeight: 48,
            fontFamily: theme.typography.button.fontFamily,
            fontSize: "0.65rem",
            background: "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
            boxShadow: "3px 3px 0px #00B4FF",
            color: "#FFFFFF",
          }}
        >
          Descargar Ticket PDF
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={onReset}
          sx={{
            minHeight: 48,
            border: "2px solid #00B4FF",
            color: "#00B4FF",
            fontFamily: theme.typography.button.fontFamily,
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
      </Stack>
    </Box>
  );
};

export default RegistrationSuccess;
