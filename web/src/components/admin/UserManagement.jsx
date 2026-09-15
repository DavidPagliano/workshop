import { useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, MenuItem, Paper, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "../../context/AuthContext";

const initialForm = { username: "", email: "", password: "", role: "staff_registracion" };
const roles = ["admin", "director", "staff_registracion", "staff_bedele"];

export const UserManagement = ({ users, loading, onCreate, onToggle, onDelete }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");

  const sortedUsers = useMemo(() => [...users].sort((a, b) => Number(b.activo) - Number(a.activo)), [users]);

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    try {
      await onCreate(form);
      setForm(initialForm);
      setOpen(false);
    } catch (error) {
      setFormError(error.message || "No se pudo crear el usuario");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Usuarios y permisos</Typography>
          <Typography variant="body2" color="text.secondary">Aprobá solicitudes y administrá el acceso al sistema.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Nuevo usuario</Button>
      </Box>

      {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
        <TableContainer component={Paper} sx={{ border: "1.5px solid", borderColor: "primary.main", borderRadius: 0, overflowX: "auto" }}>
          <Table sx={{ minWidth: 680 }}>
            <TableHead><TableRow sx={{ bgcolor: "rgba(0, 180, 255, 0.08)" }}>
              {['Usuario', 'Email', 'Rol', 'Estado', 'Acciones'].map((heading) => <TableCell key={heading} sx={{ fontWeight: 700, color: "primary.main" }}>{heading}</TableCell>)}
            </TableRow></TableHead>
            <TableBody>
              {sortedUsers.map((item) => {
                const own = String(item._id) === String(currentUser?.id);
                return <TableRow key={item._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell><Chip label={item.role} size="small" variant="outlined" /></TableCell>
                  <TableCell><Chip label={item.activo ? "Activo" : "Pendiente"} color={item.activo ? "success" : "warning"} size="small" /></TableCell>
                  <TableCell>
                    <Tooltip title={item.activo ? "Desactivar" : "Activar"}>
                      <span><IconButton color={item.activo ? "warning" : "success"} disabled={own} onClick={() => onToggle(item)}>{item.activo ? <PersonOffIcon /> : <PersonAddIcon />}</IconButton></span>
                    </Tooltip>
                    <Tooltip title={own ? "No puedes eliminarte" : "Eliminar"}>
                      <span><IconButton color="error" disabled={own} onClick={() => onDelete(item)}><DeleteIcon /></IconButton></span>
                    </Tooltip>
                  </TableCell>
                </TableRow>;
              })}
              {!sortedUsers.length && <TableRow><TableCell colSpan={5} align="center">No hay usuarios registrados.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={mobile}>
        <Box component="form" onSubmit={submit}>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField label="Usuario" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Contraseña" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}
            </Select>
          </DialogContent>
          <DialogActions><Button onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit" variant="contained">Crear</Button></DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
