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
    <Box sx={{ p: { xs: 1.25, sm: 2.5 }, border: "2px dashed", borderColor: "primary.main", borderRadius: 1, textAlign: "center", bgcolor: "rgba(0, 180, 255, 0.04)" }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
        Foto del aspirante (opcional)
      </Typography>
      <Avatar
        src={value || undefined}
        alt="Previsualización de la foto del aspirante"
        sx={{ width: { xs: 72, sm: 120 }, height: { xs: 72, sm: 120 }, mx: "auto", mb: { xs: 1, sm: 1.5 }, bgcolor: "rgba(0, 180, 255, 0.12)" }}
      >
        <PhotoCameraIcon />
      </Avatar>
      {cameraOpen && (
        <Box sx={{ maxWidth: 280, mx: "auto", mb: 1.5 }}>
          <Box component="video" ref={videoRef} autoPlay playsInline muted sx={{ display: "block", width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "50%", bgcolor: "#000" }} />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 1.5, textAlign: "left" }}>{error}</Alert>}
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
          "& > .MuiButton-root": {
            flex: { xs: "1 1 calc(33.333% - 8px)", sm: "1 1 150px" },
            minWidth: 0,
            maxWidth: { xs: "none", sm: 190 },
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
      <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
        Se recorta al centro y se comprime para guardar una imagen liviana.
      </Typography>
    </Box>
  );
};
