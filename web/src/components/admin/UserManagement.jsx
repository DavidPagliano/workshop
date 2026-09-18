import { useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, IconButton, MenuItem, Paper, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockResetIcon from "@mui/icons-material/LockReset";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { resetUserPassword } from "../../services/adminService";

const initialForm = { username: "", email: "", password: "", role: "staff_registracion" };
const roles = ["admin", "director", "staff_registracion", "staff_bedele"];

const roleLabels = {
  admin: "Administrador",
  director: "Director",
  staff_registracion: "Staff Registración",
  staff_bedele: "Staff Bedele",
};

export const UserManagement = ({ users, loading, onCreate, onToggle, onDelete }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetting, setResetting] = useState(false);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const closeViewUser = () => {
    setViewUser(null);
    setShowResetForm(false);
    setNewPassword("");
    setResetError("");
  };

  const handleResetPassword = async () => {
    setResetError("");
    if (!newPassword || newPassword.length < 6) {
      setResetError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setResetting(true);
    try {
      await resetUserPassword(viewUser._id, newPassword);
      toast.success(`Contraseña de ${viewUser.username} actualizada`);
      setShowResetForm(false);
      setNewPassword("");
    } catch (error) {
      setResetError(error.message || "Error al resetear la contraseña");
    } finally {
      setResetting(false);
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
                    <Tooltip title="Ver detalles">
                      <IconButton color="info" onClick={() => setViewUser(item)}><VisibilityIcon /></IconButton>
                    </Tooltip>
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

      {/* Modal Crear Usuario */}
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

      {/* Modal Ver Detalles de Usuario */}
      <Dialog open={Boolean(viewUser)} onClose={closeViewUser} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          <VisibilityIcon color="info" /> Detalles del usuario
        </DialogTitle>
        {viewUser && (
          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Usuario</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewUser.username}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1">{viewUser.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Contraseña</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                  🔒 Encriptada (no recuperable)
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<LockResetIcon />}
                  size="small"
                  onClick={() => setShowResetForm((prev) => !prev)}
                >
                  {showResetForm ? "Cancelar reset" : "Resetear contraseña"}
                </Button>
                <Collapse in={showResetForm}>
                  <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {resetError && <Alert severity="error" size="small">{resetError}</Alert>}
                    <TextField
                      label="Nueva contraseña"
                      type="password"
                      size="small"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      helperText="Mínimo 6 caracteres"
                      autoComplete="new-password"
                    />
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      disabled={resetting}
                      onClick={handleResetPassword}
                      startIcon={resetting ? <CircularProgress size={16} /> : <LockResetIcon />}
                    >
                      {resetting ? "Guardando..." : "Confirmar nueva contraseña"}
                    </Button>
                  </Box>
                </Collapse>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Rol asignado</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={roleLabels[viewUser.role] || viewUser.role} color="primary" variant="outlined" />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Estado</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={viewUser.activo ? "Activo" : "Pendiente"}
                    color={viewUser.activo ? "success" : "warning"}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Creado</Typography>
                <Typography variant="body2">{formatDate(viewUser.creado)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Última actualización</Typography>
                <Typography variant="body2">{formatDate(viewUser.actualizado)}</Typography>
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={closeViewUser} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
