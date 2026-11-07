import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00B4FF', // Cian / Celeste eléctrico del cursor 3D
      contrastText: '#03083B',
    },
    secondary: {
      main: '#D500BA', // Magenta / Fucsia de los badges y degradado central
      light: '#F536DD',
      dark: '#8E007C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: 'transparent',   // Deja visible el fondo de grilla definido en index.css
      paper: 'rgba(7, 16, 82, 0.9)',   // Azul marino semi-transparente sobre la grilla
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#00B4FF',
    },
    divider: 'rgba(0, 180, 255, 0.25)',
  },
  customGradients: {
    blueDark: 'linear-gradient(135deg, #0A22B0 0%, #03083B 100%)',
    magenta: 'linear-gradient(135deg, #E000C4 0%, #9C0086 100%)',
    blueToMagenta: 'linear-gradient(135deg, #1C1985 0%, #A3008E 100%)',
  },
  typography: {
    fontFamily: "'Neue Haas Grotesk', -apple-system, sans-serif",
    h1: {
      fontFamily: "'Neue Haas Grotesk', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: '#FFFFFF',
    },
    h2: {
      fontFamily: "'Neue Haas Grotesk', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Neue Haas Grotesk', sans-serif",
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: "'Omega Pixel BIFORM', monospace",
      letterSpacing: '0.04em',
    },
    subtitle2: {
      fontFamily: "'Omega Pixel BIFORM', monospace",
      letterSpacing: '0.06em',
    },
    button: {
      fontFamily: "'Omega Pixel BIFORM', monospace",
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #00B4FF',
          boxShadow: '4px 4px 0px #D500BA',
          padding: '10px 24px',
          color: '#FFFFFF',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0px #D500BA',
            backgroundColor: '#00B4FF',
            color: '#03083B',
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '2px 2px 0px #D500BA',
          },
        },
        containedSecondary: {
          border: '2px solid #D500BA',
          boxShadow: '4px 4px 0px #00B4FF',
          backgroundColor: '#D500BA',
          '&:hover': {
            backgroundColor: '#F536DD',
            boxShadow: '6px 6px 0px #00B4FF',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1.5px solid #00B4FF',
          backgroundColor: 'rgba(7, 16, 82, 0.9)',
          boxShadow: '4px 4px 0px rgba(213, 0, 186, 0.5)',
        },
      },
    },
  },
});
export const institutionalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#002E73', // Azul Marino Oscuro (de la base del logo)
      light: '#1E468A',
      dark: '#001A47',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0073F7', // Azul Eléctrico (del cuadrante superior izquierdo)
      light: '#338FF8',
      dark: '#0053B5',
      contrastText: '#ffffff',
    },
    info: {
      main: '#00CEFC', // Celeste/Cian (del cuadrante superior derecho)
    },
    background: {
      default: '#F5F7FA', // Fondo claro, suave y limpio para la interfaz
      paper: '#ffffff',   // Blanco para la tarjeta del formulario
    },
    text: {
      primary: '#0D1E36', // Azul muy oscuro para excelente legibilidad
      secondary: '#4A5B73', // Gris azulado para etiquetas y textos secundarios
    },
  },
  typography: {
    // Tipografía profesional y educativa: Montserrat para títulos, Inter para el cuerpo
    fontFamily: '"Inter", "Montserrat", "Helvetica", "Arial", sans-serif',
    h3: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      color: '#002E73',
    },
    h4: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      color: '#002E73',
      letterSpacing: '-0.02em',
    },
    h6: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      color: '#002E73',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#4A5B73',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      textTransform: 'none', // Estilo más natural y profesional
      fontWeight: 600,
    },
  },
  shape: {
    // Bordes más redondeados que acompañan las formas suaves del logo
    borderRadius: 12, 
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F7FA',
          backgroundImage: 'none',
          cursor: 'auto', // Resetea cualquier puntero personalizado
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 115, 247, 0.15)', // Sombra sutil con el secundario
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Bordes algo más suaves para el formulario
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 32px rgba(0, 46, 115, 0.04)', // Sombra muy sutil usando el color base oscuro
          border: '1px solid rgba(0, 46, 115, 0.08)',
        },
      },
    },
  },
})
theme = responsiveFontSizes(theme);

export default theme;