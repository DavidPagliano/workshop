import React from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAsistencia } from "../../hooks/useAsistencia";
import ListaInscriptos from "../../components/registracion/ListaInscriptos";
import FichaDesktop from "../../components/registracion/FichaDesktop";
import ModalFichaMobile from "../../components/registracion/ModalFichaMobile";

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
const AsistenciaPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    busqueda,
    setBusqueda,
    participantesFiltrados,
    usuarioSeleccionado,
    handleSeleccionarUsuario,
    handleConfirmarAsistencia,
    mensaje,
    error,
    cargando,
  } = useAsistencia();

  // En mobile, al seleccionar un usuario se abre el modal
  const [mobileModalOpen, setMobileModalOpen] = React.useState(false);

  const handleSelectUser = (p) => {
    handleSeleccionarUsuario(p);
    if (isMobile) {
      setMobileModalOpen(true);
    }
  };

  const handleCloseMobileModal = () => {
    setMobileModalOpen(false);
  };

  const handleConfirmarYCerrar = async (id, estadoActual) => {
    await handleConfirmarAsistencia(id, estadoActual);
    if (isMobile) {
      // Pequeño delay para que el usuario vea el feedback antes de cerrar
      setTimeout(() => {
        setMobileModalOpen(false);
      }, 800);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        pt: { xs: 3, sm: 5, md: 6 },
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      {/* ── Header ── */}
      <Fade in timeout={500}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            Mesa de Entrada — Control de Asistencia
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Selecciona un inscripto para revisar su información y marcar la
            asistencia al Multimedia Day 2026.
          </Typography>
        </Box>
      </Fade>

      {/* ── Alertas ── */}
      {mensaje && (
        <Fade in timeout={300}>
          <Alert
            severity={mensaje.includes("EXITOSO") ? "success" : "info"}
            sx={{
              mb: 3,
              borderRadius: 0,
              border: "1px solid",
              borderColor: mensaje.includes("EXITOSO")
                ? "success.main"
                : "info.main",
            }}
          >
            {mensaje}
          </Alert>
        </Fade>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
          {error}
        </Alert>
      )}

      {/* ── Buscador ── */}
      <Fade in timeout={600} style={{ transitionDelay: "100ms" }}>
        <TextField
          fullWidth
          label="Buscar por DNI, Nombre o Apellido..."
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#071052",
              borderRadius: 0,
              "& fieldset": {
                borderColor: "primary.main",
                borderWidth: "1.5px",
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00B4FF",
              fontWeight: 600,
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              color: "#00B4FF",
              backgroundColor: "#071052",
              px: 1,
            },
            "& .MuiOutlinedInput-input": {
              color: "#FFFFFF",
            },
          }}
        />
      </Fade>

      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Fade in timeout={700} style={{ transitionDelay: "200ms" }}>
          <Grid container spacing={3}>
            {/* ── Lista de Inscriptos ── */}
            <ListaInscriptos
              participantesFiltrados={participantesFiltrados}
              usuarioSeleccionado={usuarioSeleccionado}
              onSeleccionar={handleSelectUser}
            />

            {/* ── Ficha Desktop (oculta en mobile) ── */}
            {!isMobile && (
              <FichaDesktop
                usuarioSeleccionado={usuarioSeleccionado}
                onConfirmar={handleConfirmarAsistencia}
              />
            )}
          </Grid>
        </Fade>
      )}

      {/* ── Modal Mobile: Ficha del Usuario ── */}
      <ModalFichaMobile
        open={mobileModalOpen && isMobile}
        onClose={handleCloseMobileModal}
        usuarioSeleccionado={usuarioSeleccionado}
        onConfirmar={handleConfirmarYCerrar}
      />
    </Container>
  );
};

export default AsistenciaPage;
