import { Box, Typography, Chip, Divider, Button } from "@mui/material";

const FichaUsuario = ({ usuario, onConfirmar }) => {
  if (!usuario) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
          mb: 2.5,
        }}
      >
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
          {usuario.nombre} {usuario.apellido}
        </Typography>
        <Chip
          label={
            usuario.seRegistro
              ? "ASISTENCIA CONFIRMADA"
              : "PENDIENTE DE ACREDITACIÓN"
          }
          color={usuario.seRegistro ? "success" : "warning"}
          size="small"
          sx={{ borderRadius: 0 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[
          { label: "DNI", value: usuario.dni },
          { label: "Email", value: usuario.email },
          { label: "Celular", value: usuario.celular || "No especificado" },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              px: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {item.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}
        >
          Temas de Interés
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {usuario.temasInteres && usuario.temasInteres.length > 0 ? (
            usuario.temasInteres.map((tema, idx) => (
              <Chip
                key={idx}
                label={tema}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ borderRadius: 0 }}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">
              Sin temas registrados
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5, borderColor: "divider" }} />

      <Button
        fullWidth
        size="large"
        variant="contained"
        color={usuario.seRegistro ? "secondary" : "primary"}
        onClick={() =>
          onConfirmar(usuario.registrarId || usuario._id , usuario.seRegistro)
        }
        sx={{ py: 1.5, fontWeight: 700 }}
      >
        {usuario.seRegistro ? "ANULAR ASISTENCIA" : "✔ CONFIRMAR ASISTENCIA"}
      </Button>
    </Box>
  );
};

export default FichaUsuario;
