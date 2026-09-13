import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de las páginas
import HomePage from './pages/HomePage'; 
import AsistenciaPage from './pages/registracion'; // Módulo de Mesa de Entrada / Asistencia
import { CyclePreinscriptionPage } from './pages/inscripcion-tsm/CyclePreinscriptionPage';
import InscripcionPage from './pages/inscripcion-w/EventRegistrationPage';
import EstadisticasPage from './pages/estadisticas/estadisticasPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta Raíz */}
        <Route path="/" element={<HomePage />} />
        
        {/* Módulo de Mesa de Entrada / Asistencia */}
        <Route path="/registro" element={<AsistenciaPage />} />
        <Route path="/asistencia" element={<AsistenciaPage />} />
        <Route path="/inscripcion" element={<InscripcionPage />} />
        
        {/* Pre-inscripción al ciclo */}
        <Route path="/pre-ciclo" element={<CyclePreinscriptionPage />} />
        
        {/* Página de Estadísticas */}
        <Route path="/estadisticas" element={<EstadisticasPage />} />
        
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
    </Router>
  );
};

export default App;