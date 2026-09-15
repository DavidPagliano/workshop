import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Fade,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const sections = [
  {
    title: "Pre-inscripción",
    description: "Gestión de pre-inscripciones al Ciclo 2027. Agregar, editar y eliminar registros.",
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/pre-ciclo",
    color: "primary.main",
  },
  {
    title: "Asistencia",
    description: "Mesa de entrada y control de asistencia al evento. Buscar inscriptos y confirmar presencia.",
    icon: <HowToRegIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/asistencia",
    color: "primary.main",
  },
  {
    title: "Estadísticas",
    description: "Métricas y reportes del evento. Inscripciones, asistencia y participación.",
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/estadisticas",
    color: "secondary.main",
  },
  {
    title: "Administración",
    description: "Panel de administración. Gestión de usuarios, configuración y permisos.",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />,
    path: "/dashboard/admin",
    color: "secondary.main",
  },
];

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "calc(100vh - 64px)",
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Fade in timeout={500}>
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: 700, mb: 0.5 }}
          >
            Panel de Gestión
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Bienvenido al panel interno. Seleccioná una sección para comenzar.
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {sections.map((section, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={section.path}>
            <Fade
              in
              timeout={600}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <Card
                sx={{
                  border: "1.5px solid",
                  borderColor: section.color,
                  boxShadow:
                    section.color === "primary.main"
                      ? "4px 4px 0px rgba(213, 0, 186, 0.5)"
                      : "4px 4px 0px rgba(0, 180, 255, 0.4)",
                  borderRadius: 0,
                  bgcolor: "background.paper",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    transform: "translate(-2px, -2px)",
                    boxShadow:
                      section.color === "primary.main"
                        ? "6px 6px 0px rgba(213, 0, 186, 0.6)"
                        : "6px 6px 0px rgba(0, 180, 255, 0.5)",
                  },
                }}
              >
                <CardActionArea onClick={() => navigate(section.path)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ color: section.color }}>{section.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                      >
                        {section.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {section.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardHome;
