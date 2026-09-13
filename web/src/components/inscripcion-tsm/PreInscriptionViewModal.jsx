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
  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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

      <DialogContent sx={{ pt: 3 }}>
        {fieldLabels.map((field, index) => (
          <Box key={field.key}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                px: 1,
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
                  minWidth: 160,
                }}
              >
                {field.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  textAlign: "right",
                  wordBreak: "break-word",
                }}
              >
                {field.isDate
                  ? formatDate(data[field.key])
                  : field.isBoolean
                  ? data[field.key]
                    ? "Sí"
                    : "No"
                  : data[field.key] || "—"}
              </Typography>
            </Box>
            {index < fieldLabels.length - 1 && (
              <Divider sx={{ borderColor: "divider" }} />
            )}
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
