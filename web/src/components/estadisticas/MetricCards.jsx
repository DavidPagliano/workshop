import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SchoolIcon from "@mui/icons-material/School";

export const MetricCards = ({ metricasAsistencia, metricasCiclo }) => {
  const cards = [
    {
      icon: <EventAvailableIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: "primary.main" }} />,
      value: metricasAsistencia.total,
      label: "Inscriptos al Evento",
      borderColor: "primary.main",
      shadow: "4px 4px 0px rgba(0, 180, 255, 0.4)",
    },
    {
      icon: <HowToRegIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: "secondary.main" }} />,
      value: `${metricasAsistencia.porcentaje}%`,
      valueColor: "secondary.main",
      label: `Acreditados (${metricasAsistencia.presentes} presentes)`,
      borderColor: "secondary.main",
      shadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
    },
    {
      icon: <SchoolIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: "primary.main" }} />,
      value: metricasCiclo.total,
      label: "Postulantes Ciclo 2027",
      borderColor: "primary.main",
      shadow: "4px 4px 0px rgba(0, 180, 255, 0.4)",
    },
  ];

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
      {cards.map((card, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 4 }}>
          <Card
            variant="outlined"
            sx={{
              border: "1.5px solid",
              borderColor: card.borderColor,
              boxShadow: card.shadow,
              borderRadius: 0,
              bgcolor: "background.paper",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                py: { xs: 1.5, sm: 2 },
                "&:last-child": { pb: { xs: 1.5, sm: 2 } },
              }}
            >
              {card.icon}
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    color: card.valueColor || "text.primary",
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {card.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
