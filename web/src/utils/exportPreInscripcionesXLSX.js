import XLSX from "xlsx-js-style";

// ── Paleta Excel (derivada de theme.js) ──────────────────────────────
const COLORS = {
  bgDark: "03083B",    // fondo header — azul marino oscuro
  paper: "071052",     // fondo alterno oscuro
  cyan: "00B4FF",      // primary
  magenta: "D500BA",   // secondary
  white: "FFFFFF",
  textDark: "1E1E3C",  // texto body oscuro
  rowAlt: "E8F0FE",   // filas alternadas celeste suave
  rowBase: "FFFFFF",   // filas base blancas
  border: "B0BEC5",   // bordes grises claros
};

// ── Estilos reutilizables ──
const headerStyle = {
  font: { bold: true, color: { rgb: COLORS.cyan }, sz: 11, name: "Calibri" },
  fill: { fgColor: { rgb: COLORS.bgDark } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: {
    top: { style: "thin", color: { rgb: COLORS.magenta } },
    bottom: { style: "medium", color: { rgb: COLORS.magenta } },
    left: { style: "thin", color: { rgb: COLORS.cyan } },
    right: { style: "thin", color: { rgb: COLORS.cyan } },
  },
};

const cellStyle = (isAlt) => ({
  font: { color: { rgb: COLORS.textDark }, sz: 10, name: "Calibri" },
  fill: { fgColor: { rgb: isAlt ? COLORS.rowAlt : COLORS.rowBase } },
  alignment: { vertical: "center" },
  border: {
    top: { style: "thin", color: { rgb: COLORS.border } },
    bottom: { style: "thin", color: { rgb: COLORS.border } },
    left: { style: "thin", color: { rgb: COLORS.border } },
    right: { style: "thin", color: { rgb: COLORS.border } },
  },
});

const cellStyleCenter = (isAlt) => ({
  ...cellStyle(isAlt),
  alignment: { horizontal: "center", vertical: "center" },
});

const idStyle = (isAlt) => ({
  ...cellStyleCenter(isAlt),
  font: { bold: true, color: { rgb: COLORS.magenta }, sz: 10, name: "Calibri" },
});

// ── Columnas de la hoja ──
const columns = [
  { header: "N°", width: 5 },
  { header: "N° Reg.", width: 10 },
  { header: "Nombre", width: 20 },
  { header: "Apellido", width: 20 },
  { header: "DNI", width: 13 },
  { header: "Edad", width: 7 },
  { header: "Teléfono", width: 16 },
  { header: "Email", width: 32 },
  { header: "Fecha de Nacimiento", width: 20 },
  { header: "Título Secundario", width: 18 },
  { header: "¿Concurre a iglesia?", width: 20 },
  { header: "Pastor", width: 25 },
  { header: "Iglesia", width: 25 },
  { header: "Fecha de Inscripción", width: 20 },
];

/**
 * Exporta el listado de pre-inscripciones del ciclo TSM a un archivo .xlsx
 * con estilo visual consistente con la identidad de la aplicación.
 *
 * @param {Array} registrations — array de objetos devueltos por la API
 */
export const exportPreInscripcionesXLSX = (registrations) => {
  if (!registrations || registrations.length === 0) return;

  // ── Crear worksheet vacío ──
  const ws = {};
  const range = { s: { c: 0, r: 0 }, e: { c: columns.length - 1, r: registrations.length } };

  // ── Fila 0: Encabezados con estilo ──
  columns.forEach((col, c) => {
    const ref = XLSX.utils.encode_cell({ c, r: 0 });
    ws[ref] = { v: col.header, t: "s", s: headerStyle };
  });

  // ── Filas de datos ──
  registrations.forEach((reg, i) => {
    const r = i + 1;
    const isAlt = i % 2 === 1;

    const formatDate = (val) => {
      if (!val) return "—";
      const d = new Date(val);
      return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-AR");
    };

    const tituloMap = { si: "Sí", no: "No", incompleto: "Incompleto" };

    const rowData = [
      { v: i + 1, style: idStyle(isAlt) },
      { v: reg.registrarId ?? "—", style: idStyle(isAlt) },
      { v: reg.nombre ?? "", style: cellStyle(isAlt) },
      { v: reg.apellido ?? "", style: cellStyle(isAlt) },
      { v: reg.dni ?? "", style: cellStyleCenter(isAlt) },
      { v: reg.edad ?? "", style: cellStyleCenter(isAlt) },
      { v: reg.telefono ?? "", style: cellStyle(isAlt) },
      { v: reg.email ?? "", style: cellStyle(isAlt) },
      { v: formatDate(reg.fechaNacimiento), style: cellStyleCenter(isAlt) },
      { v: tituloMap[reg.tituloSecundario] ?? reg.tituloSecundario ?? "—", style: cellStyleCenter(isAlt) },
      { v: reg.concurreAlgunaIglesias ? "Sí" : "No", style: cellStyleCenter(isAlt) },
      { v: reg.nombrePastor || reg.pastor || "—", style: cellStyle(isAlt) },
      { v: reg.cual ?? "—", style: cellStyle(isAlt) },
      { v: formatDate(reg.creado), style: cellStyleCenter(isAlt) },
    ];

    rowData.forEach((cell, c) => {
      const ref = XLSX.utils.encode_cell({ c, r });
      ws[ref] = { v: cell.v, t: typeof cell.v === "number" ? "n" : "s", s: cell.style };
    });
  });

  // ── Configuración de la hoja ──
  ws["!ref"] = XLSX.utils.encode_range(range);
  ws["!cols"] = columns.map((col) => ({ wch: col.width }));

  // Altura de fila del header un poco más alta
  ws["!rows"] = [{ hpt: 28 }];

  // ── Crear workbook y descargar ──
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pre-inscripciones");

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `Pre-inscripciones_Ciclo_${fecha}.xlsx`);
};
