import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import { InscriptionFormModal } from "../../components/inscripcion-tsm2027/InscriptionFormModal";
import { InscriptionViewModal } from "../../components/inscripcion-tsm2027/InscriptionViewModal";
import { InscriptionDeleteModal } from "../../components/inscripcion-tsm2027/InscriptionDeleteModal";
import { useInscriptions } from "../../hooks/useInscriptions";
import { inscriptionTSMService } from "../../services/inscriptionTSMService";

export const CycleInscriptionPage = ({ career = "TSM", service = inscriptionTSMService }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    inscriptions,
    tableLoading,
    fetchInscriptions,
    formModalOpen,
    formEditData,
    formLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleFormClose,
    handleFormSave,
    viewModalOpen,
    viewData,
    handleOpenView,
    handleViewClose,
    deleteModalOpen,
    deleteData,
    deleteLoading,
    handleOpenDelete,
    handleDeleteClose,
    handleDeleteConfirm,
  } = useInscriptions(service);

  const [exportingZip, setExportingZip] = useState(false);

  // Carga diferida de xlsx-js-style recién al exportar
  const handleExportExcel = async () => {
    const { exportInscripcionesXLSX } = await import(
      "../../utils/exportInscripcionesXLSX"
    );
    exportInscripcionesXLSX(inscriptions, career);
  };

  // Carga diferida y descarga en ZIP de todos los comprobantes (imágenes o PDFs)
  const handleExportReceipts = async () => {
    setExportingZip(true);
    try {
      const { exportComprobantesZip } = await import(
        "../../utils/exportComprobantesZip"
      );
      await exportComprobantesZip(inscriptions, career);
    } finally {
      setExportingZip(false);
    }
  };

  // ── Columnas de la tabla ──
  const columns = [
    { key: "inscriptionId", label: "N° Insc." },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "dni", label: "DNI" },
    { key: "añoACursar", label: "Año" },
    { key: "telefono", label: "Teléfono" },
    { key: "email", label: "Email" },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{ minHeight: "100vh", pt: { xs: 4, sm: 6 }, pb: { xs: 6, sm: 8 } }}
    >
      {/* ── Header ── */}
      <Fade in timeout={500}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              Gestión de Inscripciones {career}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Ciclo 2027 — {inscriptions.length} inscripto
              {inscriptions.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-end" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              minWidth: 0,
              "& > .MuiButton-root": {
                flex: { xs: "1 1 auto", sm: "0 0 auto" },
                minWidth: 0,
                whiteSpace: "nowrap",
                px: { xs: 1.5, sm: 2.5 },
                py: { xs: 0.75, sm: 1 },
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
              },
            }}
          >
            <Tooltip title="Refrescar">
              <IconButton
                onClick={fetchInscriptions}
                disabled={tableLoading}
                sx={{ color: "primary.main" }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportExcel}
              disabled={tableLoading || inscriptions.length === 0}
              sx={{
                bgcolor: "rgba(7, 16, 82, 0.95)",
                color: "#FFFFFF",
                borderColor: "#D500BA",
                boxShadow: "4px 4px 0px rgba(0, 180, 255, 0.5)",
                "&:hover": {
                  bgcolor: "#D500BA",
                  borderColor: "#D500BA",
                  color: "#FFFFFF",
                  boxShadow: "6px 6px 0px rgba(0, 180, 255, 0.5)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(7, 16, 82, 0.5)",
                  borderColor: "rgba(213, 0, 186, 0.3)",
                  color: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "none",
                },
              }}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={
                exportingZip ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <FolderZipIcon />
                )
              }
              onClick={handleExportReceipts}
              disabled={tableLoading || exportingZip || inscriptions.length === 0}
              sx={{
                bgcolor: "rgba(7, 16, 82, 0.95)",
                color: "#FFFFFF",
                borderColor: "#00B4FF",
                boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
                "&:hover": {
                  bgcolor: "#00B4FF",
                  borderColor: "#00B4FF",
                  color: "#071052",
                  boxShadow: "6px 6px 0px rgba(213, 0, 186, 0.5)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(7, 16, 82, 0.5)",
                  borderColor: "rgba(0, 180, 255, 0.3)",
                  color: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "none",
                },
              }}
            >
              {exportingZip ? "Exportando..." : "Exportar Comprobantes"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Agregar
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* ── Contenido: tabla (desktop) o cards (mobile) ── */}
      {tableLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : inscriptions.length === 0 ? (
        <Fade in timeout={700}>
          <Paper
            sx={{
              p: { xs: 2.5, sm: 5 },
              textAlign: "center",
              border: "1.5px solid",
              borderColor: "primary.main",
              boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
              borderRadius: 0,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body1" color="textSecondary">
              No hay inscripciones registradas.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ mt: 2 }}
            >
              Agregar la primera
            </Button>
          </Paper>
        </Fade>
      ) : isMobile ? (
        /* ── Vista Mobile: Cards ── */
        <Fade in timeout={700} style={{ transitionDelay: "200ms" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {inscriptions.map((ins, index) => (
              <Card
                key={ins.inscriptionId || index}
                variant="outlined"
                sx={{
                  border: "1.5px solid",
                  borderColor: "primary.main",
                  boxShadow: "3px 3px 0px rgba(213, 0, 186, 0.4)",
                  borderRadius: 0,
                  bgcolor: "background.paper",
                }}
              >
                <CardActionArea onClick={() => handleOpenView(ins)}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, minWidth: 0, overflowWrap: "anywhere" }}
                      >
                        {ins.nombre} {ins.apellido}
                      </Typography>
                      <Chip
                        label={`#${ins.inscriptionId}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(0, 180, 255, 0.12)",
                          color: "primary.main",
                          fontWeight: 600,
                          borderRadius: 0,
                          border: "1px solid rgba(0, 180, 255, 0.3)",
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      DNI: {ins.dni} · Año: {ins.añoACursar || "—"} · {ins.email || "—"}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Divider sx={{ borderColor: "divider" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenEdit(ins, e)}
                    sx={{
                      color: "primary.main",
                      "&:hover": { bgcolor: "rgba(0, 180, 255, 0.12)" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenDelete(ins, e)}
                    sx={{
                      color: "secondary.main",
                      "&:hover": { bgcolor: "rgba(213, 0, 186, 0.12)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </Fade>
      ) : (
        /* ── Vista Desktop: Tabla ── */
        <Fade in timeout={700} style={{ transitionDelay: "200ms" }}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              border: "1.5px solid",
              borderColor: "primary.main",
              boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
              borderRadius: 0,
              bgcolor: "background.paper",
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(0, 180, 255, 0.08)" }}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        borderBottom: "1.5px solid",
                        borderColor: "divider",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      borderBottom: "1.5px solid",
                      borderColor: "divider",
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscriptions.map((ins, index) => (
                  <TableRow
                    key={ins.inscriptionId || index}
                    hover
                    onClick={() => handleOpenView(ins)}
                    sx={{
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(0, 180, 255, 0.04) !important",
                      },
                      borderBottom:
                        index < inscriptions.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {col.key === "inscriptionId" ? (
                          <Chip
                            label={ins[col.key]}
                            size="small"
                            sx={{
                              bgcolor: "rgba(0, 180, 255, 0.12)",
                              color: "primary.main",
                              fontWeight: 600,
                              borderRadius: 0,
                              border: "1px solid",
                              borderColor: "rgba(0, 180, 255, 0.3)",
                            }}
                          />
                        ) : (
                          ins[col.key] || "—"
                        )}
                      </TableCell>
                    ))}
                    <TableCell
                      align="right"
                      sx={{ borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap" }}
                    >
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenEdit(ins, e)}
                          sx={{
                            color: "primary.main",
                            mr: 0.5,
                            "&:hover": { bgcolor: "rgba(0, 180, 255, 0.12)" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenDelete(ins, e)}
                          sx={{
                            color: "secondary.main",
                            "&:hover": { bgcolor: "rgba(213, 0, 186, 0.12)" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {/* ── Modales ── */}
      <InscriptionFormModal
        open={formModalOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        initialData={formEditData}
        loading={formLoading}
      />

      <InscriptionViewModal
        open={viewModalOpen}
        onClose={handleViewClose}
        data={viewData}
      />

      <InscriptionDeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        data={deleteData}
        loading={deleteLoading}
      />
    </Container>
  );
};

