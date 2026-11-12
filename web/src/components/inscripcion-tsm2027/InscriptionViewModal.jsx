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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BadgeIcon from "@mui/icons-material/Badge";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
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

const openBase64InNewTab = (dataUrl) => {
  if (!dataUrl) return;
  const win = window.open();
  if (win) {
    win.document.write(
      `<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
    );
  }
};

/**
 * Modal de vista detallada (solo lectura) para una inscripción.
 */
export const InscriptionViewModal = ({ open, onClose, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data) return null;

  const isPdfReceipt = Boolean(
    data.comprobantePago &&
    data.comprobantePago.startsWith("data:application/pdf"),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: 300 },
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
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Cabecera con Foto de perfil */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            src={data.foto || undefined}
            alt={`Foto de ${data.nombre || "inscripto"}`}
            sx={{
              width: { xs: 120, sm: 150 },
              height: { xs: 120, sm: 150 },
              border: "3px solid",
              borderColor: "primary.main",
              bgcolor: "rgba(0, 180, 255, 0.12)",
              boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
              mb: 1.5,
            }}
          >
            <PersonIcon
              sx={{ fontSize: { xs: 58, sm: 72 }, color: "primary.main" }}
            />
          </Avatar>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, textAlign: "center" }}
          >
            {data.nombre} {data.apellido}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            DNI: {data.dni}{" "}
            {data.fichaMedica?.edad ? `· ${data.fichaMedica.edad} años` : ""}
            {data.creado ? ` · Inscripto el ${formatDate(data.creado)}` : ""}
          </Typography>
        </Box>

        {/* Sección: Documentación adjunta (DNI y Comprobante) */}
        <Box sx={{ mb: 3 }}>
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
              mb: 1.5,
            }}
          >
            Documentación Adjunta (DNI y Comprobante de Pago)
          </Typography>

          <Grid container spacing={2}>
            {/* DNI Frente */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <BadgeIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    DNI — Frente
                  </Typography>
                </Box>
                {data.dniFrente ? (
                  <Box
                    component="img"
                    src={data.dniFrente}
                    alt="DNI Frente"
                    onClick={() => openBase64InNewTab(data.dniFrente)}
                    sx={{
                      width: "100%",
                      aspectRatio: "1.58 / 1",
                      objectFit: "contain",
                      bgcolor: "#000",
                      borderRadius: 1,
                      cursor: "pointer",
                      display: "block",
                    }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No adjuntado
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* DNI Dorso */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <BadgeIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    DNI — Dorso
                  </Typography>
                </Box>
                {data.dniDorso ? (
                  <Box
                    component="img"
                    src={data.dniDorso}
                    alt="DNI Dorso"
                    onClick={() => openBase64InNewTab(data.dniDorso)}
                    sx={{
                      width: "100%",
                      aspectRatio: "1.58 / 1",
                      objectFit: "contain",
                      bgcolor: "#000",
                      borderRadius: 1,
                      cursor: "pointer",
                      display: "block",
                    }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No adjuntado
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Comprobante de Pago */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <ReceiptLongIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Comprobante de Pago
                  </Typography>
                </Box>
                {data.comprobantePago ? (
                  isPdfReceipt ? (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <PictureAsPdfIcon
                        sx={{ color: "error.main", fontSize: 44, mb: 1 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => openBase64InNewTab(data.comprobantePago)}
                      >
                        Ver Documento PDF
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      component="img"
                      src={data.comprobantePago}
                      alt="Comprobante de pago"
                      onClick={() => openBase64InNewTab(data.comprobantePago)}
                      sx={{
                        width: "100%",
                        aspectRatio: "1.58 / 1",
                        objectFit: "contain",
                        bgcolor: "#000",
                        borderRadius: 1,
                        cursor: "pointer",
                        display: "block",
                      }}
                    />
                  )
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No adjuntado
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {PERSONAL_SECTIONS.map((section) => (
          <SectionDetail key={section.title} section={section} data={data} />
        ))}

        {MEDICAL_SECTIONS.map((section) => (
          <SectionDetail key={section.title} section={section} data={data} />
        ))}
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
          onClick={onClose}
          variant="outlined"
          sx={{ flex: { xs: "1 1 100%", sm: "0 0 auto" } }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
