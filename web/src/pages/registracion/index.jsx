// src/pages/registracion/index.jsx
import React from 'react';
import { 
  Container, Paper, Typography, TextField, Box, 
  Grid, Card, CardContent, Button, Chip, Alert, 
  List, ListItemButton, ListItemText, Divider, CircularProgress 
} from '@mui/material';
import { useAsistencia } from '../../hooks/useAsistencia';

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mesa de Entrada - Control de Asistencia
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Base de datos obtenida de la inscripción previa. Selecciona un usuario inscripto para revisar su información y marcar la asistencia oficial al Multimedia Day 2026.
        </Typography>

        {mensaje && (
          <Alert severity={mensaje.includes('EXITOSO') ? "success" : "info"} sx={{ mb: 3 }}>
            {mensaje}
          </Alert>
        )}

        {/* Buscador por DNI, Nombre o Apellido */}
        <TextField
          fullWidth
          label="Buscar por DNI, Nombre o Apellido..."
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ mb: 4 }}
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
              <Paper variant="outlined" sx={{ maxHeight: 420, overflow: 'auto' }}>
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
                <Card variant="outlined" sx={{ bgcolor: '#f8fafc', p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                      sx={{ py: 1.5, fontWeight: 'bold' }}
                    >
                      {usuarioSeleccionado.seRegistro 
                        ? "ANULAR ASISTENCIA" 
                        : "✔ CHECK: CONFIRMAR ASISTENCIA (REGISTRO EXITOSO)"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', bgcolor: '#fafafa' }}>
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
  );
};

export default AsistenciaPage;