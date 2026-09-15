import { useMemo } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";

const cards = [
  { key: "users", label: "Usuarios", icon: <PeopleIcon />, color: "primary.main" },
  { key: "pending", label: "Pendientes", icon: <PendingActionsIcon />, color: "warning.main" },
  { key: "registrations", label: "Registros de evento", icon: <EventAvailableIcon />, color: "secondary.main" },
  { key: "audit", label: "Eventos auditados", icon: <HistoryIcon />, color: "info.main" },
];

export const AdminOverview = ({ users, registrations, auditTotal }) => {
  const values = useMemo(() => ({
    users: users.length,
    pending: users.filter((user) => !user.activo).length,
    registrations: registrations.length,
    audit: auditTotal,
  }), [users, registrations, auditTotal]);

  return (
    <Grid container spacing={2.5}>
      {cards.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ height: "100%", border: "1.5px solid", borderColor: card.color, borderRadius: 0, boxShadow: "3px 3px 0 rgba(0, 180, 255, 0.22)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{values[card.key]}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
