// src/components/registracion/ListaInscriptos.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  Grid,
} from "@mui/material";

const ListaInscriptos = ({
  participantesFiltrados,
  usuarioSeleccionado,
  onSeleccionar,
}) => {
  return (
    <Grid size={{ xs: 12, md: 5 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Inscriptos ({participantesFiltrados.length})
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          maxHeight: { xs: "calc(100vh - 320px)", md: 480 },
          overflow: "auto",
          border: "1.5px solid",
          borderColor: "primary.main",
          boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
          borderRadius: 0,
          bgcolor: "background.paper",
        }}
      >
        <List disablePadding>
          {participantesFiltrados.length > 0 ? (
            participantesFiltrados.map((p) => {
              const key = p._id || p.registrarId;
              const estaSeleccionado =
                usuarioSeleccionado?._id === key ||
                usuarioSeleccionado?.registrarId === key;

              return (
                <React.Fragment key={key}>
                  <ListItemButton
                    selected={estaSeleccionado}
                    onClick={() => onSeleccionar(p)}
                    sx={{
                      py: 1.5,
                      "&.Mui-selected": {
                        bgcolor: "rgba(0, 180, 255, 0.1)",
                        borderLeft: "3px solid",
                        borderColor: "primary.main",
                      },
                      "&:hover": {
                        bgcolor: "rgba(0, 180, 255, 0.05)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={`${p.nombre} ${p.apellido}`}
                      secondary={`DNI: ${p.dni}`}
                      slotProps={{
                        primary: { sx: { fontWeight: 500 } },
                        secondary: { sx: { color: "text.secondary" } },
                      }}
                    />
                    <Chip
                      label={p.seRegistro ? "Presente" : "Pendiente"}
                      color={p.seRegistro ? "success" : "default"}
                      size="small"
                      sx={{ borderRadius: 0 }}
                    />
                  </ListItemButton>
                  <Divider sx={{ borderColor: "divider" }} />
                </React.Fragment>
              );
            })
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron personas con ese criterio.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Grid>
  );
};

export default ListaInscriptos;
