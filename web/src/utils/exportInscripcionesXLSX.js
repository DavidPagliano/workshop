import XLSX from "xlsx-js-style";

// ── Paleta Excel (derivada de theme.js) ──────────────────────────────
const COLORS = {
  bgDark: "03083B",
  cyan: "00B4FF",
  magenta: "D500BA",
  textDark: "1E1E3C",
  rowAlt: "E8F0FE",
  rowBase: "FFFFFF",
  border: "B0BEC5",
};

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

// Previene inyección de fórmulas en Excel/Sheets
const sanitizeCell = (value) => {
  if (typeof value !== "string") return value;
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
};

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-AR");
};

const formatBool = (val) => (val ? "Sí" : "No");

// ── Campos compartidos por los modelos de inscripción (sin la foto) ──
const columns = [
  { header: "N°", width: 5, center: true, isId: true, get: (_ins, i) => i + 1 },
  { header: "N° Inscripción", width: 14, center: true, isId: true, get: (ins) => ins.inscriptionId ?? "—" },
  { header: "Nombre", width: 20, get: (ins) => ins.nombre ?? "—" },
  { header: "Apellido", width: 20, get: (ins) => ins.apellido ?? "—" },
  { header: "DNI", width: 14, center: true, get: (ins) => ins.dni ?? "—" },
  { header: "Fecha de Nacimiento", width: 18, center: true, get: (ins) => formatDate(ins.fechaNacimiento) },
  { header: "Edad", width: 8, center: true, get: (ins) => ins.fichaMedica?.edad ?? "—" },
  { header: "Lugar de Nacimiento", width: 22, get: (ins) => ins.lugarNacimiento ?? "—" },
  { header: "Localidad", width: 20, get: (ins) => ins.localidad ?? "—" },
  { header: "Provincia", width: 18, get: (ins) => ins.provincia ?? "—" },
  { header: "Teléfono", width: 16, get: (ins) => ins.telefono ?? "—" },
  { header: "Teléfono Alternativo", width: 18, get: (ins) => ins.telefonoAlternativo || "—" },
  { header: "Email", width: 30, get: (ins) => ins.email ?? "—" },
  { header: "Año a Cursar", width: 14, center: true, get: (ins) => ins.añoACursar ?? "—" },
  { header: "Estudios Cursados", width: 22, get: (ins) => ins.estudiosCursados || "—" },
  { header: "¿Tiene Trabajo?", width: 16, center: true, get: (ins) => formatBool(ins.tieneTrabajo) },
  { header: "Dirección Laboral", width: 26, get: (ins) => ins.direccionLaboral || "—" },
  { header: "¿Concurre a Iglesia?", width: 18, center: true, get: (ins) => formatBool(ins.concurreAlgunaIglesia) },
  { header: "Iglesia", width: 24, get: (ins) => ins.cualIglesia || "—" },
  { header: "Nombre del Pastor", width: 24, get: (ins) => ins.nombreDelPastor || "—" },
  // Contacto de emergencia
  { header: "Emergencia - Nombre y Apellido", width: 26, get: (ins) => ins.emergencia?.NombreYApellido ?? "—" },
  { header: "Emergencia - Parentesco", width: 18, get: (ins) => ins.emergencia?.Parentesco ?? "—" },
  { header: "Emergencia - Teléfono", width: 18, get: (ins) => ins.emergencia?.Telefono ?? "—" },
  { header: "Emergencia - DNI", width: 14, center: true, get: (ins) => ins.emergencia?.Dni ?? "—" },
  { header: "Emergencia - Domicilio", width: 26, get: (ins) => ins.emergencia?.Domicilio ?? "—" },
  { header: "Emergencia - Localidad", width: 20, get: (ins) => ins.emergencia?.Localidad ?? "—" },
  // Ficha médica - Salud
  { header: "Grupo Sanguíneo", width: 16, center: true, get: (ins) => ins.fichaMedica?.grupoSanguineo ?? "—" },
  { header: "¿Recibe Tratamiento Médico?", width: 24, center: true, get: (ins) => formatBool(ins.fichaMedica?.recibeAlgunTratamientoMedico) },
  { header: "¿Cuál Tratamiento?", width: 28, get: (ins) => ins.fichaMedica?.cualTratamiento || "—" },
  { header: "¿Toma Medicación?", width: 18, center: true, get: (ins) => formatBool(ins.fichaMedica?.tomasAlgunaMedicacion) },
  { header: "¿Cuál Medicación?", width: 28, get: (ins) => ins.fichaMedica?.cualMedicacion || "—" },
  { header: "¿Tiene Alergias?", width: 16, center: true, get: (ins) => formatBool(ins.fichaMedica?.tienesAlergias) },
  { header: "¿Cuáles Alergias?", width: 28, get: (ins) => ins.fichaMedica?.cualesAlergias || "—" },
  { header: "¿Padece Trastorno Crónico?", width: 24, center: true, get: (ins) => formatBool(ins.fichaMedica?.padecesAlgunTrastornoCronico) },
  { header: "¿Cuál Trastorno?", width: 28, get: (ins) => ins.fichaMedica?.caulTrastorno || "—" },
  { header: "Otras Enfermedades", width: 28, get: (ins) => ins.fichaMedica?.otrasEnfermedades || "—" },
  { header: "Cómo Actuar ante Descompensación", width: 36, get: (ins) => ins.fichaMedica?.EnCasoDeUnaDescomposicionComoActuar ?? "—" },
  // Ficha médica - Obra Social
  { header: "Obra Social", width: 22, get: (ins) => ins.fichaMedica?.ObraSocial?.nombre ?? "—" },
  { header: "Plan Médico", width: 18, get: (ins) => ins.fichaMedica?.ObraSocial?.planMedico ?? "—" },
  { header: "N° Afiliado Obra Social", width: 22, get: (ins) => ins.fichaMedica?.ObraSocial?.NroAfiliado ?? "—" },
  { header: "Teléfono Obra Social", width: 20, get: (ins) => ins.fichaMedica?.ObraSocial?.telefono ?? "—" },
  // Ficha médica - Servicio de emergencia médica
  { header: "Emergencia Médica - Servicio", width: 24, get: (ins) => ins.fichaMedica?.emergenciaMedica?.Nombre ?? "—" },
  { header: "Emergencia Médica - Teléfono", width: 22, get: (ins) => ins.fichaMedica?.emergenciaMedica?.Telefono ?? "—" },
  { header: "Emergencia Médica - N° Afiliado", width: 24, get: (ins) => ins.fichaMedica?.emergenciaMedica?.NroAfiliadoAEmergencia ?? "—" },
  // Ficha médica - Familia de referencia
  { header: "Familia Ref. - Nombre y Apellido", width: 26, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.nombreYApellido ?? "—" },
  { header: "Familia Ref. - Parentesco", width: 20, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.parentesco ?? "—" },
  { header: "Familia Ref. - Domicilio", width: 26, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.domicilio ?? "—" },
  { header: "Familia Ref. - Localidad", width: 20, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.localidad ?? "—" },
  { header: "Familia Ref. - Provincia", width: 20, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.provincia ?? "—" },
  { header: "Familia Ref. - Teléfono", width: 20, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.telefono ?? "—" },
  { header: "Familia Ref. - Otro Teléfono", width: 22, get: (ins) => ins.fichaMedica?.familiaDeReferencia?.otroTelefono || "—" },
  { header: "¿DNI Frente?", width: 14, center: true, get: (ins) => formatBool(ins.dniFrente) },
  { header: "¿DNI Dorso?", width: 14, center: true, get: (ins) => formatBool(ins.dniDorso) },
  { header: "¿Comprobante Pago?", width: 18, center: true, get: (ins) => formatBool(ins.comprobantePago) },
  { header: "Fecha de Inscripción", width: 20, center: true, get: (ins) => formatDate(ins.creado) },
];

/**
 * Exporta todas las inscripciones del ciclo TSM 2027 a un archivo .xlsx
 * incluyendo todos los datos (datos principales, emergencia y ficha médica),
 * excepto la foto.
 *
 * @param {Array} inscriptions
 */
export const exportInscripcionesXLSX = (inscriptions, career = "TSM") => {
  if (!inscriptions || inscriptions.length === 0) return;

  const ws = {};
  const range = { s: { c: 0, r: 0 }, e: { c: columns.length - 1, r: inscriptions.length } };

  columns.forEach((col, c) => {
    const ref = XLSX.utils.encode_cell({ c, r: 0 });
    ws[ref] = { v: col.header, t: "s", s: headerStyle };
  });

  inscriptions.forEach((ins, i) => {
    const r = i + 1;
    const isAlt = i % 2 === 1;

    columns.forEach((col, c) => {
      const ref = XLSX.utils.encode_cell({ c, r });
      const rawValue = col.get(ins, i);
      const isNumber = typeof rawValue === "number";
      const style = col.isId
        ? idStyle(isAlt)
        : col.center
        ? cellStyleCenter(isAlt)
        : cellStyle(isAlt);

      ws[ref] = {
        v: isNumber ? rawValue : sanitizeCell(String(rawValue ?? "—")),
        t: isNumber ? "n" : "s",
        s: style,
      };
    });
  });

  ws["!ref"] = XLSX.utils.encode_range(range);
  ws["!cols"] = columns.map((col) => ({ wch: col.width }));
  ws["!rows"] = [{ hpt: 28 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inscripciones");

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `Inscripciones_${career}_2027_${fecha}.xlsx`);
};

