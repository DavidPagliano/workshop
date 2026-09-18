import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

// ── LISTADO DE TEMAS ACTUALIZADO ──
const topics = [
  { value: "Fotografía", label: "Fotografía" },
  { value: "Marketing Digital", label: "Marketing Digital" },
  { value: "Diseño", label: "Diseño" },
  { value: "Conexión satelital", label: "Conexión satelital" },
  { value: "Iluminación", label: "Iluminación" },
  { value: "Diseño web", label: "Diseño web" },
  { value: "Animación con IA", label: "Animación con IA" },
  { value: "Otros", label: "Otros" },
  { value: "sin temas", label: "Todavía no decidí" },
];

const textFieldDarkStyle = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    fontFamily: "inherit",
    backgroundColor: "rgba(3, 8, 59, 0.18)",
    "& fieldset": { borderColor: "rgba(0, 180, 255, 0.5)" },
    "&:hover fieldset": { borderColor: "#00B4FF" },
    "&.Mui-focused fieldset": { borderColor: "#00B4FF", borderWidth: "1.5px" },
    "&.Mui-error fieldset": { borderColor: "#ff4d6d" },
  },
  "& .MuiInputLabel-root": { color: "#00B4FF", fontFamily: "inherit" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#00B4FF" },
  "& .MuiInputLabel-root.Mui-error": { color: "#ff4d6d" },
  "& .MuiSvgIcon-root": { color: "#00B4FF" },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    fontFamily: "inherit",
    fontSize: { xs: "0.64rem", sm: "0.68rem", md: "0.72rem" },
    lineHeight: 1.35,
  },
  "& input": { fontFamily: "inherit" },
};

const fieldSx = {
  ...textFieldDarkStyle,
  "& .MuiOutlinedInput-root": {
    ...textFieldDarkStyle["& .MuiOutlinedInput-root"],
    minHeight: { xs: 52, sm: 54, md: 56 },
  },
};

export const EventRegistrationForm = ({
  formData = {},
  error,
  errors = {},
  loading,
  handleChange,
  handleBlur,
  onSubmit,
}) => {
  const theme = useTheme();

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 0, fontFamily: theme.typography.fontFamily }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={{ xs: 1.8, sm: 2, md: 2.2, lg: 2.4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre || "Entre 3 y 9 letras."}
            slotProps={{ htmlInput: { maxLength: 9 } }}
            autoComplete="given-name"
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            name="apellido"
            value={formData.apellido || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            error={Boolean(errors.apellido)}
            helperText={errors.apellido || "Entre 3 y 15 letras."}
            slotProps={{ htmlInput: { maxLength: 15 } }}
            autoComplete="family-name"
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="DNI"
            name="dni"
            value={formData.dni || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            error={Boolean(errors.dni)}
            helperText={errors.dni || "Ingresá entre 6 y 8 números, sin puntos."}
            inputMode="numeric"
            slotProps={{ htmlInput: { maxLength: 8 } }}
            autoComplete="off"
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            error={Boolean(errors.telefono)}
            helperText={errors.telefono || "Ingresá 10 números. Ejemplo: 3411234567."}
            inputMode="numeric"
            slotProps={{ htmlInput: { maxLength: 10 } }}
            autoComplete="tel"
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="email"
            label="Correo electrónico"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            error={Boolean(errors.email)}
            helperText={errors.email || "Ejemplo: ejemplo@gmail.com"}
            slotProps={{ htmlInput: { maxLength: 100 } }}
            autoComplete="email"
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Tema de interés"
            name="temas"
            value={formData.temas || ""}
            onChange={handleChange}
            disabled={loading}
            error={Boolean(errors.temas)}
            helperText={errors.temas || "Elegí el contenido que más te interesa."}
            sx={{
              ...fieldSx,
              "& .MuiSelect-select": {
                fontFamily: theme.typography.fontFamily,
                color: "#FFFFFF",
              },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: "#03083B",
                    color: "#FFFFFF",
                    border: "1px solid #00B4FF",
                    "& .MuiMenuItem-root": {
                      fontFamily: theme.typography.fontFamily,
                      "&:hover": {
                        bgcolor: "rgba(0, 180, 255, 0.2)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#00B4FF",
                        color: "#03083B",
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: "#00B4FF",
                        },
                      },
                    },
                  },
                },
              },
            }}
          >
            {topics.map((topic) => (
              <MenuItem key={topic.value} value={topic.value}>
                {topic.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Typography
            align="center"
            sx={{
              color: "#FFFFFF",
              opacity: 0.65,
              fontSize: { xs: "0.62rem", sm: "0.68rem", md: "0.74rem", lg: "0.76rem" },
              lineHeight: 1.35,
              fontFamily: theme.typography.fontFamily,
              mt: { xs: 0, sm: 0.2 },
              px: { xs: 1, sm: 0 },
            }}
          >
            Los campos marcados con * son obligatorios.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              minHeight: { xs: 50, sm: 52, md: 54 },
              borderRadius: 0,
              fontFamily: theme.typography.button.fontFamily,
              fontSize: { xs: "0.52rem", sm: "0.6rem", md: "0.66rem", lg: "0.7rem" },
              px: { xs: 1, sm: 1.5, md: 2 },
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
              boxShadow: { xs: "3px 3px 0px #00B4FF", sm: "4px 4px 0px #00B4FF" },
              whiteSpace: "nowrap",
              mt: { xs: 0.5, sm: 0.7 },
              "&:hover": {
                background: "linear-gradient(45deg, #D500BA 20%, #FF007F 100%)",
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Confirmar inscripción"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};