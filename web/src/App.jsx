import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de las páginas
import HomePage from './pages/HomePage'; 
import AsistenciaPage from './pages/registracion'; // Módulo de Mesa de Entrada / Asistencia
import { CyclePreinscriptionPage } from './pages/inscripcion-tsm/CyclePreinscriptionPage';
import InscripcionPage from './pages/inscripcion-w/inscripcion-w';
import EstadisticasPage from './pages/estadisticas/estadisticas';

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
        
        {/* Ruta 404 */}
        <Route 
          path="*" 
          element={<h2 style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>404 - Página no encontrada</h2>} 
        />
      </Routes>
    </Router>
  );
};

export default App;