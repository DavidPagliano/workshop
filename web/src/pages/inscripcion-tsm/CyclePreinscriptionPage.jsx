import { useState, useEffect, useCallback } from "react";
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
import toast from "react-hot-toast";
import {
  registerToPreCycle,
  getPreCycleRegistrations,
  updatePreCycleRegistration,
  deletePreCycleRegistration,
} from "../../services/preCycleService";
import { PreinscriptionFormModal } from "../../components/inscripcion-tsm/PreinscriptionFormModal";
import { PreinscriptionViewModal } from "../../components/inscripcion-tsm/PreinscriptionViewModal";
import { PreinscriptionDeleteModal } from "../../components/inscripcion-tsm/PreinscriptionDeleteModal";

const editablePreCycleFields = [
  "nombre",
  "apellido",
  "edad",
  "fechaNacimiento",
  "dni",
  "email",
  "telefono",
  "tituloSecundario",
  "concurreAlgunaIglesias",
  "cual",
];

export const CyclePreinscriptionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ── Estado de la tabla ──
  const [registrations, setRegistrations] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  // ── Estado de modales ──
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formEditData, setFormEditData] = useState(null); // null = crear, object = editar
  const [formLoading, setFormLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Cargar registros ──
  const fetchRegistrations = useCallback(async () => {
    setTableLoading(true);
    try {
      const data = await getPreCycleRegistrations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar registros:", error);
      toast.error("Error al cargar las pre-inscripciones");
    } finally {
      setTableLoading(false);
    }
  }, []);

  // La carga inicial sincroniza datos externos mediante una promesa HTTP.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRegistrations();
  }, [fetchRegistrations]);

  // ── Handlers: Formulario (Crear / Editar) ──
  const handleOpenCreate = () => {
    setFormEditData(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (registration, e) => {
    e.stopPropagation(); // Evitar que se abra el modal de vista
    setFormEditData(registration);
    setFormModalOpen(true);
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setFormEditData(null);
  };

  const handleFormSave = async (formData) => {
    setFormLoading(true);
    try {
      const registrationData = Object.fromEntries(
        editablePreCycleFields
          .filter((field) => Object.hasOwn(formData, field))
          .map((field) => [field, formData[field]]),
      );

      if (formEditData) {
        // Actualizar
        await updatePreCycleRegistration(formEditData.registrarId, registrationData);
        toast.success("Pre-inscripción actualizada con éxito");
      } else {
        // El backend genera registrarId para evitar colisiones.
        await registerToPreCycle(registrationData);
        toast.success("Pre-inscripción registrada con éxito");
      }
      handleFormClose();
      await fetchRegistrations();
    } catch (error) {
      console.error(error);
      const errorMsg =
        error?.message || "Error al procesar la pre-inscripción";
      toast.error(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Handlers: Vista ──
  const handleOpenView = (registration) => {
    setViewData(registration);
    setViewModalOpen(true);
  };

  const handleViewClose = () => {
    setViewModalOpen(false);
    setViewData(null);
  };

  // ── Handlers: Eliminar ──
  const handleOpenDelete = (registration, e) => {
    e.stopPropagation(); // Evitar que se abra el modal de vista
    setDeleteData(registration);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setDeleteData(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteData) return;
    setDeleteLoading(true);
    try {
      await deletePreCycleRegistration(deleteData.registrarId);
      toast.success("Pre-inscripción eliminada con éxito");
      handleDeleteClose();
      await fetchRegistrations();
    } catch (error) {
      console.error(error);
      const errorMsg =
        error?.message || "Error al eliminar la pre-inscripción";
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Columnas de la tabla ──
  const columns = [
    { key: "registrarId", label: "N° Reg." },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "dni", label: "DNI" },
    { key: "email", label: "Email" },
  ];

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", pt: { xs: 4, sm: 6 }, pb: { xs: 6, sm: 8 } }}>
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
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700 }}
                      >
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
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
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
                    onClick={() => handleOpenEdit(reg, { stopPropagation: () => {} })}
                    sx={{
                      color: "primary.main",
                      "&:hover": { bgcolor: "rgba(0, 180, 255, 0.12)" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDelete(reg, { stopPropagation: () => {} })}
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
                        index < registrations.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
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
