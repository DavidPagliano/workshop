import { Box, Typography } from "@mui/material";
import { PhotoCapture } from "../common/PhotoCapture";

/**
 * Paso 1: el candidato se saca la foto con la cámara en el momento (obligatoria) para TSP.
 */
export const InscriptionPhotoStep = ({ foto, loading, onPhotoChange }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        textAlign: "center",
        maxWidth: 460,
      }}
    >
      Sacate una foto de frente, con buena luz y sin accesorios que cubran tu rostro.
      La foto es obligatoria para continuar con la inscripción.
    </Typography>

    <Box sx={{ width: "100%", maxWidth: 420 }}>
      <PhotoCapture
        value={foto}
        onChange={onPhotoChange}
        disabled={loading}
        allowUpload={false}
        label="Foto del inscripto *"
      />
    </Box>
  </Box>
);

