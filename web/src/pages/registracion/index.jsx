// src/pages/registracion/index.jsx
import React from 'react';
import { 
  Container, Paper, Typography, TextField, Box, 
  Grid, Card, CardContent, Button, Chip, Alert, 
  List, ListItemButton, ListItemText, Divider, CircularProgress,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAsistencia } from '../../hooks/useAsistencia';
import logo from '../../assets/images/MAS.png';
import cursor from '../../assets/images/CURSOR.png';
import bgGrid from '../../assets/images/fondo/FONDO3.png';

const AsistenciaPage = () => {
  const {
    busqueda,
    setBusqueda,
    participantesFiltrados,
    usuarioSeleccionado,
    handleSeleccionarUsuario,
    handleConfirmarAsistencia,
    mensaje,
    cargando
  } = useAsistencia();

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(145deg, rgba(3, 8, 59, 0.96), rgba(7, 16, 82, 0.9)), url(${bgGrid})`,
      backgroundSize: 'cover, 420px',
      backgroundPosition: 'center, center',
      backgroundAttachment: 'fixed',
    }}>
      <Box
        component="header"
        sx={{
          position: 'relative',
          minHeight: { xs: 220, md: 270 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          px: { xs: 3, md: 8 },
          py: { xs: 4, md: 6 },
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          background: 'linear-gradient(135deg, rgba(7, 16, 82, 0.98), rgba(28, 25, 133, 0.9))',
        }}
      >
        <Box
          component="img"
          src={cursor}
          alt=""
          sx={{
            position: 'absolute',
            right: { xs: -45, md: 35 },
            bottom: -75,
            width: { xs: 240, md: 390 },
            opacity: 0.42,
            transform: 'rotate(-8deg)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
          <Typography
            variant="overline"
            sx={{ color: 'secondary.light', letterSpacing: '0.18em', fontWeight: 700, fontFamily: "'Omega Pixel BIFORM', monospace" }}
          >
            Multimedia Day // 2026
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, fontWeight: 900, lineHeight: 1, maxWidth: { xs: 290, sm: 'none' } }}>
            <HowToRegIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '0.8em' }} />
            Registro y asistencia
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.78)', maxWidth: 540 }}>
            Gestiona la acreditación de las personas inscriptas al evento.
          </Typography>
        </Box>
        <Box
          component="img"
          src={logo}
          alt="Logo Multimedia Day"
          sx={{
            position: 'absolute',
            zIndex: 1,
            right: { xs: 18, md: 70 },
            top: { xs: 18, md: 28 },
            width: { xs: 92, md: 150 },
            objectFit: 'contain',
          }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 0, border: '1px solid rgba(0, 180, 255, 0.25)', backgroundColor: 'rgba(7, 16, 82, 0.88)' }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 900, maxWidth: 720 }}>
          Mesa de entrada | Control de asistencia
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 760 }}>
          Selecciona una persona inscripta para revisar sus datos y marcar su asistencia oficial al Multimedia Day 2026.
        </Typography>

        {mensaje && (
          <Alert severity={mensaje.includes('EXITOSO') ? "success" : "info"} sx={{ mb: 3 }}>
            {mensaje}
          </Alert>
        )}

        {/* Buscador por DNI, Nombre o Apellido */}
        <TextField
          fullWidth
          label="Buscar por DNI, nombre o apellido"
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(3, 8, 59, 0.65)' } }}
        />

        {cargando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Lista de Registrados de la Base Previa */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Inscriptos Encontrados ({participantesFiltrados.length})
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 420, overflow: 'auto', backgroundColor: 'rgba(3, 8, 59, 0.6)' }}>
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
                            onClick={() => handleSeleccionarUsuario(p)}
                          >
                            <ListItemText 
                              primary={`${p.nombre} ${p.apellido}`}
                              secondary={`DNI: ${p.dni}`}
                            />
                            <Chip 
                              label={p.seRegistro ? "Presente" : "Pendiente"} 
                              color={p.seRegistro ? "success" : "default"}
                              size="small"
                            />
                          </ListItemButton>
                          <Divider />
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron personas con ese criterio.
                      </Typography>
                    </Box>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Recuadro de Información Completa del Usuario Seleccionado */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Ficha del Usuario Seleccionado
              </Typography>
              
              {usuarioSeleccionado ? (
                <Card variant="outlined" sx={{ p: 1, background: 'linear-gradient(135deg, rgba(7, 16, 82, 0.96), rgba(28, 25, 133, 0.72))' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, flexWrap: 'wrap', mb: 2 }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                      </Typography>
                      <Chip 
                        label={usuarioSeleccionado.seRegistro ? "ASISTENCIA CONFIRMADA" : "PENDIENTE DE ACREDITACIÓN"} 
                        color={usuarioSeleccionado.seRegistro ? "success" : "warning"}
                      />
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>DNI:</strong> {usuarioSeleccionado.dni}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {usuarioSeleccionado.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Celular:</strong> {usuarioSeleccionado.celular || 'No especificado'}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                      <strong>Temas de Interés:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                      {usuarioSeleccionado.temasInteres && usuarioSeleccionado.temasInteres.length > 0 ? (
                        usuarioSeleccionado.temasInteres.map((tema, idx) => (
                          <Chip key={idx} label={tema} variant="outlined" color="info" size="small" />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Sin temas registrados
                        </Typography>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* BOTÓN / CHECK DE CONFIRMACIÓN */}
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color={usuarioSeleccionado.seRegistro ? "error" : "success"}
                      onClick={() => 
                        handleConfirmarAsistencia(
                          usuarioSeleccionado._id || usuarioSeleccionado.registrarId, 
                          usuarioSeleccionado.seRegistro
                        )
                      }
                      sx={{ py: 1.5, fontWeight: 'bold', fontFamily: "'Omega Pixel BIFORM', monospace", fontSize: { xs: '0.72rem', sm: '0.85rem' } }}
                    >
                      {usuarioSeleccionado.seRegistro 
                        ? "ANULAR ASISTENCIA" 
                        : "CONFIRMAR ASISTENCIA"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', backgroundColor: 'rgba(3, 8, 59, 0.6)' }}>
                  <Typography color="text.secondary">
                    Haz clic en un participante de la lista para desplegar su ficha de datos y confirmar su asistencia.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AsistenciaPage;