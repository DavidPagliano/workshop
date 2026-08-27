import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Hook de enrutamiento

const EventCard = ({ title, description, routePath }) => {
  const navigate = useNavigate(); // Inicializamos el navegador

  const handleNavigation = () => {
    // Redirige dinámicamente a la ruta que le pasemos por props
    navigate(routePath);
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button variant="contained" onClick={handleNavigation}>
          Ir a Inscripción
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;