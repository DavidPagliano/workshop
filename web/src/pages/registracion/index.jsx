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
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
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
      backgroundColor: '#03083B',
      backgroundImage: `url(${bgGrid})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <Box
        component="header"
        sx={{
          position: 'relative',
          minHeight: 86,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          overflow: 'hidden',
          px: { xs: 2, md: 5 },
          py: 1.5,
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
            bottom: -65,
            width: { xs: 180, md: 270 },
            opacity: 0.28,
            transform: 'rotate(-8deg)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <Box component="img" src={logo} alt="Multimedia Day" sx={{ width: 48, height: 48, objectFit: 'contain' }} />
          <Typography sx={{ color: 'primary.main', fontFamily: "'Omega Pixel BIFORM', monospace", fontSize: { xs: '0.7rem', sm: '0.86rem' }, whiteSpace: 'nowrap' }}>
            MULTIMEDIA DAY
          </Typography>
        </Box>
        <Box
          component="nav"
          aria-label="Navegación principal"
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: { xs: 0.25, md: 0.5 },
            flexWrap: 'wrap',
          }}
        >
          {[
            ['Inicio', '/'],
            ['Pre-inscripción', '/pre-ciclo'],
            ['Asistencia', '/asistencia'],
            ['Estadísticas', '/estadisticas'],
          ].map(([label, path]) => (
            <Typography
              key={label}
              component={Link}
              to={path}
              sx={{
                color: 'common.white',
                px: { xs: 0.25, md: 0.5 },
                py: 0.75,
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: '0.58rem', sm: '0.7rem' },
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {label}
            </Typography>
          ))}
          <Typography
            component="span"
            sx={{
              color: 'secondary.main',
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: 
                '0.58rem', sm: '0.7rem' },
              px: { xs: 0.5, md: 1 },
              py: 0.75,
              whiteSpace: 'nowrap',
            }}
          >
            Admin
          </Typography>
          <Typography
            component="span"
            sx={{
              color: '#F3A6A6',
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: '0.58rem', sm: '0.7rem' },
              px: { xs: 1, md: 2 },
              py: 0.75,
              borderLeft: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.35)',
              whiteSpace: 'nowrap',
              cursor: 'default',
            }}
          >
            <LogoutIcon sx={{ fontSize: '1em', verticalAlign: 'middle', mr: 0.5 }} />
            Salir
          </Typography>
        </Box>
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
                Inscriptos ({participantesFiltrados.length})
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 420, overflow: 'auto', backgroundColor: 'rgba(3, 8, 59, 0.6)', boxShadow: '4px 4px 0 rgba(213, 0, 186, 0.5)' }}>
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
                              sx={{ borderRadius: 0, px: 0.5 }}
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
                Ficha del Inscripto
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
                        sx={{ borderRadius: 0, px: 0.5 }}
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
                          <Chip
                            key={idx}
                            label={tema}
                            variant="outlined"
                            color="info"
                            size="small"
                            sx={{ borderRadius: 0, px: 0.5 }}
                          />
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