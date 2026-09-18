import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";

import PrivateLayout from "./components/layout/PrivateLayout";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { usePageTracking } from "./hooks/usePageTracking";

// Carga bajo demanda solo cuando se navega a la sección
const AsistenciaPage = lazy(() => import("./pages/registracion/registrationPage"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const CyclePreinscriptionPage = lazy(() => import("./pages/inscripcion-tsm/CyclePreinscriptionPage").then(m => ({ default: m.CyclePreinscriptionPage })));
const EstadisticasPage = lazy(() => import("./pages/estadisticas/estadisticasPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const EventRegistrationPage = lazy(() => import("./pages/inscripcion-w/EventRegistrationPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

const App = () => {
  usePageTracking();

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      }
    >
      <Routes>
        {/* ── Rutas Públicas ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/inscripcion" element={<EventRegistrationPage />} />
        <Route
          path="/registro"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "director", "staff_registracion"]}
            />
          }
        >
          <Route index element={<AsistenciaPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro-usuario" element={<RegisterPage />} />

        {/* ── Rutas Protegidas (RBAC) ── */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "director",
                "staff_registracion",
                "staff_bedele",
              ]}
            />
          }
        >
          <Route path="/dashboard" element={<PrivateLayout />}>
            {/* Dashboard General: Acceso a todos los roles */}
            <Route index element={<DashboardHome />} />

            {/* Pre-inscripción: admin, director y staff_bedele */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "director", "staff_bedele"]}
                />
              }
            >
              <Route path="pre-ciclo" element={<CyclePreinscriptionPage />} />
            </Route>

            {/* Asistencia: admin, director y staff_registracion */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "director", "staff_registracion"]}
                />
              }
            >
              <Route path="asistencia" element={<AsistenciaPage />} />
            </Route>

            {/* Estadísticas: admin y director */}
            <Route
              element={<ProtectedRoute allowedRoles={["admin", "director"]} />}
            >
              <Route path="estadisticas" element={<EstadisticasPage />} />
            </Route>

            {/* Panel Admin: Solo admin */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <Box
              sx={{
                textAlign: "center",
                mt: { xs: 8, sm: 12, md: 15 },
                px: 2,
                fontFamily: "'Omega Pixel BIFORM', monospace",
                color: "#00B4FF",
              }}
            >
              <Typography
                component="h1"
                sx={{
                  fontFamily: "inherit",
                  fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.5rem" },
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                404
              </Typography>
              <Typography
                sx={{
                  fontFamily: "inherit",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                  color: "#D500BA",
                  letterSpacing: "0.1em",
                  mt: 1.5,
                }}
              >
                PÁGINA NO ENCONTRADA
              </Typography>
            </Box>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
