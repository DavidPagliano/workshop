import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });
    setLoading(true);
    try {
      await api.post("/workshop/auth/register", form);
      setMensaje({
        tipo: "success",
        texto:
          "Solicitud enviada correctamente. El administrador debe activar tu cuenta.",
      });
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg =
        errorData?.errors?.[0]?.message ||
        errorData?.message ||
        "Error al procesar el registro.";
      setMensaje({
        tipo: "error",
        texto: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 0 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          border: "1.5px solid #D500BA",
          boxShadow: "6px 6px 0px #00B4FF",
          borderRadius: 0,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "secondary.main",
            fontWeight: 800,
            mb: 1,
            textAlign: "center",
          }}
        >
          SOLICITAR ACCESO
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Registro de personal para el evento
        </Typography>

        {mensaje.texto && (
          <Alert severity={mensaje.tipo} sx={{ mb: 2, borderRadius: 0 }}>
            {mensaje.texto}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Correo Institucional"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
            sx={{
              py: 1.2,
              mt: 1,
              fontFamily: "'Omega Pixel BIFORM', monospace",
            }}
          >
            {loading ? "ENVIANDO..." : "REGISTRARME"}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ color: "text.secondary", fontSize: "0.8rem" }}
          >
            Ya tengo cuenta (Iniciar Sesión)
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
