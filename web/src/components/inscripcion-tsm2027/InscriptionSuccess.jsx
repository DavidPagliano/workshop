import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { AÑOS_A_CURSAR } from "../../config/inscriptionFields";

const TicketRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1, px: { xs: 1, sm: 1.5 } }}>
    <Box sx={{ color: "primary.main", display: "flex", mt: "2px", flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          display: "block",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontWeight: 600,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const InscriptionSuccess = ({ registration, onReset, onExit }) => {
  const año =
    AÑOS_A_CURSAR.find((option) => option.value === registration.añoACursar)?.label ||
    registration.añoACursar;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: { xs: 1, sm: 2 },
      }}
    >
      <CheckCircleIcon sx={{ fontSize: { xs: 64, sm: 80 }, color: "success.main", mb: 1.5 }} />
      <Typography variant="h4" sx={{ mb: 1 }}>
        ¡Inscripción exitosa!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 520, mb: 3 }}>
        La inscripción al Ciclo Lectivo 2027 fue registrada correctamente. Verificaremos su inscripción, ficha médica y comprobante de pago, y nos comunicaremos con usted a la brevedad para continuar con el proceso.
      </Typography>

      <Box
        sx={(theme) => ({
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          mb: 3,
          textAlign: "left",
          overflow: "hidden",
        })}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            src={registration.foto || undefined}
            alt={`${registration.nombre} ${registration.apellido}`}
            sx={{
              width: { xs: 56, sm: 72 },
              height: { xs: 56, sm: 72 },
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              CICLO LECTIVO{" "}
              <Box component="span" sx={{ color: "secondary.main" }}>
                2027
              </Box>
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              COMPROBANTE DE INSCRIPCIÓN
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              px: 1.5,
              py: 0.8,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.secondary.main, 0.08),
              border: "1px solid",
              borderColor: "secondary.main",
              textAlign: "center",
            })}
          >
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.65rem" }}>
              N° INSCRIPCIÓN
            </Typography>
            <Typography sx={{ color: "primary.main", fontWeight: 800, fontSize: { xs: "0.95rem", sm: "1.15rem" } }}>
              {registration.inscriptionId}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 1.5 }, py: 1.5 }}>
          <TicketRow
            icon={<PersonIcon fontSize="small" />}
            label="Nombre completo"
            value={`${registration.nombre} ${registration.apellido}`}
          />
          <TicketRow icon={<BadgeIcon fontSize="small" />} label="DNI" value={registration.dni} />
          <TicketRow icon={<SchoolIcon fontSize="small" />} label="Año a cursar" value={año} />
          <TicketRow icon={<EmailIcon fontSize="small" />} label="Email" value={registration.email} />
          <TicketRow icon={<PhoneIcon fontSize="small" />} label="Teléfono" value={registration.telefono} />
          <TicketRow
            icon={<LocationOnIcon fontSize="small" />}
            label="Localidad"
            value={`${registration.localidad}, ${registration.provincia}`}
          />
        </Box>

        <Divider />
        <Typography
          variant="caption"
          display="block"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          Guardá tu número de inscripción para cualquier consulta.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
        <Button variant="outlined" color="primary" onClick={onExit} sx={{ flex: 1, minHeight: 48 }}>
          Volver a Bienvenida
        </Button>
        <Button variant="contained" color="primary" onClick={onReset} sx={{ flex: 1, minHeight: 48 }}>
          Nueva inscripción
        </Button>
      </Stack>
    </Box>
  );
};

export default InscriptionSuccess;
