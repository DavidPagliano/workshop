import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../context/AuthContext";

const rawNavItems = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: <HomeIcon />,
    roles: ["admin", "director", "staff_registracion", "staff_bedele"],
  },
  {
    label: "Pre-inscripción",
    path: "/dashboard/pre-ciclo",
    icon: <AssignmentIcon />,
    roles: ["admin", "director", "staff_bedele"],
  },
  {
    label: "Asistencia",
    path: "/dashboard/asistencia",
    icon: <HowToRegIcon />,
    roles: ["admin", "director", "staff_registracion"],
  },
  {
    label: "Estadísticas",
    path: "/dashboard/estadisticas",
    icon: <BarChartIcon />,
    roles: ["admin", "director"],
  },
  {
    label: "Admin",
    path: "/dashboard/admin",
    icon: <AdminPanelSettingsIcon />,
    roles: ["admin"],
  },
];

const PrivateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = rawNavItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(3, 8, 59, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1.5px solid",
          borderColor: "primary.main",
          boxShadow: "0 2px 0px rgba(213, 0, 186, 0.4)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                color: "primary.main",
              }}
            >
              MULTIDAY
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "secondary.main",
                fontFamily: "'Omega Pixel BIFORM', monospace",
              }}
            >
              [{user?.role?.toUpperCase()}]
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  size="small"
                  sx={{
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.primary",
                    borderBottom: isActive(item.path)
                      ? "2px solid #00B4FF"
                      : "2px solid transparent",
                    borderRadius: 0,
                    fontFamily: "'Omega Pixel BIFORM', monospace",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, borderColor: "divider" }}
              />
              <Button
                onClick={handleLogout}
                size="small"
                startIcon={<LogoutIcon sx={{ fontSize: 14 }} />}
                sx={{ color: "error.light", border: "none", boxShadow: "none" }}
              >
                Salir
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "primary.main" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "82vw", sm: 280 },
              maxWidth: 300,
              bgcolor: "#03083B",
              borderLeft: "1.5px solid #00B4FF",
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0,180,255,0.2)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              color: "primary.main",
            }}
          >
            MENÚ
          </Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1, borderColor: "divider" }} />
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: "error.light" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar Sesión"
              slotProps={{ primary: { color: "error.light" } }}
            />
          </ListItemButton>
        </List>
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PrivateLayout;
