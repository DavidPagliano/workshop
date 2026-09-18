import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { importUsers } from "../../services/adminService";

export const ImportUsersDialog = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [importResult, setImportResult] = useState(null);

  const resetState = () => {
    setFile(null);
    setLoading(false);
    setGeneralError("");
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (loading) return;
    const hadSuccess = importResult?.results?.created?.length > 0;
    resetState();
    onClose();
    if (hadSuccess && onSuccess) {
      onSuccess();
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setGeneralError("");
    setImportResult(null);

    if (!selectedFile) return;

    const validExtensions = [".xls", ".xlsx"];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      setGeneralError(
        "Formato no válido. Por favor selecciona un archivo Excel (.xls o .xlsx).",
      );
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setGeneralError("El archivo supera el límite máximo de 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleDownloadTemplate = () => {
    // Generar archivo CSV con cabecera y ejemplos con codificación UTF-8 con BOM para que Excel lo abra perfecto
    const headers = "usuario,email,contraseña,rol\n";
    const exampleRows =
      "admin.ejemplo,admin@ejemplo.com,ClaveSegura123,admin\n" +
      "staff.registro,registro@ejemplo.com,ClaveSegura123,staff_registracion\n" +
      "staff.bedele,bedele@ejemplo.com,ClaveSegura123,staff_bedele\n" +
      "director.ejemplo,director@ejemplo.com,ClaveSegura123,director\n";

    const bom = "\uFEFF";
    const blob = new Blob([bom + headers + exampleRows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla_usuarios_workshop.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Plantilla de ejemplo descargada");
  };

  const handleUpload = async () => {
    if (!file) {
      setGeneralError("Debes seleccionar un archivo Excel (.xls o .xlsx)");
      return;
    }

    setLoading(true);
    setGeneralError("");
    setImportResult(null);

    try {
      const response = await importUsers(file);
      setImportResult(response);
      toast.success(response.message || "Importación completada");
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setGeneralError(
        err.message || "Ocurrió un error al procesar la importación.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={mobile}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <UploadFileIcon color="primary" sx={{ fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Importar usuarios desde Excel
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {/* Guía de formato y requisitos */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "rgba(0, 180, 255, 0.04)",
            borderColor: "primary.light",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              Requisitos de columnas en el archivo (.xls / .xlsx):
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadTemplate}
              sx={{ textTransform: "none", fontSize: "0.8rem", py: 0.2 }}
            >
              Descargar plantilla modelo
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            El archivo debe incluir en la primera fila los siguientes
            encabezados:
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
            <Chip
              label="usuario"
              size="small"
              color="primary"
              variant="filled"
            />
            <Chip label="email" size="small" color="primary" variant="filled" />
            <Chip
              label="contraseña"
              size="small"
              color="primary"
              variant="filled"
            />
            <Chip label="rol" size="small" color="primary" variant="filled" />
          </Box>

          <Typography variant="caption" color="text.secondary" component="div">
            • <b>Roles permitidos:</b> <code>admin</code>, <code>director</code>
            , <code>staff_registracion</code>, <code>staff_bedele</code> (o
            Administrador, Director, Staff Registración, Staff Bedele).
            <br />• <b>Contraseña:</b> mínimo 6 caracteres (se encripta de forma
            segura al guardarse).
            <br />• Si un usuario o email ya existe en el sistema o está
            repetido en el archivo, se omitirá automáticamente para evitar
            duplicados.
          </Typography>
        </Paper>

        {generalError && (
          <Alert severity="error" onClose={() => setGeneralError("")}>
            {generalError}
          </Alert>
        )}

        {/* Zona de Dropzone / Selección de archivo */}
        {!importResult && (
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragOver ? "primary.main" : "primary.light",
              borderRadius: 2,
              p: { xs: 2.5, sm: 4 },
              textAlign: "center",
              bgcolor: dragOver
                ? "rgba(0, 180, 255, 0.08)"
                : "background.paper",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "rgba(0, 180, 255, 0.04)",
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <CloudUploadIcon
              sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {file
                ? file.name
                : "Hacé clic para seleccionar o arrastrá tu archivo Excel"}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Soporta formatos <b>.xls</b> y <b>.xlsx</b> (hasta 5MB)
            </Typography>

            {file && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                  px: 2,
                  py: 0.75,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <InsertDriveFileIcon color="primary" fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {file.name} ({formatFileSize(file.size)})
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {/* Resumen de resultados de importación */}
        {importResult && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Alert
              severity={
                importResult.results.created.length > 0
                  ? "success"
                  : importResult.results.errors.length > 0
                    ? "error"
                    : "warning"
              }
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {importResult.message}
              </Typography>
            </Alert>

            {/* Tarjetas métricas */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.5,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderColor: "success.main",
                  bgcolor: "rgba(46, 125, 50, 0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {importResult.results.created.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Usuarios creados
                </Typography>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderColor: "warning.main",
                  bgcolor: "rgba(237, 108, 2, 0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "warning.main" }}
                >
                  {importResult.results.skipped.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Omitidos (duplicados)
                </Typography>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderColor: "error.main",
                  bgcolor: "rgba(211, 47, 47, 0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "error.main" }}
                >
                  {importResult.results.errors.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Filas con errores
                </Typography>
              </Paper>
            </Box>

            {/* Detalle de usuarios creados */}
            {importResult.results.created.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "success.main", mb: 0.5 }}
                >
                  Usuarios creados ({importResult.results.created.length}):
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ maxHeight: 130, overflowY: "auto", p: 1 }}
                >
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {importResult.results.created.map((u, idx) => (
                      <Chip
                        key={idx}
                        icon={<CheckCircleIcon />}
                        label={`${u.username} (${u.role})`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Detalle de omitidos */}
            {importResult.results.skipped.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "warning.main", mb: 0.5 }}
                >
                  Detalle de usuarios omitidos (
                  {importResult.results.skipped.length}):
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ maxHeight: 130, overflowY: "auto" }}
                >
                  <List dense disablePadding>
                    {importResult.results.skipped.map((s, idx) => (
                      <ListItem
                        key={idx}
                        divider={idx < importResult.results.skipped.length - 1}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <WarningAmberIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Fila ${s.row}: ${s.username || "—"}`}
                          secondary={s.reason}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 600,
                          }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}

            {/* Detalle de errores */}
            {importResult.results.errors.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "error.main", mb: 0.5 }}
                >
                  Detalle de errores ({importResult.results.errors.length}):
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ maxHeight: 140, overflowY: "auto" }}
                >
                  <List dense disablePadding>
                    {importResult.results.errors.map((errItem, idx) => (
                      <ListItem
                        key={idx}
                        divider={idx < importResult.results.errors.length - 1}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <ErrorOutlineIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Fila ${errItem.row}${errItem.username ? ` (${errItem.username})` : ""}`}
                          secondary={errItem.reason}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 600,
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                            color: "error.main",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        {importResult ? (
          <>
            <Button
              onClick={() => {
                resetState();
              }}
              variant="outlined"
            >
              Cargar otro archivo
            </Button>
            <Button onClick={handleClose} variant="contained">
              Finalizar y ver usuarios
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!file || loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <UploadFileIcon />
                )
              }
            >
              {loading ? "Procesando archivo..." : "Comenzar importación"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
