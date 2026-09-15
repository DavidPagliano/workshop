import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";

const links = [
  { label: "Pre-inscripciones", description: "Consultar y editar aspirantes del ciclo 2027.", path: "/dashboard/pre-ciclo", icon: <AssignmentIcon /> },
  { label: "Asistencia", description: "Buscar inscriptos y actualizar acreditaciones.", path: "/dashboard/asistencia", icon: <HowToRegIcon /> },
  { label: "Estadísticas", description: "Revisar métricas y exportar reportes.", path: "/dashboard/estadisticas", icon: <BarChartIcon /> },
];

export const AdminQuickLinks = () => {
  const navigate = useNavigate();
  return <Grid container spacing={2}>
    {links.map((link) => <Grid key={link.path} size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: "100%", border: "1px solid", borderColor: "divider", borderRadius: 0 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ color: "primary.main", mb: 1 }}>{link.icon}</Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{link.label}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mt: 0.5, mb: 2 }}>{link.description}</Typography>
          <Button variant="outlined" onClick={() => navigate(link.path)}>Abrir sección</Button>
        </CardContent>
      </Card>
    </Grid>)}
  </Grid>;
};
