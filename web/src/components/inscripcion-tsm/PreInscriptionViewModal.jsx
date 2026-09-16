import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Fade,
  Divider,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

const fieldLabels = [
  { key: "registrarId", label: "N° Registro" },
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "dni", label: "DNI / Documento" },
  { key: "edad", label: "Edad" },
  { key: "tituloSecundario", label: "Título secundario" },
  { key: "telefono", label: "Teléfono de Contacto" },
  { key: "email", label: "Correo Electrónico" },
  { key: "fechaNacimiento", label: "Fecha de Nacimiento", isDate: true },
  { key: "concurreAlgunaIglesias", label: "Concurre a una iglesia", isBoolean: true },
  { key: "nombrePastor", label: "Pastor" },
  { key: "cual", label: "Iglesia" },
];

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

/**
 * Modal de vista (solo lectura) para una pre-inscripción.
 *
 * @param {boolean} open
 * @param {Function} onClose
 * @param {object|null} data - Los datos del inscripto a mostrar
 */
export const PreinscriptionViewModal = ({ open, onClose, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 300 },
        paper: {
          sx: {
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
            borderRadius: 0,
            bgcolor: "background.paper",
            maxHeight: isMobile ? "100vh" : "calc(100vh - 32px)",
            height: isMobile ? "100vh" : "auto",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <PersonIcon sx={{ color: "primary.main" }} />
          Detalle del Inscripto
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 }, overflowY: "auto", flex: 1, minHeight: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            src={data.foto || undefined}
            alt={`Foto de ${data.nombre || "aspirante"}`}
            sx={{
              width: { xs: 120, sm: 150 },
              height: { xs: 120, sm: 150 },
              border: "3px solid",
              borderColor: "primary.main",
              bgcolor: "rgba(0, 180, 255, 0.12)",
              boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
            }}
          >
            <PersonIcon sx={{ fontSize: { xs: 58, sm: 72 }, color: "primary.main" }} />
          </Avatar>
        </Box>

        {fieldLabels.map((field, index) => (
          <Box key={field.key}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 0.5, sm: 2 },
                py: { xs: 1.25, sm: 1.5 },
                px: { xs: 0.5, sm: 1 },
                "&:hover": {
                  bgcolor: "rgba(0, 180, 255, 0.05)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  minWidth: { xs: 0, sm: 160 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {field.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  textAlign: { xs: "left", sm: "right" },
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {field.isDate
                  ? formatDate(data[field.key])
                  : field.isBoolean
                  ? data[field.key]
                    ? "Sí"
                    : "No"
                  : data[field.key] || (field.key === "nombrePastor" ? data.pastor : "—")}
              </Typography>
            </Box>
            {index < fieldLabels.length - 1 && (
              <Divider sx={{ borderColor: "divider" }} />
            )}
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 }, pt: 1, flexShrink: 0, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={onClose} variant="outlined" fullWidth={isMobile}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
