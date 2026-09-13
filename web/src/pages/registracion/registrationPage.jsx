// src/pages/registracion/index.jsx
import React from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { useAsistencia } from "../../hooks/useAsistencia";

// ── Componente de Ficha del Usuario (reutilizado en desktop y modal mobile) ──
const FichaUsuario = ({ usuario, onConfirmar }) => {
  if (!usuario) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
          mb: 2.5,
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 700 }}
        >
          {usuario.nombre} {usuario.apellido}
        </Typography>
        <Chip
          label={
            usuario.seRegistro
              ? "ASISTENCIA CONFIRMADA"
              : "PENDIENTE DE ACREDITACIÓN"
          }
          color={usuario.seRegistro ? "success" : "warning"}
          size="small"
          sx={{ borderRadius: 0 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[
          { label: "DNI", value: usuario.dni },
          { label: "Email", value: usuario.email },
          { label: "Celular", value: usuario.celular || "No especificado" },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              px: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {item.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}
        >
          Temas de Interés
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {usuario.temasInteres && usuario.temasInteres.length > 0 ? (
            usuario.temasInteres.map((tema, idx) => (
              <Chip
                key={idx}
                label={tema}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ borderRadius: 0 }}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">
              Sin temas registrados
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5, borderColor: "divider" }} />

      <Button
        fullWidth
        size="large"
        variant="contained"
        color={usuario.seRegistro ? "secondary" : "primary"}
        onClick={() =>
          onConfirmar(
            usuario._id || usuario.registrarId,
            usuario.seRegistro
          )
        }
        sx={{ py: 1.5, fontWeight: 700 }}
      >
        {usuario.seRegistro
          ? "ANULAR ASISTENCIA"
          : "✔ CONFIRMAR ASISTENCIA"}
      </Button>
    </Box>
  );
};

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
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: 700 }}
          >
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
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
              >
                Inscriptos ({participantesFiltrados.length})
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  maxHeight: { xs: "calc(100vh - 320px)", md: 480 },
                  overflow: "auto",
                  border: "1.5px solid",
                  borderColor: "primary.main",
                  boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
                  borderRadius: 0,
                  bgcolor: "background.paper",
                }}
              >
                <List disablePadding>
                  {participantesFiltrados.length > 0 ? (
                    participantesFiltrados.map((p) => {
                      const key = p._id || p.registrarId;
                      const estaSeleccionado =
                        usuarioSeleccionado?._id === key ||
                        usuarioSeleccionado?.registrarId === key;

                      return (
                        <React.Fragment key={key}>
                          <ListItemButton
                            selected={estaSeleccionado}
                            onClick={() => handleSelectUser(p)}
                            sx={{
                              py: 1.5,
                              "&.Mui-selected": {
                                bgcolor: "rgba(0, 180, 255, 0.1)",
                                borderLeft: "3px solid",
                                borderColor: "primary.main",
                              },
                              "&:hover": {
                                bgcolor: "rgba(0, 180, 255, 0.05)",
                              },
                            }}
                          >
                            <ListItemText
                              primary={`${p.nombre} ${p.apellido}`}
                              secondary={`DNI: ${p.dni}`}
                              slotProps={{
                                primary: { sx: { fontWeight: 500 } },
                                secondary: { sx: { color: "text.secondary" } },
                              }}
                            />
                            <Chip
                              label={p.seRegistro ? "Presente" : "Pendiente"}
                              color={p.seRegistro ? "success" : "default"}
                              size="small"
                              sx={{ borderRadius: 0 }}
                            />
                          </ListItemButton>
                          <Divider sx={{ borderColor: "divider" }} />
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron personas con ese criterio.
                      </Typography>
                    </Box>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* ── Ficha Desktop (oculta en mobile) ── */}
            {!isMobile && (
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
                >
                  Ficha del Inscripto
                </Typography>

                {usuarioSeleccionado ? (
                  <Card
                    variant="outlined"
                    sx={{
                      border: "1.5px solid",
                      borderColor: "primary.main",
                      boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
                      borderRadius: 0,
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <FichaUsuario
                        usuario={usuarioSeleccionado}
                        onConfirmar={handleConfirmarAsistencia}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 5,
                      textAlign: "center",
                      border: "1.5px solid",
                      borderColor: "divider",
                      borderRadius: 0,
                      bgcolor: "#071052",
                    }}
                  >
                    <Typography color="text.secondary">
                      Hacé clic en un participante de la lista para desplegar
                      su ficha de datos y confirmar su asistencia.
                    </Typography>
                  </Paper>
                )}
              </Grid>
            )}
          </Grid>
        </Fade>
      )}

      {/* ── Modal Mobile: Ficha del Usuario ── */}
      <Dialog
        open={mobileModalOpen && isMobile}
        onClose={handleCloseMobileModal}
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
              m: 2,
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
            onClick={handleCloseMobileModal}
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
              onConfirmar={handleConfirmarYCerrar}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
          <Button onClick={handleCloseMobileModal} variant="outlined">
            Volver a la Lista
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AsistenciaPage;