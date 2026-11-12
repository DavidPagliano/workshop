import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Fade,
  Divider,
  Typography,
  Avatar,
  Chip,
  Grid,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BadgeIcon from "@mui/icons-material/Badge";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DownloadIcon from "@mui/icons-material/Download";
import {
  MEDICAL_SECTIONS,
  PERSONAL_SECTIONS,
} from "../../config/inscriptionFields";

const getIn = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

const formatValue = (field, rawValue) => {
  if (field.kind === "switch") return rawValue ? "Sí" : "No";
  if (field.kind === "date") return formatDate(rawValue);
  const str = String(rawValue ?? "").trim();
  if (!str) return "—";
  if (field.kind === "select" && field.options) {
    const match = field.options.find((opt) => opt.value === str);
    return match ? match.label : str;
  }
  return str;
};

const SectionDetail = ({ section, data }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: "primary.main",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        py: 0.75,
        px: 1,
        bgcolor: "rgba(0, 180, 255, 0.08)",
        borderLeft: "3px solid",
        borderColor: "secondary.main",
        mb: 1,
      }}
    >
      {section.title}
    </Typography>

    {section.fields.map((field, idx) => (
      <Box key={field.name}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 0.5, sm: 2 },
            py: 1,
            px: 1,
            "&:hover": { bgcolor: "rgba(0, 180, 255, 0.04)" },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            {field.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textAlign: { xs: "left", sm: "right" },
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {formatValue(field, getIn(data, field.name))}
          </Typography>
        </Box>
        {idx < section.fields.length - 1 && (
          <Divider sx={{ borderColor: "divider" }} />
        )}
      </Box>
    ))}
  </Box>
);

const dataUrlToBlob = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  if (!dataUrl.startsWith("data:")) return null;
  try {
    const parts = dataUrl.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const b64Data = parts[1] || "";
    const binaryStr = atob(b64Data);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  } catch (e) {
    console.error("Error convirtiendo data URI a Blob:", e);
    return null;
  }
};

const openBase64InNewTab = (dataUrl) => {
  if (!dataUrl) return;

  if (
    dataUrl.startsWith("http://") ||
    dataUrl.startsWith("https://") ||
    dataUrl.startsWith("blob:")
  ) {
    window.open(dataUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const blob = dataUrlToBlob(dataUrl);
  if (blob) {
    const blobUrl = URL.createObjectURL(blob);
    const newWindow = window.open(blobUrl, "_blank");
    if (!newWindow) {
      downloadBase64(dataUrl, "documento");
    } else {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    }
  } else {
    const win = window.open();
    if (win) {
      win.location.href = dataUrl;
    }
  }
};

const downloadBase64 = (dataUrl, filename = "documento") => {
  if (!dataUrl) return;
  try {
    let url = dataUrl;
    let shouldRevoke = false;
    const blob = dataUrlToBlob(dataUrl);
    if (blob) {
      url = URL.createObjectURL(blob);
      shouldRevoke = true;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (shouldRevoke) {
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  } catch (err) {
    console.error("Error al descargar archivo:", err);
  }
};

/**
 * Modal de vista detallada (solo lectura) para una inscripción con navegación en solapas (tabs).
 */
export const InscriptionViewModal = ({ open, onClose, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(0);

  const handleClose = (event, reason) => {
    setActiveTab(0);
    if (onClose) onClose(event, reason);
  };

  if (!data) return null;

  const isPdfReceipt = Boolean(
    data.comprobantePago &&
      data.comprobantePago.startsWith("data:application/pdf"),
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slots={{ transition: Fade }}
      slotProps={{
        transition: {
          timeout: 300,
          onEnter: () => setActiveTab(0),
        },
        paper: {
          sx: {
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
            borderRadius: 0,
            bgcolor: "background.paper",
            maxHeight: isMobile ? "100vh" : "calc(100vh - 32px)",
            height: isMobile ? "100vh" : "auto",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            minWidth: 0,
            pr: 1,
            fontWeight: 700,
          }}
        >
          <PersonIcon sx={{ color: "primary.main" }} />
          Detalle del Inscripto
          {data.inscriptionId && (
            <Chip
              label={`#${data.inscriptionId}`}
              size="small"
              sx={{
                bgcolor: "rgba(0, 180, 255, 0.12)",
                color: "primary.main",
                fontWeight: 700,
                borderRadius: 0,
                border: "1px solid rgba(0, 180, 255, 0.3)",
              }}
            />
          )}
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 3 },
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Cabecera del Inscripto */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            mb: 2,
            p: 2,
            bgcolor: "rgba(0, 180, 255, 0.05)",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Avatar
            src={data.foto || undefined}
            alt={`Foto de ${data.nombre || "inscripto"}`}
            sx={{
              width: { xs: 70, sm: 76 },
              height: { xs: 70, sm: 76 },
              border: "2px solid",
              borderColor: "primary.main",
              bgcolor: "rgba(0, 180, 255, 0.12)",
              boxShadow: "2px 2px 0px rgba(213, 0, 186, 0.4)",
              flexShrink: 0,
            }}
          >
            <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />
          </Avatar>
          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {data.nombre} {data.apellido}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              DNI: <strong>{data.dni || "—"}</strong>
              {data.fichaMedica?.edad ? ` · ${data.fichaMedica.edad} años` : ""}
              {data.creado ? ` · Inscripto el ${formatDate(data.creado)}` : ""}
            </Typography>
          </Box>
        </Box>

        {/* Tabs de navegación */}
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            mb: 2.5,
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "none",
              minHeight: 46,
            },
          }}
        >
          <Tab
            icon={<PersonIcon fontSize="small" />}
            iconPosition="start"
            label="Datos Personales"
          />
          <Tab
            icon={<BadgeIcon fontSize="small" />}
            iconPosition="start"
            label="Foto DNI"
          />
          <Tab
            icon={<MedicalServicesIcon fontSize="small" />}
            iconPosition="start"
            label="Ficha Médica"
          />
          <Tab
            icon={<ReceiptLongIcon fontSize="small" />}
            iconPosition="start"
            label="Comprobante"
          />
        </Tabs>

        {/* TAB 0: Datos Personales */}
        {activeTab === 0 && (
          <Box>
            {PERSONAL_SECTIONS.map((section) => (
              <SectionDetail
                key={section.title}
                section={section}
                data={data}
              />
            ))}
          </Box>
        )}

        {/* TAB 1: Foto DNI */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Imágenes de documentación personal adjuntadas durante la
              inscripción. Hacé clic en la imagen o en el botón para ver en
              tamaño completo.
            </Typography>
            <Grid container spacing={2}>
              {/* DNI Frente */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BadgeIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        DNI — Frente
                      </Typography>
                    </Box>
                    {data.dniFrente && (
                      <Button
                        size="small"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => openBase64InNewTab(data.dniFrente)}
                        sx={{ fontSize: "0.75rem", textTransform: "none" }}
                      >
                        Ver completo
                      </Button>
                    )}
                  </Box>
                  {data.dniFrente ? (
                    <Box
                      component="img"
                      src={data.dniFrente}
                      alt="DNI Frente"
                      onClick={() => openBase64InNewTab(data.dniFrente)}
                      sx={{
                        width: "100%",
                        maxHeight: 280,
                        objectFit: "contain",
                        bgcolor: "#000",
                        borderRadius: 1,
                        cursor: "pointer",
                        display: "block",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "rgba(255,255,255,0.02)",
                        borderRadius: 1,
                        border: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No adjuntado
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* DNI Dorso */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BadgeIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        DNI — Dorso
                      </Typography>
                    </Box>
                    {data.dniDorso && (
                      <Button
                        size="small"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => openBase64InNewTab(data.dniDorso)}
                        sx={{ fontSize: "0.75rem", textTransform: "none" }}
                      >
                        Ver completo
                      </Button>
                    )}
                  </Box>
                  {data.dniDorso ? (
                    <Box
                      component="img"
                      src={data.dniDorso}
                      alt="DNI Dorso"
                      onClick={() => openBase64InNewTab(data.dniDorso)}
                      sx={{
                        width: "100%",
                        maxHeight: 280,
                        objectFit: "contain",
                        bgcolor: "#000",
                        borderRadius: 1,
                        cursor: "pointer",
                        display: "block",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "rgba(255,255,255,0.02)",
                        borderRadius: 1,
                        border: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No adjuntado
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* TAB 2: Ficha Médica */}
        {activeTab === 2 && (
          <Box>
            {MEDICAL_SECTIONS.map((section) => (
              <SectionDetail
                key={section.title}
                section={section}
                data={data}
              />
            ))}
          </Box>
        )}

        {/* TAB 3: Comprobante */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Comprobante de pago o transferencia de la matrícula de inscripción.
            </Typography>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ReceiptLongIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Comprobante de Pago
                  </Typography>
                </Box>
                {data.comprobantePago && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => openBase64InNewTab(data.comprobantePago)}
                      sx={{ fontSize: "0.75rem", textTransform: "none" }}
                    >
                      Abrir
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() =>
                        downloadBase64(
                          data.comprobantePago,
                          `Comprobante_${data.dni || "pago"}.${isPdfReceipt ? "pdf" : "jpg"}`,
                        )
                      }
                      sx={{ fontSize: "0.75rem", textTransform: "none" }}
                    >
                      Descargar
                    </Button>
                  </Box>
                )}
              </Box>

              {data.comprobantePago ? (
                isPdfReceipt ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 5,
                      px: 2,
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <PictureAsPdfIcon
                      sx={{ color: "error.main", fontSize: 56, mb: 1.5 }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Documento PDF Adjunto
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      El comprobante fue cargado en formato PDF.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => openBase64InNewTab(data.comprobantePago)}
                      >
                        Abrir PDF en pestaña
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          downloadBase64(
                            data.comprobantePago,
                            `Comprobante_${data.dni || "pago"}.pdf`,
                          )
                        }
                      >
                        Descargar PDF
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={data.comprobantePago}
                      alt="Comprobante de pago"
                      onClick={() => openBase64InNewTab(data.comprobantePago)}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 460,
                        objectFit: "contain",
                        bgcolor: "#000",
                        borderRadius: 1,
                        cursor: "pointer",
                        display: "inline-block",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.01)",
                        },
                      }}
                    />
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "rgba(255,255,255,0.02)",
                    borderRadius: 1,
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No se adjuntó comprobante de pago para esta inscripción.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 2.5 },
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ flex: { xs: "1 1 100%", sm: "0 0 auto" } }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
