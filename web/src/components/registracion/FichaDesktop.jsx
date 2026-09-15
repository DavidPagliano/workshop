import { Typography, Card, CardContent, Paper, Grid } from "@mui/material";
import FichaUsuario from "./FichaUsuario";

const FichaDesktop = ({ usuarioSeleccionado, onConfirmar }) => {
  return (
    <Grid size={{ xs: 12, md: 7 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Ficha del Inscripto
      </Typography>

      {usuarioSeleccionado ? (
        <Card
          variant="outlined"
          sx={{
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
            borderRadius: 0,
            bgcolor: "background.paper",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <FichaUsuario
              usuario={usuarioSeleccionado}
              onConfirmar={onConfirmar}
            />
          </CardContent>
        </Card>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            textAlign: "center",
            border: "1.5px solid",
            borderColor: "divider",
            borderRadius: 0,
            bgcolor: "#071052",
          }}
        >
          <Typography color="text.secondary">
            Hacé clic en un participante de la lista para desplegar su ficha de
            datos y confirmar su asistencia.
          </Typography>
        </Paper>
      )}
    </Grid>
  );
};

export default FichaDesktop;
