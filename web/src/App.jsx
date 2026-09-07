import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InscripcionPage from './pages/inscripcion-w/inscripcion-w';

export default function App () {
  return (
    <Router>
      <Routes>
        {/* Ruta principal mapeada para ver el formulario */}
        <Route path="/inscripcion" element={<InscripcionPage />} />
        {/* Redirección automática de la raíz (/) hacia la página de inscripción */}
        <Route path="/" element={<Navigate to="/inscripcion" replace />} />
        {/* Manejo de rutas no encontradas (404) */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Página no encontrada (404)</h2>
          </div>
        } />
      </Routes>
    </Router>
  );
}
