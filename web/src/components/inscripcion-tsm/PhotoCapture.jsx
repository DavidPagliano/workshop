import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { usePhotoCapture } from "../../hooks/usePhotoCapture";

export const PhotoCapture = ({ value = "", onChange, disabled = false }) => {
  const {
    cameraOpen,
    capturePhoto,
    error,
    handleFileChange,
    openCamera,
    processing,
    stopCamera,
    videoRef,
  } = usePhotoCapture({ value, onChange });

  return (
    <Box sx={{ p: { xs: 1.25, sm: 2.5 }, width: "100%", boxSizing: "border-box", border: "2px dashed", borderColor: "primary.main", borderRadius: 1, textAlign: "center", bgcolor: "rgba(0, 180, 255, 0.04)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="subtitle2" sx={{ width: "100%", mb: 1, color: "text.secondary", textAlign: "center" }}>
        Foto del aspirante (opcional)
      </Typography>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Avatar
          src={value || undefined}
          alt="Previsualización de la foto del aspirante"
          sx={{ width: { xs: 72, sm: 120 }, height: { xs: 72, sm: 120 }, mb: { xs: 1, sm: 1.5 }, bgcolor: "rgba(0, 180, 255, 0.12)" }}
        >
          <PhotoCameraIcon />
        </Avatar>
      </Box>
      {cameraOpen && (
        <Box sx={{ width: "100%", maxWidth: 280, display: "flex", justifyContent: "center", mb: 1.5 }}>
          <Box component="video" ref={videoRef} autoPlay playsInline muted sx={{ display: "block", width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "50%", bgcolor: "#000" }} />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ width: "100%", boxSizing: "border-box", mb: 1.5, textAlign: "left" }}>{error}</Alert>}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{
          width: "100%",
          minWidth: 0,
          alignItems: "stretch",
          "& > .MuiButton-root": {
            flex: "1 1 0",
            minWidth: 0,
            maxWidth: "none",
            px: { xs: 0.75, sm: 1.5 },
            whiteSpace: "normal",
            textAlign: "center",
            lineHeight: 1.15,
            overflowWrap: "anywhere",
          },
        }}
      >
        <Button component="label" variant="contained" color="primary" disabled={disabled || processing} startIcon={processing ? <CircularProgress size={16} /> : <PhotoCameraIcon />}>
          Subir foto
          <input hidden type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
        {!cameraOpen ? (
          <Button variant="outlined" disabled={disabled || processing} startIcon={<CameraAltIcon />} onClick={openCamera}>
            Usar cámara
          </Button>
        ) : (
          <>
            <Button variant="contained" disabled={disabled || processing} onClick={capturePhoto}>
              Capturar
            </Button>
            <Button variant="text" disabled={processing} onClick={stopCamera}>
              Cancelar
            </Button>
          </>
        )}
        {value && !processing && (
          <Button color="error" variant="text" startIcon={<DeleteIcon />} onClick={() => onChange("")}>
            Quitar
          </Button>
        )}
      </Stack>
      <Typography variant="caption" display="block" sx={{ width: "100%", mt: 1, color: "text.secondary", textAlign: "center" }}>
        Se recorta al centro y se comprime para guardar una imagen liviana.
      </Typography>
    </Box>
  );
};
