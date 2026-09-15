import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Fade,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/**
 * Modal de confirmación de eliminación.
 *
 * @param {boolean} open
 * @param {Function} onClose
 * @param {Function} onConfirm - Callback al confirmar eliminación
 * @param {object|null} data - Datos del inscripto a eliminar
 * @param {boolean} loading - Indica si se está procesando
 */
export const PreinscriptionDeleteModal = ({
  open,
  onClose,
  onConfirm,
  data,
  loading = false,
}) => {
  if (!data) return null;

  const fullName = `${data.nombre || ""} ${data.apellido || ""}`.trim();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 300 },
        paper: {
          sx: {
            border: "1.5px solid",
            borderColor: "secondary.main",
            boxShadow: "4px 4px 0px rgba(0, 180, 255, 0.4)",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            color: "secondary.main",
          }}
        >
          <WarningAmberIcon />
          Confirmar Eliminación
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ¿Estás seguro de que querés eliminar esta pre-inscripción?
        </Typography>

        {fullName && (
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(213, 0, 186, 0.08)",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
              Inscripto
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {fullName}
            </Typography>
            {data.registrarId && (
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                N° Registro: {data.registrarId}
              </Typography>
            )}
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{ mt: 2, color: "text.secondary", fontStyle: "italic" }}
        >
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="secondary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
