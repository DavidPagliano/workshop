import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateTime } from "./estadisticasUtils";

// ── Paleta PDF (derivada de theme.js) ──────────────────────────────
const PDF = {
  bgDark:   [3, 8, 59],      // #03083B — header bar
  paper:    [7, 16, 82],     // #071052 — head de tabla oscura
  cyan:     [0, 180, 255],   // #00B4FF — primary
  magenta:  [213, 0, 186],   // #D500BA — secondary
  white:    [255, 255, 255],
  textDark: [30, 30, 60],    // texto body oscuro
  muted:    [120, 130, 150], // texto secundario
  rowAlt:   [235, 240, 250], // filas alternadas suave
  line:     [200, 210, 225], // bordes sutiles
};

// Helper: dibuja un título de sección
const drawSectionTitle = (doc, text, y) => {
  // Línea decorativa magenta a la izquierda
  doc.setDrawColor(...PDF.magenta);
  doc.setLineWidth(2);
  doc.line(14, y - 5, 14, y + 1);
  // Texto
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF.bgDark);
  doc.text(text, 18, y);
  return y + 6;
};

// Helper: dibuja footer
const drawFooter = (doc, pageNum, totalPages) => {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...PDF.cyan);
  doc.setLineWidth(0.3);
  doc.line(14, h - 14, w - 14, h - 14);
  doc.setFontSize(7);
  doc.setTextColor(...PDF.muted);
  doc.text("Multimedia Day 2026 — Reporte generado automáticamente", 14, h - 9);
  doc.text(`Página ${pageNum} de ${totalPages}`, w - 14, h - 9, { align: "right" });
};

/**
 * Genera y descarga el PDF de estadísticas.
 * @param {{ eventData: Array, cycleData: Array, metricasAsistencia: Object, metricasTemas: Object }} params
 */
export const generateEstadisticasPDF = ({
  eventData,
  cycleData,
  metricasAsistencia,
  metricasTemas,
}) => {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // ── Header ──
  doc.setFillColor(...PDF.bgDark);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setDrawColor(...PDF.magenta);
  doc.setLineWidth(1);
  doc.line(0, 28, pageW, 28);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF.cyan);
  doc.text("MULTIMEDIA DAY 2026", 14, 12);
  doc.setFontSize(9);
  doc.setTextColor(...PDF.white);
  doc.text("REPORTE DE ESTADÍSTICAS", 14, 20);
  doc.setFontSize(8);
  doc.setTextColor(180, 190, 210);
  doc.text(
    `Generado: ${new Date().toLocaleString("es-AR")}`,
    pageW - 14,
    20,
    { align: "right" }
  );

  let currentY = 38;

  // ── Sección 1: Resumen de Asistencia ──
  currentY = drawSectionTitle(doc, "Resumen de Asistencia", currentY);
  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    head: [["Métrica", "Total", "%"]],
    body: [
      ["Inscriptos al Evento", metricasAsistencia.total, "100%"],
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
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: PDF.line,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: PDF.cyan,
      textColor: PDF.bgDark,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: PDF.textDark,
    },
    alternateRowStyles: {
      fillColor: PDF.rowAlt,
    },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "center" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        if (data.cell.raw === "Presentes") {
          data.cell.styles.textColor = [0, 140, 80];
          data.cell.styles.fontStyle = "bold";
        } else if (data.cell.raw === "Ausentes") {
          data.cell.styles.textColor = PDF.magenta;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // ── Sección 2: Inscripciones al Evento (detalle completo) ──
  currentY = drawSectionTitle(doc, "Inscripciones al Evento (Fecha y Hora)", currentY);
  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    head: [["N° Reg", "Participante", "DNI", "Tema", "Fecha", "Hora", "Estado"]],
    body: eventData.map((item) => {
      const { fecha, hora } = formatDateTime(item.creado);
      return [
        item.registrarId || "—",
        `${item.nombre} ${item.apellido}`,
        item.dni,
        item.temas || "—",
        fecha,
        hora,
        item.seRegistro ? "Presente" : "Ausente",
      ];
    }),
    styles: {
      fontSize: 8,
      cellPadding: 3.5,
      lineColor: PDF.line,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: PDF.cyan,
      textColor: PDF.bgDark,
      fontStyle: "bold",
      fontSize: 8.5,
    },
    bodyStyles: {
      textColor: PDF.textDark,
    },
    alternateRowStyles: {
      fillColor: PDF.rowAlt,
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: PDF.bgDark },
      6: { halign: "center" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 6) {
        data.cell.styles.fontStyle = "bold";
        if (data.cell.raw === "Presente") {
          data.cell.styles.textColor = [0, 140, 80];
        } else {
          data.cell.styles.textColor = PDF.magenta;
        }
      }
    },
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // ── Sección 3: Temas de Interés ──
  if (currentY > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    currentY = 20;
  }
  currentY = drawSectionTitle(doc, "Distribución de Temas Elegidos", currentY);
  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    head: [["Tema Seleccionado", "Participantes", "Porcentaje"]],
    body: metricasTemas.tableData.map((t) => [
      t.tema,
      t.cantidad,
      `${t.porcentaje}%`,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: PDF.line,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: PDF.magenta,
      textColor: PDF.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: PDF.textDark,
    },
    alternateRowStyles: {
      fillColor: PDF.rowAlt,
    },
    columnStyles: {
      0: { fontStyle: "bold" },
      1: { halign: "center" },
      2: { halign: "center" },
    },
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // ── Sección 4: Preinscriptos Ciclo 2027 ──
  if (currentY > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    currentY = 20;
  }
  currentY = drawSectionTitle(doc, "Preinscriptos Ciclo 2027", currentY);
  autoTable(doc, {
    startY: currentY,
    theme: "grid",
    head: [["N° Reg", "Aspirante", "DNI", "Secundario", "Fecha Ingreso"]],
    body: cycleData.map((c) => {
      const { fecha } = formatDateTime(c.creado);
      return [
        c.registrarId || "—",
        `${c.nombre} ${c.apellido}`,
        c.dni,
        c.tituloSecundario || "—",
        fecha,
      ];
    }),
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: PDF.line,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: PDF.bgDark,
      textColor: PDF.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: PDF.textDark,
    },
    alternateRowStyles: {
      fillColor: PDF.rowAlt,
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: PDF.magenta },
      3: { halign: "center" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        data.cell.styles.fontStyle = "bold";
        if (data.cell.raw === "si") {
          data.cell.styles.textColor = [0, 140, 80];
        } else if (data.cell.raw === "incompleto") {
          data.cell.styles.textColor = [200, 140, 0];
        } else {
          data.cell.styles.textColor = PDF.magenta;
        }
      }
    },
  });

  // ── Footer en todas las páginas ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`Estadisticas_${new Date().toISOString().split("T")[0]}.pdf`);
};
