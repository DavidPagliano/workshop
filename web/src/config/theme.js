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

theme = responsiveFontSizes(theme);

export default theme;