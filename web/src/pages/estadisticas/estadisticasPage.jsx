import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { getAttendeesList } from "../../services/attendAsistence";
import { getPreCycleRegistrations } from "../../services/preCycleService";
import { CHART_COLORS } from "../../utils/estadisticasUtils";
import { generateEstadisticasPDF } from "../../utils/exportPDF";

// Importación de las Secciones
import { MetricCards } from "../../components/estadisticas/MetricCards";
import { AsistenciaSection } from "../../components/estadisticas/AsistenciaSection";
import { TemasSection } from "../../components/estadisticas/TemasSection";
import { PreCicloSection } from "../../components/estadisticas/PreCicloSection";

const EstadisticasPage = () => {
  const [eventData, setEventData] = useState([]);
  const [cycleData, setCycleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, cycleRes] = await Promise.all([
        getAttendeesList().catch(() => []),
        getPreCycleRegistrations().catch(() => []),
      ]);
      setEventData(Array.isArray(eventsRes) ? eventsRes : []);
      setCycleData(Array.isArray(cycleRes) ? cycleRes : []);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  // Cálculos de Datos Centralizados
  const metricasAsistencia = useMemo(() => {
    const total = eventData.length;
    const presentes = eventData.filter((i) => i.seRegistro === true).length;
    const ausentes = total - presentes;
    const porcentaje = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;
    return {
      total,
      presentes,
      ausentes,
      porcentaje,
      chartData: [
        { name: "Presentes", value: presentes, color: CHART_COLORS.presente },
        { name: "Ausentes", value: ausentes, color: CHART_COLORS.ausente },
      ],
    };
  }, [eventData]);

  const metricasTemas = useMemo(() => {
    const counts = {};
    eventData.forEach((item) => {
      const tema = item.temas || "sin temas";
      counts[tema] = (counts[tema] || 0) + 1;
    });
    const total = eventData.length;
    const tableData = Object.entries(counts).map(([tema, cantidad], idx) => ({
      tema,
      cantidad,
      porcentaje: total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0,
      color: CHART_COLORS.temas[idx % CHART_COLORS.temas.length],
    }));
    return {
      tableData,
      chartData: tableData.map((t) => ({ name: t.tema, value: t.cantidad })),
    };
  }, [eventData]);

  const metricasCiclo = useMemo(() => {
    const counts = { si: 0, no: 0, incompleto: 0 };
    cycleData.forEach((c) => {
      const status = c.tituloSecundario || "no";
      counts[status] = (counts[status] || 0) + 1;
    });
    const total = cycleData.length;
    const chartData = [
      {
        name: "Secundario Sí",
        value: counts.si,
        color: CHART_COLORS.secundario[0],
      },
      {
        name: "Secundario No",
        value: counts.no,
        color: CHART_COLORS.secundario[1],
      },
      {
        name: "Incompleto",
        value: counts.incompleto,
        color: CHART_COLORS.secundario[2],
      },
    ];
    return { total, counts, chartData };
  }, [cycleData]);

  // ── Exportar PDF ──
  const handleExportPDF = () => {
    generateEstadisticasPDF({
      eventData,
      cycleData,
      metricasAsistencia,
      metricasTemas,
    });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        pt: { xs: 2, sm: 3, md: 5 },
        pb: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1.5, sm: 3 },
      }}
    >
      <Fade in timeout={400}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              color="primary"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.125rem" },
              }}
            >
              Panel de Estadísticas
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Métricas en tiempo real y exportación.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              disabled={loading}
              size="small"
              sx={{
                color: "primary.main",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
              }}
            >
              Refrescar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              size="small"
              disabled={
                loading || (eventData.length === 0 && cycleData.length === 0)
              }
              sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
            >
              PDF
            </Button>
          </Box>
        </Box>
      </Fade>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 12 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Fade in timeout={600}>
          <Box>
            <MetricCards
              metricasAsistencia={metricasAsistencia}
              metricasCiclo={metricasCiclo}
            />
            <AsistenciaSection
              eventData={eventData}
              metricasAsistencia={metricasAsistencia}
            />
            <TemasSection metricasTemas={metricasTemas} />
            <PreCicloSection
              cycleData={cycleData}
              metricasCiclo={metricasCiclo}
            />
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default EstadisticasPage;
