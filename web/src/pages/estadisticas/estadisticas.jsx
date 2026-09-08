import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  CircularProgress,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';

// ─── Assets ──────────────────────────────────────────────────────────
import bgGrid from "../../assets/images/fondo/FONDO3.png";

// ─── Mock Data Import ───────────────────────────────────────────────
import mockCicloData from "../../mock/estadisticas/mock-data-informacion.json";

// ─── Paleta de colores centralizada ──────────────────────────────────
const THEME_COLORS = {
  background: '#f8f9fa',
  paperBg: '#1e1b4b',
  textCyan: '#00f2fe',
  textPink: '#ff007f',
  textWhite: '#ffffff',
  chartPresent: '#00f2fe',
  chartAbsent: '#ff007f',
  chartPurple: '#7c4dff'
};

const COMMON_PAPER_STYLE = {
  backgroundColor: THEME_COLORS.paperBg,
  color: THEME_COLORS.textWhite,
  p: 2,
  borderRadius: 1,
  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
};

const TABLE_HEAD_STYLE = {
  color: THEME_COLORS.textCyan,
  borderBottom: `1px solid ${THEME_COLORS.textPink}`,
  fontWeight: 'bold'
};

// =====================================================================
// COMPONENTES DE GRÁFICOS PERSONALIZADOS
// =====================================================================

const CustomDonutChart = ({ data = [], colors = [], size = 150, strokeWidth = 25 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;
  let currentOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={radius} 
        fill="none" 
        stroke="#2a275c" 
        strokeWidth={strokeWidth} 
      />
      {data.map((item, index) => {
        if (!item.value) return null;
        const strokeLength = (item.value / total) * circumference;
        const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += strokeLength;

        return (
          <circle
            key={`${item.name}-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors[index % colors.length] || THEME_COLORS.textCyan}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          >
            <title>{`${item.name}: ${item.value}`}</title>
          </circle>
        );
      })}
    </svg>
  );
};

const CustomBarChart = ({ data = [], height = 200, color = THEME_COLORS.textCyan }) => {
  const max = Math.max(...data.map(d => d.value || 0), 1);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-around', 
        height, 
        borderBottom: `1px solid ${THEME_COLORS.textWhite}`, 
        borderLeft: `1px solid ${THEME_COLORS.textWhite}`, 
        p: 1, 
        pt: 3 
      }}
    >
      {data.length === 0 ? (
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
          Sin datos para mostrar
        </Typography>
      ) : (
        data.map((item, i) => {
          const percentHeight = ((item.value || 0) / max) * 100;
          return (
            <Box 
              key={`${item.name}-${i}`} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                flex: 1, 
                height: '100%', 
                justifyContent: 'flex-end', 
                px: 0.5 
              }}
            >
              <Tooltip title={`${item.name}: ${item.value}`} arrow placement="top">
                <Box 
                  sx={{ 
                    width: '100%', 
                    maxWidth: '40px', 
                    height: `${percentHeight}%`, 
                    bgcolor: color,
                    transition: 'height 0.5s ease',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }} 
                />
              </Tooltip>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'white', 
                  mt: 1, 
                  fontSize: '0.65rem', 
                  textAlign: 'center', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  maxWidth: '100%' 
                }}
              >
                {item.name}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>
  );
};

// =====================================================================
// COMPONENTE PRINCIPAL DE LA PÁGINA
// =====================================================================

export default function EstadisticasPage() {
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [ciclo, setCiclo] = useState([]);

  // Paginación independiente para Eventos
  const [pageEventos, setPageEventos] = useState(0);
  const [rowsPerPageEventos, setRowsPerPageEventos] = useState(5);

  // Paginación independiente para Ciclo
  const [pageCiclo, setPageCiclo] = useState(0);
  const [rowsPerPageCiclo, setRowsPerPageCiclo] = useState(5);

  // Estados para gráficos
  const [datosAsistencia, setDatosAsistencia] = useState([
    { name: 'Ausentes', value: 100 }, 
    { name: 'Presentes', value: 0 }
  ]);
  const [datosTemas, setDatosTemas] = useState([]);
  const [datosSecundario, setDatosSecundario] = useState([
    { name: 'Incompleto', value: 100 }
  ]);

  const processMetrics = (cicloData) => {
    // Procesar estado de estudios secundarios para el gráfico de dona
    const secondaryCounts = cicloData.reduce((acc, curr) => {
      const status = curr.tituloSecundario ? curr.tituloSecundario.toLowerCase().trim() : 'desconocido';
      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
      acc[formattedStatus] = (acc[formattedStatus] || 0) + 1;
      return acc;
    }, {});

    const formattedSecundario = Object.keys(secondaryCounts).map(key => ({
      name: key,
      value: secondaryCounts[key]
    }));

    if (formattedSecundario.length > 0) {
      setDatosSecundario(formattedSecundario);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar los datos desde el JSON mock importado
      setCiclo(mockCicloData);
      processMetrics(mockCicloData);
      
      // Mantener eventos vacío o asignar datos si corresponde
      setEventos([]);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cálculos dinámicos
  const totalInscriptos = eventos.length;
  const acreditados = eventos.filter(e => e.acreditado).length;
  const porcentajeAcreditados = totalInscriptos > 0 
    ? Math.round((acreditados / totalInscriptos) * 100) 
    : 0;

  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        backgroundImage: `url(${bgGrid})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: "auto",
        backgroundAttachment: "fixed",
        p: { xs: 2, sm: 4 }, 
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 6, sm: 8, md: 10 }
      }}
    >
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={4} spacing={2}>
        <Grid item xs={12} sm="auto">
          <Typography variant="h4" sx={{ color: THEME_COLORS.textCyan, fontWeight: 'bold' }}>
            Panel de Estadísticas
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Métricas en tiempo real y seguimiento
          </Typography>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button 
            variant="outlined" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />} 
            onClick={fetchData}
            disabled={loading}
            sx={{ 
              color: THEME_COLORS.textCyan, 
              borderColor: THEME_COLORS.textCyan,
              '&:hover': { borderColor: THEME_COLORS.textPink, color: THEME_COLORS.textPink }
            }}
          >
            {loading ? 'CARGANDO...' : 'REFRESCAR'}
          </Button>
        </Grid>
      </Grid>

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ ...COMMON_PAPER_STYLE, display: 'flex', alignItems: 'center', gap: 2 }}>
            <EventAvailableIcon sx={{ fontSize: 40, color: THEME_COLORS.textCyan }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">{totalInscriptos}</Typography>
              <Typography variant="body2">Inscriptos al Evento</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ ...COMMON_PAPER_STYLE, display: 'flex', alignItems: 'center', gap: 2 }}>
            <HowToRegIcon sx={{ fontSize: 40, color: THEME_COLORS.textPink }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: THEME_COLORS.textPink }}>
                {porcentajeAcreditados}%
              </Typography>
              <Typography variant="body2">
                Acreditados ({acreditados} presentes)
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ ...COMMON_PAPER_STYLE, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: THEME_COLORS.textCyan }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">{ciclo.length}</Typography>
              <Typography variant="body2">Postulantes Ciclo 2027</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Sección 1: Inscripciones al Evento */}
      <Typography variant="h6" sx={{ color: THEME_COLORS.textCyan, fontWeight: 'bold', mb: 2 }}>
        1. Inscripciones al Evento (Fecha y Hora)
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={COMMON_PAPER_STYLE}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={TABLE_HEAD_STYLE}>N° Reg</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Participante</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>DNI</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Tema</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Fecha</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Hora</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ color: 'white', py: 3 }}>
                        Sin inscripciones registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventos
                      .slice(pageEventos * rowsPerPageEventos, pageEventos * rowsPerPageEventos + rowsPerPageEventos)
                      .map((row, index) => (
                        <TableRow key={row.id || index}>
                          <TableCell sx={{ color: 'white' }}>{row.id}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.nombre}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.dni}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.tema}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.fecha}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.hora}</TableCell>
                          <TableCell sx={{ color: row.acreditado ? THEME_COLORS.textCyan : THEME_COLORS.textPink }}>
                            {row.acreditado ? 'Presente' : 'Ausente'}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={eventos.length}
              rowsPerPage={rowsPerPageEventos}
              page={pageEventos}
              onPageChange={(_, newPage) => setPageEventos(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPageEventos(parseInt(e.target.value, 10));
                setPageEventos(0);
              }}
              sx={{ color: 'white' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...COMMON_PAPER_STYLE, height: '100%', minHeight: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: THEME_COLORS.textPink, fontWeight: 'bold', mb: 3 }}>
              % ACREDITACIÓN EN VIVO
            </Typography>
            
            <CustomDonutChart 
              data={datosAsistencia} 
              colors={[THEME_COLORS.chartAbsent, THEME_COLORS.chartPresent]} 
              size={160} 
            />
            
            <Box display="flex" gap={2} mt={3}>
              <Typography variant="caption" sx={{ color: THEME_COLORS.chartAbsent }}>■ Ausentes</Typography>
              <Typography variant="caption" sx={{ color: THEME_COLORS.chartPresent }}>■ Presentes</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Sección 2: Distribución de Temas */}
      <Typography variant="h6" sx={{ color: THEME_COLORS.textPink, fontWeight: 'bold', mb: 2 }}>
        2. Distribución de Temas Elegidos
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={COMMON_PAPER_STYLE}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, color: THEME_COLORS.textPink }}>Tema Seleccionado</TableCell>
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, color: THEME_COLORS.textPink }}>Participantes</TableCell>
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, color: THEME_COLORS.textPink }}>Porcentaje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosTemas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: 'white', py: 3 }}>
                        Sin datos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    datosTemas.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ color: 'white' }}>{row.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{row.value}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {totalInscriptos > 0 ? `${Math.round((row.value / totalInscriptos) * 100)}%` : '0%'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ ...COMMON_PAPER_STYLE, height: '100%', minHeight: 250 }}>
            <Typography variant="subtitle1" sx={{ color: THEME_COLORS.textCyan, fontWeight: 'bold', mb: 2 }}>
              VOLUMEN POR TEMA
            </Typography>
            
            <CustomBarChart data={datosTemas} height={180} />
          </Paper>
        </Grid>
      </Grid>

      {/* Sección 3: Preinscriptos Ciclo 2027 */}
      <Typography variant="h6" sx={{ color: THEME_COLORS.textCyan, fontWeight: 'bold', mb: 2 }}>
        3. Preinscriptos Ciclo 2027
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={COMMON_PAPER_STYLE}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={TABLE_HEAD_STYLE}>N° Reg</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Aspirante</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>DNI</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Secundario</TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Fecha Ingreso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ciclo.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: 'white', py: 3 }}>
                        Sin aspirantes registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ciclo
                      .slice(pageCiclo * rowsPerPageCiclo, pageCiclo * rowsPerPageCiclo + rowsPerPageCiclo)
                      .map((row, index) => (
                        <TableRow key={row.registrarId || index}>
                          <TableCell sx={{ color: 'white' }}>{row.registrarId}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{`${row.apellido}, ${row.nombre}`}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.dni}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{row.tituloSecundario}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{new Date(row.creado).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={ciclo.length}
              rowsPerPage={rowsPerPageCiclo}
              page={pageCiclo}
              onPageChange={(_, newPage) => setPageCiclo(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPageCiclo(parseInt(e.target.value, 10));
                setPageCiclo(0);
              }}
              sx={{ color: 'white' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...COMMON_PAPER_STYLE, height: '100%', minHeight: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: THEME_COLORS.textCyan, fontWeight: 'bold', mb: 3 }}>
              ESTADO DE ESTUDIOS SECUNDARIOS
            </Typography>
            
            <CustomDonutChart 
              data={datosSecundario} 
              colors={[THEME_COLORS.chartPurple, THEME_COLORS.textCyan, THEME_COLORS.textPink]} 
              size={160} 
            />
            
            <Box display="flex" gap={1} mt={3} flexWrap="wrap" justifyContent="center">
              {datosSecundario.map((item, idx) => (
                <Typography key={idx} variant="caption" sx={{ color: [THEME_COLORS.chartPurple, THEME_COLORS.textCyan, THEME_COLORS.textPink][idx % 3] }}>
                  ■ {item.name} ({item.value})
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}