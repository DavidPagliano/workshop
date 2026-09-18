import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Container, Divider, Fade, Paper, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import toast from "react-hot-toast";
import { getUsers, createUser, updateUserStatus, deleteUser } from "../../services/adminService";
import { getEventRegistrations } from "../../services/eventService";
import { AdminOverview } from "../../components/admin/AdminOverview";
import { UserManagement } from "../../components/admin/UserManagement";
import { AuditLog } from "../../components/admin/AuditLog";
import { AdminQuickLinks } from "../../components/admin/AdminQuickLinks";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = useCallback(async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const [usersData, eventData] = await Promise.all([
        getUsers(),
        getEventRegistrations(),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRegistrations(Array.isArray(eventData) ? eventData : []);
    } catch (requestError) {
      setError(requestError.message || "No se pudo cargar la información administrativa");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // La carga inicial sincroniza datos externos; el lint de hooks no puede inferir
  // que los setState ocurren después de la promesa HTTP.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAdminData(); }, [loadAdminData]);

  const handleCreate = async (data) => {
    await createUser(data);
    toast.success("Usuario creado correctamente");
    await loadAdminData();
  };

  const handleToggle = async (item) => {
    try {
      await updateUserStatus(item._id, !item.activo);
      toast.success(item.activo ? "Usuario desactivado" : "Usuario activado");
      await loadAdminData();
    } catch (requestError) { toast.error(requestError.message || "No se pudo actualizar el usuario"); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar al usuario ${item.username}?`)) return;
    try {
      await deleteUser(item._id);
      toast.success("Usuario eliminado");
      await loadAdminData();
    } catch (requestError) { toast.error(requestError.message || "No se pudo eliminar el usuario"); }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        pt: { xs: 3, sm: 5, md: 6 },
        pb: { xs: 5, sm: 7 },
      }}
    >
      <Fade in timeout={600}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: { xs: 34, sm: 42 }, color: "secondary.main" }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "secondary.main" }}>Administración</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Control central de usuarios, actividad y operaciones del Workshop.</Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <AdminOverview users={users} registrations={registrations} auditTotal={auditTotal} />
          <Divider sx={{ my: 5 }} />
          <Paper sx={{ p: { xs: 2, sm: 3 }, border: "1.5px solid", borderColor: "primary.main", borderRadius: 0 }}>
            <UserManagement
              users={users}
              loading={loadingUsers}
              onCreate={handleCreate}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onRefresh={loadAdminData}
            />
          </Paper>
          <Box sx={{ mt: 5 }}><AuditLog onTotalChange={setAuditTotal} /></Box>
          <Divider sx={{ my: 5 }} />
          <Box><Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Accesos operativos</Typography><AdminQuickLinks /></Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default AdminPage;
