import { useEffect, useState } from "react";
import {
  Box, CircularProgress, IconButton, InputAdornment, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { getAuditLogs } from "../../services/adminService";

const formatDate = (value) => value ? new Date(value).toLocaleString("es-AR") : "—";

export const AuditLog = ({ onTotalChange }) => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (page = pagination.page, limit = pagination.limit, query = search) => {
    setLoading(true);
    try {
      const result = await getAuditLogs({ page: page + 1, limit, search: query });
      setLogs(Array.isArray(result.data) ? result.data : []);
      const total = result.pagination?.total || 0;
      setPagination({ page: (result.pagination?.page || 1) - 1, limit, total });
      onTotalChange(total);
    } finally {
      setLoading(false);
    }
  };

  // La carga inicial sincroniza datos externos después del montaje.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(0, 10, ""); }, []);

  const handleSearch = (event) => {
    if (event.key === "Enter") load(0, pagination.limit, search);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Box><Typography variant="h6" sx={{ fontWeight: 700 }}>Historial de auditoría</Typography><Typography variant="body2" color="text.secondary">Actividad reciente de usuarios y navegación.</Typography></Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField size="small" placeholder="Buscar y presionar Enter" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <Tooltip title="Refrescar"><IconButton onClick={() => load()} disabled={loading}><RefreshIcon /></IconButton></Tooltip>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ border: "1.5px solid", borderColor: "secondary.main", borderRadius: 0, overflowX: "auto" }}>
        {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : <Table sx={{ minWidth: 680 }}>
          <TableHead><TableRow sx={{ bgcolor: "rgba(213, 0, 186, 0.08)" }}>{["Fecha", "Usuario", "Acción", "Detalle", "Página"].map((heading) => <TableCell key={heading} sx={{ fontWeight: 700, color: "secondary.main" }}>{heading}</TableCell>)}</TableRow></TableHead>
          <TableBody>{logs.map((log) => <TableRow key={log._id} hover>
            <TableCell>{formatDate(log.createdAt || log.creado)}</TableCell>
            <TableCell>{log.userId?.username || "Visitante"}</TableCell>
            <TableCell><Typography variant="caption" sx={{ fontWeight: 700 }}>{log.accion}</Typography></TableCell>
            <TableCell>{log.detalles || "—"}</TableCell>
            <TableCell>{log.pagina || "—"}</TableCell>
          </TableRow>)}{!logs.length && <TableRow><TableCell colSpan={5} align="center">No hay eventos para mostrar.</TableCell></TableRow>}</TableBody>
        </Table>}
        <TablePagination component="div" count={pagination.total} page={pagination.page} rowsPerPage={pagination.limit} onPageChange={(_, page) => load(page, pagination.limit)} onRowsPerPageChange={(event) => load(0, Number(event.target.value))} rowsPerPageOptions={[10, 25, 50]} labelRowsPerPage="Filas" />
      </TableContainer>
    </Box>
  );
};
