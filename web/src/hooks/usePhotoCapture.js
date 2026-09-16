import { useEffect, useRef, useState } from "react";

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

export const usePhotoCapture = ({ value, onChange }) => {
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

  return {
    cameraOpen,
    capturePhoto,
    error,
    handleFileChange,
    openCamera,
    processing,
    stopCamera,
    videoRef,
    hasPhoto: Boolean(value),
  };
};
