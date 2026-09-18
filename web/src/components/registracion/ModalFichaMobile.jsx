import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import FichaUsuario from "./FichaUsuario";

const ModalFichaMobile = ({
  open,
  onClose,
  usuarioSeleccionado,
  onConfirmar,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: "96vh", sm: "90vh" },
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
          }}
        >
          <PersonIcon sx={{ color: "primary.main" }} />
          Ficha del Inscripto
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {usuarioSeleccionado && (
          <FichaUsuario
            usuario={usuarioSeleccionado}
            onConfirmar={onConfirmar}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          Volver a la Lista
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFichaMobile;
