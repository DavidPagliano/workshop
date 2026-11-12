import JSZip from "jszip";
import toast from "react-hot-toast";

const sanitizeFileName = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/[^a-zA-Z0-9_-]/g, "_") // caracteres válidos para nombres de archivo
    .slice(0, 40);

const detectExtension = (base64String) => {
  if (!base64String || typeof base64String !== "string") return "jpg";
  if (base64String.startsWith("data:application/pdf")) return "pdf";
  if (base64String.startsWith("data:image/png")) return "png";
  if (base64String.startsWith("data:image/webp")) return "webp";
  if (base64String.startsWith("data:image/gif")) return "gif";
  return "jpg";
};

/**
 * Exporta todos los comprobantes de pago (imágenes y PDFs) de los inscriptos
 * empaquetados en un archivo .zip que extrae una carpeta organizada.
 *
 * @param {Array} inscriptions - Lista de inscriptos (TSM o TSP)
 * @param {string} career - Identificador de la carrera ("TSM" | "TSP")
 */
export const exportComprobantesZip = async (inscriptions = [], career = "TSM") => {
  if (!inscriptions || inscriptions.length === 0) {
    toast.error("No hay inscriptos para exportar.");
    return;
  }

  const withReceipt = inscriptions.filter((ins) => Boolean(ins.comprobantePago));

  if (withReceipt.length === 0) {
    toast.error("Ninguno de los inscriptos cuenta con comprobante de pago adjunto.");
    return;
  }

  const toastId = toast.loading(`Comprimiendo ${withReceipt.length} comprobante(s)...`);

  try {
    const zip = new JSZip();
    const folderName = `Comprobantes_${career}_2027`;
    const folder = zip.folder(folderName);

    const usedNames = new Set();

    withReceipt.forEach((ins, index) => {
      const ext = detectExtension(ins.comprobantePago);
      const cleanApellido = sanitizeFileName(ins.apellido || "Alumno");
      const cleanNombre = sanitizeFileName(ins.nombre || "SinNombre");
      const cleanDni = sanitizeFileName(ins.dni || "DNI");
      const idPrefix = ins.inscriptionId ? sanitizeFileName(ins.inscriptionId) : `ins-${index + 1}`;

      let baseName = `${idPrefix}_${cleanApellido}_${cleanNombre}_DNI_${cleanDni}`;
      let finalName = `${baseName}.${ext}`;

      let duplicateCounter = 1;
      while (usedNames.has(finalName)) {
        finalName = `${baseName}_(${duplicateCounter}).${ext}`;
        duplicateCounter++;
      }
      usedNames.add(finalName);

      // Extraer datos base64 eliminando cabecera data URI si existe
      const rawBase64 = ins.comprobantePago.includes(",")
        ? ins.comprobantePago.split(",")[1]
        : ins.comprobantePago;

      folder.file(finalName, rawBase64, { base64: true });
    });

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${withReceipt.length} comprobante(s) exportado(s) con éxito.`, { id: toastId });
  } catch (error) {
    console.error("Error al exportar comprobantes:", error);
    toast.error("Ocurrió un error al empaquetar los comprobantes.", { id: toastId });
  }
};

