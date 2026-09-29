import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

// ── CAMPOS DEL FORMULARIO ──
const fields = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ej: Juan Carlos",
    defaultHelperText: "Entre 2 y 60 letras.",
    maxLength: 60,
    half: true,
  },
  {
    name: "apellido",
    label: "Apellido",
    type: "text",
    required: true,
    placeholder: "Ej: Pérez",
    defaultHelperText: "Entre 2 y 60 letras.",
    maxLength: 60,
    half: true,
  },
  {
    name: "dni",
    label: "DNI / Documento",
    type: "text",
    required: true,
    placeholder: "Ej: 39123456",
    defaultHelperText: "Ingresá entre 6 y 10 números, sin puntos.",
    maxLength: 10,
    half: true,
  },
  {
    name: "edad",
    label: "Edad",
    type: "number",
    required: true,
    placeholder: "Ej: 20",
    defaultHelperText: "Edad en años (1 a 120).",
    min: 1,
    max: 120,
    half: true,
  },
  {
    name: "fechaNacimiento",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
    shrink: true,
    defaultHelperText: "Seleccioná la fecha de nacimiento.",
    half: true,
  },
  {
    name: "telefono",
    label: "Teléfono de Contacto",
    type: "text",
    required: true,
    placeholder: "Ej: 3411234567",
    defaultHelperText: "Al menos 8 números. Ejemplo: 3411234567.",
    maxLength: 15,
    half: true,
  },
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    required: true,
    placeholder: "Ej: ejemplo@gmail.com",
    defaultHelperText: "Ejemplo: ejemplo@gmail.com",
    maxLength: 100,
    half: true,
  },
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

const selectDarkStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    fontFamily: "inherit",
    backgroundColor: "rgba(3, 8, 59, 0.18)",
    "& fieldset": { borderColor: "rgba(0, 180, 255, 0.5)" },
    "&:hover fieldset": { borderColor: "#00B4FF" },
    "&.Mui-focused fieldset": { borderColor: "#00B4FF", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { color: "#00B4FF", fontFamily: "inherit" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#00B4FF" },
  "& .MuiSvgIcon-root": { color: "#00B4FF" },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    fontFamily: "inherit",
    fontSize: { xs: "0.64rem", sm: "0.68rem", md: "0.72rem" },
    lineHeight: 1.35,
    color: "rgba(255,255,255,0.6)",
  },
};

export const PreCycleRegistrationForm = ({
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

      <Grid container spacing={{ xs: 1.8, sm: 2, md: 2.2 }} sx={{ width: "100%", "--Grid-parent-columns": 12 }}>
        {fields.map((field) => {
          const fieldError = errors[field.name];
          const isError = Boolean(fieldError);

          return (
            <Grid size={{ xs: 12, sm: field.half ? 6 : 12 }} sx={{ width: "100%" }} key={field.name}>
              <TextField
                required={field.required}
                fullWidth
                type={field.type}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                error={isError}
                helperText={isError ? fieldError : field.defaultHelperText}
                inputMode={field.type === "number" || field.name === "dni" || field.name === "telefono" ? "numeric" : undefined}
                autoComplete={
                  field.name === "nombre" ? "given-name" :
                  field.name === "apellido" ? "family-name" :
                  field.name === "email" ? "email" :
                  field.name === "telefono" ? "tel" : "off"
                }
                slotProps={{
                  htmlInput: {
                    min: field.min,
                    max: field.max,
                    maxLength: field.maxLength,
                  },
                  inputLabel: field.shrink ? { shrink: true } : undefined,
                }}
                sx={fieldSx}
              />
            </Grid>
          );
        })}

        {/* Título secundario */}
        <Grid size={{ xs: 12, sm: 6 }} sx={{ width: "100%" }}>
          <FormControl
            fullWidth
            required
            error={Boolean(errors.tituloSecundario)}
            sx={selectDarkStyle}
          >
            <InputLabel id="titulo-secundario-label">
              Título secundario
            </InputLabel>
            <Select
              labelId="titulo-secundario-label"
              name="tituloSecundario"
              value={formData.tituloSecundario || "no"}
              label="Título secundario"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#03083B",
                    color: "#FFFFFF",
                    border: "1px solid #00B4FF",
                    "& .MuiMenuItem-root": {
                      fontFamily: theme.typography.fontFamily,
                      "&:hover": { bgcolor: "rgba(0, 180, 255, 0.2)" },
                      "&.Mui-selected": {
                        bgcolor: "#00B4FF",
                        color: "#03083B",
                        fontWeight: "bold",
                        "&:hover": { bgcolor: "#00B4FF" },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="si">Sí</MenuItem>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="incompleto">Incompleto</MenuItem>
            </Select>
            <FormHelperText>
              {errors.tituloSecundario || "Indicá si completaste tus estudios secundarios."}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Concurre a alguna iglesia */}
        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <FormControl fullWidth sx={{ "& .MuiFormHelperText-root": { marginLeft: 0, color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: { xs: "0.64rem", sm: "0.68rem" } } }}>
            <FormControlLabel
              control={
                <Switch
                  name="concurreAlgunaIglesias"
                  checked={formData.concurreAlgunaIglesias || false}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#00B4FF" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#00B4FF" },
                  }}
                />
              }
              label="¿Concurre a alguna iglesia?"
              sx={{ color: "#FFFFFF", fontFamily: theme.typography.fontFamily }}
            />
            <FormHelperText>
              Activá esta opción si participás actualmente en una iglesia.
            </FormHelperText>
          </FormControl>
        </Grid>

        {formData.concurreAlgunaIglesias && (
          <Grid size={{ xs: 12, sm: 6 }} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              label="¿Quién es el pastor?"
              name="nombrePastor"
              placeholder="Ej: Pastor Roberto Martínez"
              value={formData.nombrePastor || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={Boolean(errors.nombrePastor)}
              helperText={errors.nombrePastor || "Nombre y apellido del pastor."}
              slotProps={{ htmlInput: { maxLength: 120 } }}
              sx={fieldSx}
            />
          </Grid>
        )}

        {formData.concurreAlgunaIglesias && (
          <Grid size={{ xs: 12, sm: 6 }} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              label="¿A cuál iglesia concurre?"
              name="cual"
              placeholder="Ej: Iglesia Central TSM"
              value={formData.cual || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={Boolean(errors.cual)}
              helperText={errors.cual || "Nombre o congregación a la que asiste."}
              slotProps={{ htmlInput: { maxLength: 120 } }}
              sx={fieldSx}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <Typography
            align="center"
            sx={{
              color: "#FFFFFF",
              opacity: 0.65,
              fontSize: { xs: "0.62rem", sm: "0.68rem", md: "0.74rem" },
              lineHeight: 1.35,
              fontFamily: theme.typography.fontFamily,
              mt: { xs: 0, sm: 0.2 },
              px: { xs: 1, sm: 0 },
            }}
          >
            Los campos marcados con * son obligatorios.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              width: "100%",
              minHeight: { xs: 48, sm: 52, md: 54 },
              borderRadius: 0,
              fontFamily: theme.typography.button.fontFamily,
              fontSize: { xs: "0.62rem", sm: "0.7rem", md: "0.75rem" },
              letterSpacing: { xs: "0.02em", sm: "0.04em" },
              px: { xs: 1, sm: 2 },
              py: { xs: 1.2, sm: 1.4 },
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
              boxShadow: { xs: "3px 3px 0px #00B4FF", sm: "4px 4px 0px #00B4FF" },
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.3,
              mt: { xs: 0.5, sm: 0.7 },
              "&:hover": {
                background: "linear-gradient(45deg, #D500BA 20%, #FF007F 100%)",
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Confirmar pre-inscripción"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
