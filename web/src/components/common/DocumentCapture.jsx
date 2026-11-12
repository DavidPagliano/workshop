import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import BadgeIcon from "@mui/icons-material/Badge";

const MAX_IMAGE_DIM = 1600;
const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });

const compressImage = async (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_IMAGE_DIM || height > MAX_IMAGE_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_IMAGE_DIM) / width);
          width = MAX_IMAGE_DIM;
        } else {
          width = Math.round((width * MAX_IMAGE_DIM) / height);
          height = MAX_IMAGE_DIM;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("El archivo no es una imagen válida."));
    img.src = dataUrl;
  });
};

export const DocumentCapture = ({
  value = "",
  fileName = "",
  onChange,
  disabled = false,
  label = "Documento",
  helperText = "",
  accept = "image/*",
  allowPdf = false,
  aspectRatio = "1.58 / 1",
  icon: CustomIcon,
}) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const isPdf =
    Boolean(value) &&
    (value.startsWith("data:application/pdf") || (fileName && fileName.toLowerCase().endsWith(".pdf")));

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

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este dispositivo o navegador no permite acceder a la cámara.");
      return;
    }
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setError("No se pudo acceder a la cámara. Verificá los permisos del navegador.");
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setProcessing(true);
    setError("");
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      stopCamera();
      onChange(dataUrl, "captura-camara.jpg");
    } catch {
      setError("No se pudo capturar la foto.");
    } finally {
      setProcessing(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const fileType = file.type || "";
    const isImageFile = fileType.startsWith("image/");
    const isPdfFile = fileType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isImageFile && !(allowPdf && isPdfFile)) {
      setError(
        allowPdf
          ? "Seleccioná un archivo de imagen (JPG, PNG) o documento PDF."
          : "Seleccioná un archivo de imagen válido (JPG, PNG)."
      );
      return;
    }

    if (file.size > (isPdfFile ? MAX_PDF_SIZE_BYTES : 12 * 1024 * 1024)) {
      setError(`El archivo es demasiado grande (máximo ${isPdfFile ? "5 MB" : "12 MB"}).`);
      return;
    }

    setProcessing(true);
    setError("");
    try {
      const rawData = await fileToDataUrl(file);
      if (isPdfFile) {
        onChange(rawData, file.name);
      } else {
        const compressed = await compressImage(rawData);
        onChange(compressed, file.name);
      }
    } catch (err) {
      setError(err.message || "Error al procesar el archivo.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        p: { xs: 2, sm: 2.5 },
        width: "100%",
        boxSizing: "border-box",
        border: "1.5px dashed",
        borderColor: value ? "success.main" : "primary.main",
        borderRadius: 2,
        bgcolor: value
          ? alpha(theme.palette.success.main, 0.03)
          : alpha(theme.palette.primary.main, 0.03),
        transition: "all 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
        {CustomIcon ? <CustomIcon color="primary" /> : <BadgeIcon color="primary" />}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
          {label}
        </Typography>
        {Boolean(value) && (
          <CheckCircleIcon sx={{ color: "success.main", fontSize: 18 }} />
        )}
      </Box>

      {helperText && (
        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", mb: 1.5, display: "block" }}>
          {helperText}
        </Typography>
      )}

      {/* Previsualización */}
      {Boolean(value) && !cameraOpen && (
        <Box sx={{ width: "100%", maxWidth: 360, mb: 2, mt: 0.5 }}>
          {isPdf ? (
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <PictureAsPdfIcon sx={{ color: "error.main", fontSize: 36 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-all" }}>
                  {fileName || "Comprobante_Pago.pdf"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Documento PDF adjunto
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio,
                borderRadius: 1.5,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={value}
                alt={label}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Visor de cámara en vivo */}
      {cameraOpen && (
        <Box sx={{ width: "100%", maxWidth: 400, mb: 2 }}>
          <Box
            component="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            sx={{
              width: "100%",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 1.5,
              bgcolor: "#000",
              display: "block",
            }}
          />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 1.5, textAlign: "left" }}>
          {error}
        </Alert>
      )}

      {/* Botones de acción */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: "100%",
          maxWidth: 360,
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {cameraOpen ? (
          <>
            <Button
              variant="contained"
              color="secondary"
              disabled={disabled || processing}
              onClick={capturePhoto}
              startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <CameraAltIcon />}
              sx={{ flex: 1, minWidth: 120 }}
            >
              Tomar foto
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={processing}
              onClick={stopCamera}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              component="label"
              variant={value ? "outlined" : "contained"}
              color="primary"
              disabled={disabled || processing}
              startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <UploadFileIcon />}
              sx={{ flex: 1, minWidth: 130 }}
            >
              {value ? "Cambiar archivo" : allowPdf ? "Subir foto o PDF" : "Subir foto"}
              <input
                hidden
                type="file"
                accept={accept}
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="outlined"
              color="primary"
              disabled={disabled || processing}
              startIcon={<CameraAltIcon />}
              onClick={openCamera}
              sx={{ flex: 1, minWidth: 120 }}
            >
              Cámara
            </Button>

            {Boolean(value) && !processing && (
              <Button
                color="error"
                variant="text"
                startIcon={<DeleteIcon />}
                onClick={() => onChange("", "")}
              >
                Quitar
              </Button>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

