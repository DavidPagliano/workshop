import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const topics = [
  { value: "AI", label: "Inteligencia Artificial" },
  { value: "Audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "sin temas", label: "Todavía no decidí" },
];

export const EventRegistrationForm = ({
  formData,
  error,
  loading,
  handleChange,
  onSubmit,
}) => (
  <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
    {error && (
      <Alert severity="error" sx={{ borderRadius: 0 }}>
        {error}
      </Alert>
    )}

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.25 }}>
      <TextField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        inputProps={{ minLength: 2, maxLength: 60 }}
        autoComplete="given-name"
      />
      <TextField
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
        inputProps={{ minLength: 2, maxLength: 60 }}
        autoComplete="family-name"
      />
    </Box>

    <TextField
      label="DNI o pasaporte"
      name="dni"
      value={formData.dni}
      onChange={handleChange}
      required
      inputProps={{ minLength: 6, maxLength: 30 }}
      helperText="Usaremos este dato para acreditar tu ingreso."
      autoComplete="off"
    />

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.25 }}>
      <TextField
        label="Teléfono"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        required
        inputProps={{ minLength: 8, maxLength: 25 }}
        autoComplete="tel"
      />
      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        inputProps={{ maxLength: 254 }}
        autoComplete="email"
      />
    </Box>

    <FormControl required>
      <InputLabel id="event-topic-label">Tema de interés</InputLabel>
      <Select
        labelId="event-topic-label"
        name="temas"
        value={formData.temas}
        label="Tema de interés"
        onChange={handleChange}
      >
        {topics.map((topic) => (
          <MenuItem key={topic.value} value={topic.value}>
            {topic.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Elegí el contenido que más te interesa.</FormHelperText>
    </FormControl>

    <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1, py: 1.5 }}>
      {loading ? <CircularProgress color="inherit" size={22} /> : "Confirmar inscripción"}
    </Button>
  </Box>
);
