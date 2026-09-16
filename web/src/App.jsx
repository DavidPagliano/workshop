import { Routes, Route } from "react-router-dom";

import PrivateLayout from "./components/layout/PrivateLayout";
import HomePage from "./pages/HomePage";
import AsistenciaPage from "./pages/registracion/registrationPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import { CyclePreinscriptionPage } from "./pages/inscripcion-tsm/CyclePreinscriptionPage";
import EstadisticasPage from "./pages/estadisticas/EstadisticasPage";
import AdminPage from "./pages/admin/AdminPage";
import EventRegistrationPage from "./pages/inscripcion-w/EventRegistrationPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { usePageTracking } from "./hooks/usePageTracking";

const App = () => {
  usePageTracking();

  return (
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
          <div
            style={{
              textAlign: "center",
              marginTop: "120px",
              fontFamily: "'Omega Pixel BIFORM', monospace",
              color: "#00B4FF",
            }}
          >
            <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
            <p style={{ color: "#D500BA", letterSpacing: "0.1em" }}>
              PÁGINA NO ENCONTRADA
            </p>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
