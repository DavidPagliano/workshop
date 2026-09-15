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

export const PreCicloSection = ({ cycleData, metricasCiclo }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
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
          3. Preinscriptos Ciclo 2027
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
          <Table size="small" sx={{ minWidth: 500 }}>
            <TableHead sx={{ bgcolor: "rgba(0, 180, 255, 0.08)" }}>
              <TableRow>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  N° Reg
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Aspirante
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  DNI
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Secundario
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Fecha Ingreso
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cycleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    Sin aspirantes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                cycleData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    const { fecha } = formatDateTime(row.creado);
                    return (
                      <TableRow key={row.registrarId || idx} hover>
                        <TableCell>
                          <Chip
                            label={row.registrarId || "—"}
                            size="small"
                            sx={{
                              borderRadius: 0,
                              border: "1px solid #D500BA",
                              color: "secondary.main",
                              fontFamily: "'Omega Pixel BIFORM', monospace",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{`${row.nombre} ${row.apellido}`}</TableCell>
                        <TableCell>{row.dni}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.tituloSecundario}
                            size="small"
                            color={
                              row.tituloSecundario === "si"
                                ? "success"
                                : "warning"
                            }
                            sx={{ borderRadius: 0 }}
                          />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{fecha}</TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={cycleData.length}
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
            % TÍTULO SECUNDARIO
          </Typography>
          <Box sx={{ width: "100%", height: { xs: 200, sm: 240 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metricasCiclo.chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  stroke="#03083B"
                  strokeWidth={2}
                >
                  {metricasCiclo.chartData.map((entry, index) => (
                    <Cell key={`cell-cycle-${index}`} fill={entry.color} />
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
