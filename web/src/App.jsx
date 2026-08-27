import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las páginas de nuestra aplicación
import HomePage from './pages/HomePage';
// (Estas dos páginas las crearemos en el futuro, por ahora las simulamos)
import EventRegistrationForm from './components/EventRegistrationForm'; 
import PreCycleRegistrationForm from './components/PreCycleRegistrationForm';

const App = () => {
  return (
    <Router>
      {/* Routes se encarga de buscar el Route que coincida con la URL actual */}
      <Routes>
        
        {/* Ruta Raíz: Muestra las tarjetas de navegación */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas de destino: A donde apunta el useNavigate del EventCard */}
        <Route path="/registro-evento" element={<EventRegistrationForm />} />
        
        <Route path="/pre-ciclo" element={<PreCycleRegistrationForm />} />
        
        {/* Ruta Catch-All (404): Si el usuario escribe una URL que no existe */}
        <Route 
          path="*" 
          element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Página no encontrada</h2>} 
        />
        
      </Routes>
    </Router>
  );
};

export default App;
