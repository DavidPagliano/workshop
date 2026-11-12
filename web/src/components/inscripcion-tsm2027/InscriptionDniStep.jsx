import { Box, Grid, Typography } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import { DocumentCapture } from "../common/DocumentCapture";

/**
 * Paso 3: Foto del DNI (Frente y Dorso).
 */
export const InscriptionDniStep = ({
  dniFrente,
  dniDorso,
  loading,
  onDniChange,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        textAlign: "center",
        maxWidth: 580,
        mx: "auto",
      }}
    >
      Adjuntá una foto clara del <strong>frente</strong> y del <strong>dorso</strong> de tu DNI.
      Asegurate de que los datos, el número de documento y la foto sean perfectamente legibles y sin reflejos.
    </Typography>

    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6}>
        <DocumentCapture
          value={dniFrente}
          onChange={(val) => onDniChange("dniFrente", val)}
          disabled={loading}
          label="DNI — Frente *"
          helperText="Foto de la parte delantera del documento."
          icon={BadgeIcon}
          aspectRatio="1.58 / 1"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DocumentCapture
          value={dniDorso}
          onChange={(val) => onDniChange("dniDorso", val)}
          disabled={loading}
          label="DNI — Dorso *"
          helperText="Foto de la parte trasera del documento."
          icon={BadgeIcon}
          aspectRatio="1.58 / 1"
        />
      </Grid>
    </Grid>
  </Box>
);

