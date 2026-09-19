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
import { PreinscriptionFormModal } from "../../components/inscripcion-tsm/PreInscriptionFormModal";
import { PreinscriptionViewModal } from "../../components/inscripcion-tsm/PreInscriptionViewModal";
import { PreinscriptionDeleteModal } from "../../components/inscripcion-tsm/PreInscriptionDeleteModal";
import { usePreCycleRegistrations } from "../../hooks/usePreCycleRegistrations";
import { exportPreInscripcionesXLSX } from "../../utils/exportPreInscripcionesXLSX";

export const CyclePreinscriptionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    registrations,
    tableLoading,
    fetchRegistrations,
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
  } = usePreCycleRegistrations();

  // ── Columnas de la tabla ──
  const columns = [
    { key: "registrarId", label: "N° Reg." },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "dni", label: "DNI" },
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
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              Gestión de Pre-inscripciones
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Ciclo 2027 — {registrations.length} inscripto
              {registrations.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refrescar">
              <IconButton
                onClick={fetchRegistrations}
                disabled={tableLoading}
                sx={{ color: "primary.main" }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={() => exportPreInscripcionesXLSX(registrations)}
              disabled={tableLoading || registrations.length === 0}
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
      ) : registrations.length === 0 ? (
        <Fade in timeout={700}>
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              border: "1.5px solid",
              borderColor: "primary.main",
              boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
              borderRadius: 0,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body1" color="textSecondary">
              No hay pre-inscripciones registradas.
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
            {registrations.map((reg, index) => (
              <Card
                key={reg.registrarId || index}
                variant="outlined"
                sx={{
                  border: "1.5px solid",
                  borderColor: "primary.main",
                  boxShadow: "3px 3px 0px rgba(213, 0, 186, 0.4)",
                  borderRadius: 0,
                  bgcolor: "background.paper",
                }}
              >
                <CardActionArea onClick={() => handleOpenView(reg)}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {reg.nombre} {reg.apellido}
                      </Typography>
                      <Chip
                        label={`#${reg.registrarId}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(0, 180, 255, 0.12)",
                          color: "primary.main",
                          fontWeight: 600,
                          borderRadius: 0,
                          border: "1px solid rgba(0, 180, 255, 0.3)",
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      DNI: {reg.dni} · {reg.email || "—"}
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
                    onClick={() =>
                      handleOpenEdit(reg, { stopPropagation: () => {} })
                    }
                    sx={{
                      color: "primary.main",
                      "&:hover": { bgcolor: "rgba(0, 180, 255, 0.12)" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleOpenDelete(reg, { stopPropagation: () => {} })
                    }
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
            <Table sx={{ minWidth: 600 }}>
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
                {registrations.map((reg, index) => (
                  <TableRow
                    key={reg.registrarId || index}
                    hover
                    onClick={() => handleOpenView(reg)}
                    sx={{
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(0, 180, 255, 0.04) !important",
                      },
                      borderBottom:
                        index < registrations.length - 1 ? "1px solid" : "none",
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
                        {col.key === "registrarId" ? (
                          <Chip
                            label={reg[col.key]}
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
                          reg[col.key] || "—"
                        )}
                      </TableCell>
                    ))}
                    <TableCell
                      align="right"
                      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                    >
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenEdit(reg, e)}
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
                          onClick={(e) => handleOpenDelete(reg, e)}
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
      <PreinscriptionFormModal
        open={formModalOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        initialData={formEditData}
        loading={formLoading}
      />

      <PreinscriptionViewModal
        open={viewModalOpen}
        onClose={handleViewClose}
        data={viewData}
      />

      <PreinscriptionDeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        data={deleteData}
        loading={deleteLoading}
      />
    </Container>
  );
};
