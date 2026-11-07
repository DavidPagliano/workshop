import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { MEDICAL_SECTIONS, PERSONAL_SECTIONS } from "../../config/inscriptionFields";

const formatFieldValue = (field, rawValue) => {
  if (field.kind === "switch") {
    return rawValue ? "Sí" : "No";
  }

  const value = String(rawValue ?? "").trim();
  if (!value) return "—";

  if (field.kind === "date") {
    const [year, month, day] = value.split("-");
    if (year && month && day) return `${day}/${month}/${year}`;
    return value;
  }

  if (field.kind === "select" && field.options) {
    const match = field.options.find((opt) => opt.value === value);
    return match ? match.label : value;
  }

  return value;
};

const ReviewBlock = ({ title, stepIndex, sections, formData, getValue, onEditStep }) => (
  <Box
    sx={(theme) => ({
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      bgcolor: alpha(theme.palette.primary.main, 0.015),
      p: { xs: 2, sm: 2.5 },
      mb: 2.5,
    })}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        mb: 1.5,
      }}
    >
      <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
        {title}
      </Typography>
      <Button
        size="small"
        variant="text"
        color="secondary"
        startIcon={<EditOutlinedIcon fontSize="small" />}
        onClick={() => onEditStep(stepIndex)}
      >
        Editar
      </Button>
    </Box>

    {sections.map((section, idx) => {
      const visibleFields = section.fields.filter((f) => !f.showIf || f.showIf(formData));
      return (
        <Box key={section.title}>
          {idx > 0 && <Divider sx={{ my: 2 }} />}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "secondary.main",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 1.25,
            }}
          >
            {section.title}
          </Typography>
          <Grid container spacing={1.5}>
            {visibleFields.map((field) => (
              <Grid key={field.name} size={{ xs: 12, sm: field.half ? 6 : 12 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", lineHeight: 1.2 }}
                >
                  {field.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 600, wordBreak: "break-word" }}
                >
                  {formatFieldValue(field, getValue(field.name))}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    })}
  </Box>
);

/**
 * Paso 4: revisión final de todos los datos antes de confirmar la inscripción.
 */
export const InscriptionReviewStep = ({ formData, getValue, onEditStep }) => (
  <Box>
    <Alert severity="info" sx={{ mb: 3 }}>
      Revisá que todos tus datos estén correctos antes de confirmar la inscripción.
      Si necesitás corregir algo, podés tocar <strong>Editar</strong> en la sección correspondiente.
    </Alert>

    {/* Bloque Foto */}
    <Box
      sx={(theme) => ({
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.015),
        p: { xs: 2, sm: 2.5 },
        mb: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={formData.foto || undefined}
          alt="Foto del inscripto"
          sx={{
            width: { xs: 64, sm: 76 },
            height: { xs: 64, sm: 76 },
            border: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
            Foto del inscripto
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            { `${getValue("nombre") || ""} ${getValue("apellido") || ""}`.trim() || "Foto capturada" }
          </Typography>
        </Box>
      </Box>

      <Button
        size="small"
        variant="text"
        color="secondary"
        startIcon={<EditOutlinedIcon fontSize="small" />}
        onClick={() => onEditStep(0)}
      >
        Editar
      </Button>
    </Box>

    {/* Bloque Datos principales */}
    <ReviewBlock
      title="Datos principales"
      stepIndex={1}
      sections={PERSONAL_SECTIONS}
      formData={formData}
      getValue={getValue}
      onEditStep={onEditStep}
    />

    {/* Bloque Ficha médica */}
    <ReviewBlock
      title="Ficha médica"
      stepIndex={2}
      sections={MEDICAL_SECTIONS}
      formData={formData}
      getValue={getValue}
      onEditStep={onEditStep}
    />
  </Box>
);

