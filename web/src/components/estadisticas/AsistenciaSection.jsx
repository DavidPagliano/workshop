import { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CustomChartTooltip } from "./CustomChartTooltip";
import { formatDateTime } from "../../utils/estadisticasUtils";

export const AsistenciaSection = ({ eventData, metricasAsistencia }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 5 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 1.5,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          1. Inscripciones al Evento (Fecha y Hora)
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.4)",
            borderRadius: 0,
            bgcolor: "background.paper",
            overflowX: "auto",
          }}
        >
          <Table size="small" sx={{ minWidth: 580 }}>
            <TableHead sx={{ bgcolor: "rgba(0, 180, 255, 0.08)" }}>
              <TableRow>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  N° Reg
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Participante
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  DNI
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Tema
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Fecha
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Hora
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Estado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    Sin inscripciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                eventData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, idx) => {
                    const { fecha, hora } = formatDateTime(item.creado);
                    return (
                      <TableRow key={item.registrarId || idx} hover>
                        <TableCell>
                          <Chip
                            label={item.registrarId || "—"}
                            size="small"
                            sx={{
                              borderRadius: 0,
                              border: "1px solid #00B4FF",
                              color: "primary.main",
                              fontFamily: "'Omega Pixel BIFORM', monospace",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{`${item.nombre} ${item.apellido}`}</TableCell>
                        <TableCell>{item.dni}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.temas}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ borderRadius: 0 }}
                          />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{fecha}</TableCell>
                        <TableCell>{hora}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.seRegistro ? "Presente" : "Ausente"}
                            color={item.seRegistro ? "success" : "default"}
                            size="small"
                            sx={{ borderRadius: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={eventData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              },
            }}
          />
        </TableContainer>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            border: "1.5px solid",
            borderColor: "secondary.main",
            boxShadow: "4px 4px 0px rgba(0, 180, 255, 0.4)",
            borderRadius: 0,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "secondary.main", mb: 1, fontSize: { xs: "0.85rem", sm: "1rem" } }}
          >
            % ACREDITACIÓN EN VIVO
          </Typography>
          <Box sx={{ width: "100%", height: { xs: 200, sm: 240 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metricasAsistencia.chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  stroke="#03083B"
                  strokeWidth={2}
                >
                  {metricasAsistencia.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomChartTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
