import { Box, Grid, Typography } from "@mui/material";
import { InscriptionField } from "./InscriptionField";

/**
 * Bloque titulado de campos para TSP. Oculta los campos cuyo showIf no se cumple.
 */
export const InscriptionSection = ({ section, formData, getValue, errors, loading, onChange, onBlur }) => {
  const visibleFields = section.fields.filter((field) => !field.showIf || field.showIf(formData));

  return (
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, mb: { xs: 3, sm: 3.5 }, minWidth: 0 }}>
      <Typography
        component="legend"
        variant="h6"
        sx={{
          width: "100%",
          color: "primary.main",
          fontSize: { xs: "0.95rem", sm: "1.05rem" },
          pb: 1,
          mb: 2,
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        {section.title}
      </Typography>

      <Grid container columnSpacing={{ xs: 1.8, sm: 2 }} rowSpacing={{ xs: 0.6, sm: 0.8 }}>
        {visibleFields.map((field) => (
          <Grid key={field.name} size={{ xs: 12, sm: field.half ? 6 : 12 }}>
            <InscriptionField
              field={field}
              value={getValue(field.name)}
              error={errors[field.name]}
              disabled={loading}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

