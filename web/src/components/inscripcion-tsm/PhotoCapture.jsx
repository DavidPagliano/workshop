import { useEffect, useRef, useState } from "react";
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

const MAX_BASE64_LENGTH = 200000;
const MAX_IMAGE_SIZE = 400;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });

const loadImage = (source) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("El archivo no es una imagen válida."));
    image.src = source;
  });

const compressImage = async (source) => {
  const image = await loadImage(source);
  const canvas = document.createElement("canvas");
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  const offsetX = (image.naturalWidth - size) / 2;
  const offsetY = (image.naturalHeight - size) / 2;
  const qualities = [0.7, 0.6, 0.5, 0.4];
  const sizes = [MAX_IMAGE_SIZE, 360, 320];

  for (const targetSize of sizes) {
    canvas.width = targetSize;
    canvas.height = targetSize;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, targetSize, targetSize);
    context.drawImage(image, offsetX, offsetY, size, size, 0, 0, targetSize, targetSize);

    for (const quality of qualities) {
      const result = canvas.toDataURL("image/jpeg", quality);
      if (result.length <= MAX_BASE64_LENGTH) return result;
    }
  }

  throw new Error("La imagen no se pudo comprimir por debajo de 200 KB.");
};

export const PhotoCapture = ({ value = "", onChange, disabled = false }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Seleccioná un archivo de imagen válido.");
      return;
    }

    setProcessing(true);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(await compressImage(dataUrl));
    } catch (captureError) {
      setError(captureError.message || "No se pudo procesar la imagen.");
    } finally {
      setProcessing(false);
    }
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no permite acceder a la cámara.");
      return;
    }

    setError("");
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraOpen(true);
    } catch {
      setError("No se pudo acceder a la cámara. Revisá los permisos del navegador.");
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setProcessing(true);
    setError("");
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      onChange(await compressImage(canvas.toDataURL("image/jpeg", 0.9)));
      stopCamera();
    } catch (captureError) {
      setError(captureError.message || "No se pudo capturar la foto.");
    } finally {
      setProcessing(false);
    }
  };

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
