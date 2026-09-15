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
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales inválidas");
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
          border: "1.5px solid #00B4FF",
          boxShadow: "6px 6px 0px #D500BA",
          borderRadius: 0,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}
        >
          INICIAR SESIÓN
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Acceso al Panel de Gestión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
            {error}
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
            color="primary"
            disabled={loading}
            sx={{
              py: 1.2,
              mt: 1,
              fontFamily: "'Omega Pixel BIFORM', monospace",
            }}
          >
            {loading ? "INGRESANDO..." : "ENTRAR"}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/registro-usuario")}
            sx={{ color: "text.secondary", fontSize: "0.8rem" }}
          >
            Solicitar cuenta de operador
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
