import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

// ================================================================
// OPCIONES DEL TEMA DE INTERÉS
// ================================================================
const TEMAS_INTERES = [
  { value: "Audio", label: "Audio" },
  { value: "Comunicacion", label: "Comunicación" },
  { value: "Diseno", label: "Diseño" },
  { value: "Informatica", label: "Informática" },
  { value: "Video", label: "Video" },
  { value: "Otro", label: "Otro" },
  { value: "Todavia no decidi", label: "Todavía no decidí" },
];

// ================================================================
// TIPOGRAFÍAS
// ================================================================
const FONT_MAIN = "'Neue Haas Grotesk', sans-serif";
const FONT_PIXEL = "'Omega Pixel BIFORM', monospace";

// ================================================================
// ESTILO GENERAL DE CAMPOS
// ================================================================
const textFieldDarkStyle = {
  width: "100%",

  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    fontFamily: FONT_MAIN,
    backgroundColor: "rgba(3, 8, 59, 0.18)",

    "& fieldset": {
      borderColor: "rgba(0, 180, 255, 0.5)",
    },

    "&:hover fieldset": {
      borderColor: "#00B4FF",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#00B4FF",
      borderWidth: "1.5px",
    },

    "&.Mui-error fieldset": {
      borderColor: "#ff4d6d",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#00B4FF",
    fontFamily: FONT_MAIN,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00B4FF",
  },

  "& .MuiInputLabel-root.Mui-error": {
    color: "#ff4d6d",
  },

  "& .MuiSvgIcon-root": {
    color: "#00B4FF",
  },

  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    fontFamily: FONT_MAIN,
    fontSize: {
      xs: "0.64rem",
      sm: "0.68rem",
      md: "0.72rem",
    },
    lineHeight: 1.35,
  },

  "& input": {
    fontFamily: FONT_MAIN,
  },
};

// ================================================================
// COMPONENTE FORMULARIO
// ================================================================
export default function InscripcionForm({
  formData,
  errors,
  loading,
  onChange,
  onBlur,
  onSubmit,
}) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: "100%" }}>
      <Grid container spacing={{ xs: 1.8, sm: 2, md: 2.2, lg: 2.4 }}>
        {/* NOMBRE */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            onBlur={onBlur}
            disabled={loading}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre || "Entre 3 y 9 letras."}
            variant="outlined"
            autoComplete="given-name"
            inputProps={{ maxLength: 9 }}
            sx={{
              ...textFieldDarkStyle,
              "& .MuiOutlinedInput-root": {
                minHeight: { xs: 52, sm: 54, md: 56 },
              },
            }}
          />
        </Grid>

        {/* APELLIDO */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={onChange}
            onBlur={onBlur}
            disabled={loading}
            error={Boolean(errors.apellido)}
            helperText={errors.apellido || "Entre 3 y 15 letras."}
            variant="outlined"
            autoComplete="family-name"
            inputProps={{ maxLength: 15 }}
            sx={{
              ...textFieldDarkStyle,
              "& .MuiOutlinedInput-root": {
                minHeight: { xs: 52, sm: 54, md: 56 },
              },
            }}
          />
        </Grid>

        {/* DNI */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={onChange}
            onBlur={onBlur}
            disabled={loading}
            error={Boolean(errors.dni)}
            helperText={errors.dni || "Ingresá entre 6 y 8 números, sin puntos."}
            variant="outlined"
            autoComplete="off"
            inputMode="numeric"
            inputProps={{ maxLength: 8 }}
            sx={{
              ...textFieldDarkStyle,
              "& .MuiOutlinedInput-root": {
                minHeight: { xs: 52, sm: 54, md: 56 },
              },
            }}
          />
        </Grid>

        {/* TELEFONO */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={onChange}
            onBlur={onBlur}
            disabled={loading}
            error={Boolean(errors.telefono)}
            helperText={errors.telefono || "Ejemplo: 3411234567"}
            variant="outlined"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            inputProps={{ maxLength: 10 }}
            sx={{
              ...textFieldDarkStyle,
              "& .MuiOutlinedInput-root": {
                minHeight: { xs: 52, sm: 54, md: 56 },
              },
            }}
          />
        </Grid>

        {/* EMAIL */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="email"
            label="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={onChange}
            onBlur={onBlur}
            disabled={loading}
            error={Boolean(errors.email)}
            helperText={errors.email || "Ejemplo: ejemplo@gmail.com"}
            variant="outlined"
            autoComplete="email"
            inputProps={{ maxLength: 100 }}
            sx={{
              ...textFieldDarkStyle,
              "& .MuiOutlinedInput-root": {
                minHeight: { xs: 52, sm: 54, md: 56 },
              },
            }}
          />
        </Grid>

        {/* TEMA DE INTERÉS */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            select
            label="Tema de interés"
            name="temas"
            value={formData.temas}
            onChange={onChange}
            onBlur={onBlur}
            disabled={loading}
            error={Boolean(errors.temas)}
            helperText={errors.temas || "Elegí el contenido que más te interesa."}
            variant="outlined"
            sx={{
              ...textFieldDarkStyle,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                width: "100%",
                minHeight: { xs: 52, sm: 54, md: 56 },
              },
              "& .MuiSelect-select": {
                fontFamily: FONT_MAIN,
                color: "#FFFFFF",
              },
            }}
          >
            {TEMAS_INTERES.map((tema) => (
              <MenuItem key={tema.value} value={tema.value} sx={{ fontFamily: FONT_MAIN }}>
                {tema.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* TEXTO INFORMATIVO */}
        <Grid item xs={12}>
          <Typography
            align="center"
            sx={{
              color: "#FFFFFF",
              opacity: 0.65,
              fontSize: { xs: "0.62rem", sm: "0.68rem", md: "0.74rem", lg: "0.76rem" },
              lineHeight: 1.35,
              fontFamily: FONT_MAIN,
              mt: { xs: 0, sm: 0.2 },
              px: { xs: 1, sm: 0 },
            }}
          >
            Los campos marcados con * son obligatorios.
          </Typography>
        </Grid>

        {/* BOTÓN DE CONFIRMACIÓN */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              minHeight: { xs: 50, sm: 52, md: 54 },
              borderRadius: 0,
              fontFamily: FONT_PIXEL,
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
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirmar inscripción"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}