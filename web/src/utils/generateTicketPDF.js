import { jsPDF } from "jspdf";

/**
 * Mapa de valores internos → etiquetas legibles para el campo "temas".
 */
const TOPIC_LABELS = {
  AI: "Inteligencia Artificial",
  Audio: "Audio",
  video: "Video",
  "sin temas": "Sin definir",
};

/**
 * Colores del branding Multimedia Day 2026
 */
const COLORS = {
  darkBg: [3, 8, 59],       // #03083B
  cyan: [0, 180, 255],      // #00B4FF
  magenta: [213, 0, 186],   // #D500BA
  white: [255, 255, 255],
  lightGray: [200, 200, 220],
  mutedText: [160, 165, 200],
};

/**
 * Genera y descarga un ticket PDF en formato A5 apaisado para el Multimedia Day 2026.
 *
 * @param {object} registration - Datos de inscripción devueltos por la API.
 * @param {string} registration.registrarId
 * @param {string} registration.nombre
 * @param {string} registration.apellido
 * @param {string} registration.dni
 * @param {string} registration.email
 * @param {string} registration.telefono
 * @param {string} registration.temas
 */
export const generateTicketPDF = (registration) => {
  // A5 apaisado: 210 × 148 mm
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
  const W = 210;
  const H = 148;

  // ── Fondo ──────────────────────────────────────────────────────────
  doc.setFillColor(...COLORS.darkBg);
  doc.rect(0, 0, W, H, "F");

  // ── Borde exterior cyan ────────────────────────────────────────────
  doc.setDrawColor(...COLORS.cyan);
  doc.setLineWidth(0.8);
  doc.rect(5, 5, W - 10, H - 10);

  // ── Corner dots decorativos ────────────────────────────────────────
  const dotSize = 2;
  const dotOffset = 6.5;
  const corners = [
    [dotOffset, dotOffset],
    [W - dotOffset - dotSize, dotOffset],
    [dotOffset, H - dotOffset - dotSize],
    [W - dotOffset - dotSize, H - dotOffset - dotSize],
  ];
  doc.setFillColor(...COLORS.cyan);
  corners.forEach(([x, y]) => doc.rect(x, y, dotSize, dotSize, "F"));

  // ── Línea vertical separadora (2/3 - 1/3) ─────────────────────────
  const dividerX = 142;
  doc.setDrawColor(...COLORS.magenta);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(dividerX, 12, dividerX, H - 12);
  doc.setLineDashPattern([], 0); // reset

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN IZQUIERDA — Info del evento + datos del inscripto
  // ══════════════════════════════════════════════════════════════════

  // ── Chip "JORNADA INSTITUCIONAL · 2026" ────────────────────────────
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.cyan);
  const chipText = "JORNADA INSTITUCIONAL · 2026";
  const chipW = doc.getTextWidth(chipText) + 6;
  doc.setDrawColor(...COLORS.cyan);
  doc.setLineWidth(0.3);
  doc.rect(14, 13, chipW, 5);
  doc.text(chipText, 17, 16.8);

  // ── Título MULTI DAY 2026 ──────────────────────────────────────────
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("MULTI DAY", 14, 32);

  doc.setFontSize(18);
  doc.setTextColor(...COLORS.cyan);
  doc.text("2026", 100, 32);

  // ── Subtítulo ──────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.mutedText);
  doc.text("Ticket de inscripción — Entrada general", 14, 38);

  // ── Línea separadora ──────────────────────────────────────────────
  doc.setDrawColor(...COLORS.magenta);
  doc.setLineWidth(0.6);
  doc.line(14, 42, 134, 42);

  // ── Datos del inscripto ────────────────────────────────────────────
  const fields = [
    { label: "NOMBRE", value: `${registration.nombre} ${registration.apellido}` },
    { label: "DNI", value: registration.dni },
    { label: "EMAIL", value: registration.email },
    { label: "TELÉFONO", value: registration.telefono },
    { label: "TEMA DE INTERÉS", value: TOPIC_LABELS[registration.temas] || registration.temas },
  ];

  let yPos = 50;
  fields.forEach((field) => {
    // Label
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.mutedText);
    doc.text(field.label, 14, yPos);

    // Value
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.white);
    doc.text(field.value || "—", 14, yPos + 5);

    yPos += 14;
  });

  // ── Nota al pie (sección izquierda) ────────────────────────────────
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.mutedText);
  doc.text(
    "Presentá este ticket junto con tu DNI para acreditar tu ingreso al evento.",
    14,
    H - 14,
  );

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN DERECHA — N° de inscripción + fecha + lugar
  // ══════════════════════════════════════════════════════════════════

  const rightCenterX = dividerX + (W - dividerX) / 2;

  // ── Etiqueta N° inscripción ────────────────────────────────────────
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.mutedText);
  doc.text("N° DE INSCRIPCIÓN", rightCenterX, 28, { align: "center" });

  // ── Número de inscripción destacado ────────────────────────────────
  const regId = registration.registrarId || "—";

  // Box decorativo detrás del ID
  const idBoxW = 52;
  const idBoxH = 16;
  const idBoxX = rightCenterX - idBoxW / 2;
  const idBoxY = 31;
  doc.setDrawColor(...COLORS.magenta);
  doc.setLineWidth(0.6);
  doc.rect(idBoxX, idBoxY, idBoxW, idBoxH);
  // Shadow
  doc.setFillColor(...COLORS.magenta);
  doc.rect(idBoxX + 1.5, idBoxY + 1.5, idBoxW, idBoxH, "F");
  // Box fill
  doc.setFillColor(...COLORS.darkBg);
  doc.rect(idBoxX, idBoxY, idBoxW, idBoxH, "FD");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.magenta);
  doc.text(regId, rightCenterX, 42.5, { align: "center" });

  // ── Fecha ──────────────────────────────────────────────────────────
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.mutedText);
  doc.text("FECHA", rightCenterX, 60, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("6 DE OCTUBRE", rightCenterX, 67, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.cyan);
  doc.text("2026", rightCenterX, 73, { align: "center" });

  // ── Lugar ──────────────────────────────────────────────────────────
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.mutedText);
  doc.text("LUGAR", rightCenterX, 85, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("TSM", rightCenterX, 92, { align: "center" });

  // ── Hora ───────────────────────────────────────────────────────────
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.mutedText);
  doc.text("HORARIO", rightCenterX, 104, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("9:00 HS", rightCenterX, 111, { align: "center" });

  // ── Texto inferior derecho ─────────────────────────────────────────
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.mutedText);
  doc.text("ENTRADA GENERAL · GRATUITA", rightCenterX, H - 14, {
    align: "center",
  });

  // ── Descargar ──────────────────────────────────────────────────────
  const fileName = `ticket-multiday-${regId}.pdf`;
  doc.save(fileName);
};
