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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getAttendeesList } from "../../services/attendAsistence";
import { getPreCycleRegistrations } from "../../services/preCycleService";
import { CHART_COLORS } from "../../utils/estadisticasUtils";

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

  // Lógica para exportar PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(3, 8, 59);
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(0, 180, 255);
    doc.setFontSize(16);
    doc.text("WORKSHOP 2026 - REPORTE", 14, 16);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString("es-AR")}`, 14, 32);

    doc.setFontSize(12);
    doc.setTextColor(3, 8, 59);
    doc.text("Asistencia General", 14, 42);
    autoTable(doc, {
      startY: 46,
      head: [["Métrica", "Total", "%"]],
      body: [
        ["Inscriptos Evento", metricasAsistencia.total, "100%"],
        [
          "Presentes",
          metricasAsistencia.presentes,
          `${metricasAsistencia.porcentaje}%`,
        ],
        [
          "Ausentes",
          metricasAsistencia.ausentes,
          `${(100 - metricasAsistencia.porcentaje).toFixed(1)}%`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 180, 255], textColor: [3, 8, 59] },
    });

    doc.text("Temas de Interés", 14, doc.lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Tema", "Cant.", "%"]],
      body: metricasTemas.tableData.map((t) => [
        t.tema,
        t.cantidad,
        `${t.porcentaje}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [213, 0, 186], textColor: [255, 255, 255] },
    });

    doc.text("Pre-Inscripciones 2027", 14, doc.lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Reg ID", "Aspirante", "DNI", "Secundario"]],
      body: cycleData.map((c) => [
        c.registrarId || "—",
        `${c.nombre} ${c.apellido}`,
        c.dni,
        c.tituloSecundario,
      ]),
      theme: "grid",
      headStyles: { fillColor: [3, 8, 59], textColor: [255, 255, 255] },
    });

    doc.save(`Estadisticas_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ minHeight: "100vh", pt: { xs: 2, sm: 3, md: 5 }, pb: { xs: 4, sm: 6, md: 8 }, px: { xs: 1.5, sm: 3 } }}
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
              sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.125rem" } }}
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
              sx={{ color: "primary.main", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
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
