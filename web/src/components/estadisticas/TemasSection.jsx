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
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { CustomChartTooltip } from "./CustomChartTooltip";

export const TemasSection = ({ metricasTemas }) => {
  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 5 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "secondary.main",
            mb: 1.5,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          2. Distribución de Temas Elegidos
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            border: "1.5px solid",
            borderColor: "secondary.main",
            boxShadow: "4px 4px 0px rgba(0, 180, 255, 0.4)",
            borderRadius: 0,
            bgcolor: "background.paper",
            overflowX: "auto",
          }}
        >
          <Table size="small" sx={{ minWidth: 320 }}>
            <TableHead sx={{ bgcolor: "rgba(213, 0, 186, 0.08)" }}>
              <TableRow>
                <TableCell sx={{ color: "secondary.main", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Tema Seleccionado
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "secondary.main", fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  Participantes
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "secondary.main", fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  Porcentaje
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metricasTemas.tableData.map((row) => (
                <TableRow key={row.tema} hover>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {row.tema.toUpperCase()}
                  </TableCell>
                  <TableCell align="right">{row.cantidad}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${row.porcentaje}%`}
                      size="small"
                      sx={{
                        borderRadius: 0,
                        bgcolor: "rgba(213, 0, 186, 0.15)",
                        color: "secondary.main",
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            border: "1.5px solid",
            borderColor: "primary.main",
            boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.4)",
            borderRadius: 0,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "primary.main", mb: 1, fontSize: { xs: "0.85rem", sm: "1rem" } }}
          >
            VOLUMEN POR TEMA
          </Typography>
          <Box sx={{ width: "100%", height: { xs: 180, sm: 220 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricasTemas.chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#FFFFFF"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis stroke="#FFFFFF" fontSize={11} width={30} />
                <RechartsTooltip content={<CustomChartTooltip />} />
                <Bar dataKey="value" fill="#00B4FF" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
