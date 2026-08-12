import { createTheme} from '@mui/material/styles';

// cuando se tenga la paleta de colores aqui se va a cambiar por el color que debe ir
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', 
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8', // Fondo gris claro para la aplicación
      paper: '#ffffff',   // Fondo blanco para tarjetas y formularios
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Evita que los botones estén todo en mayúsculas
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Bordes un poco más redondeados para un diseño moderno
  },
});

export default theme;