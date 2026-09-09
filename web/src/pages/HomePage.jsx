import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// ─── Componentes locales ─────────────────────────────────────────────
import { VectorBox } from "../components/home/vectorBox";
import { SchedulePanel } from "../components/home/schedulePanel";

// ─── Assets ──────────────────────────────────────────────────────────
import bgGrid from "../assets/images/fondo/FONDO3.png";
import cursorImg from "../assets/images/CURSOR.png";
import masImg from "../assets/images/MAS.png";
import playImg from "../assets/images/PLAY.png";
import pixeladoImg from "../assets/images/pixelado.png";

// ─── Helpers reutilizables ───────────────────────────────────────────

/** Nodos vectoriales (cuadraditos) en las 4 esquinas de un contenedor */
const CornerDots = ({ size = 8, offset = -5, color = "#00B4FF" }) => {
  const positions = [
    { top: offset, left: offset },
    { top: offset, right: offset },
    { bottom: offset, left: offset },
    { bottom: offset, right: offset },
  ];
  return positions.map((pos, i) => (
    <Box
      key={i}
      sx={{
        position: "absolute",
        width: size,
        height: size,
        bgcolor: color,
        ...pos,
      }}
    />
  ));
};

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${bgGrid})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: { xs: "cover", md: "auto" },
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 6, sm: 8, md: 10 },
        px: { xs: 1, sm: 0 },
      }}
    >
      {/* ============================================================= */}
      {/* ELEMENTOS FLOTANTES DECORATIVOS (fondo)                       */}
      {/* ============================================================= */}

      {/* Rastro Pixelado — lateral derecho */}
      <Box
        component="img"
        src={pixeladoImg}
        alt="Pixel art decoration"
        sx={{
          position: "absolute",
          top: { xs: "2%", sm: "5%", md: "12%" },
          right: { xs: "-60px", sm: "-30px", md: "5%" },
          width: { xs: "140px", sm: "220px", md: "340px" },
          opacity: { xs: 0.2, sm: 0.4, md: 0.85 },
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Cursor 3D Celeste — arriba a la derecha */}
      <Box
        component="img"
        src={cursorImg}
        alt="3D Cursor"
        sx={{
          position: "absolute",
          top: { xs: "3%", sm: "10%", md: "20%" },
          right: { xs: "2%", sm: "5%", md: "18%" },
          width: { xs: "50px", sm: "90px", md: "150px" },
          transform: "rotate(-5deg)",
          pointerEvents: "none",
          zIndex: 3,
          opacity: { xs: 0.5, sm: 0.8, md: 1 },
          filter: "drop-shadow(0 12px 24px rgba(0, 180, 255, 0.35))",
        }}
      />

      {/* Botón PLAY 3D — lateral izquierdo */}
      <Box
        component="img"
        src={playImg}
        alt="3D Play Button"
        sx={{
          position: "absolute",
          bottom: { xs: "3%", sm: "8%", md: "22%" },
          left: { xs: "2%", sm: "4%", md: "10%" },
          width: { xs: "55px", sm: "100px", md: "160px" },
          pointerEvents: "none",
          zIndex: 3,
          opacity: { xs: 0.5, sm: 0.8, md: 1 },
          filter: "drop-shadow(0 12px 20px rgba(213, 0, 186, 0.3))",
        }}
      />

      {/* Cruz / Más 3D — esquina inferior derecha */}
      <Box
        component="img"
        src={masImg}
        alt="3D Cross Decoration"
        sx={{
          position: "absolute",
          bottom: { xs: "2%", sm: "4%", md: "8%" },
          right: { xs: "2%", sm: "5%", md: "12%" },
          width: { xs: "70px", sm: "130px", md: "210px" },
          pointerEvents: "none",
          zIndex: 3,
          opacity: { xs: 0.4, sm: 0.7, md: 1 },
          filter: "drop-shadow(0 15px 30px rgba(3, 8, 59, 0.8))",
        }}
      />

      {/* ============================================================= */}
      {/* CONTENIDO CENTRAL                                             */}
      {/* ============================================================= */}
      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 3 },
        }}
      >
        {/* ─── TÍTULO: EVENTO 2026 ─────────────────────────────────── */}
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.5, sm: 2.5 },
            bgcolor: "#03083B",
            border: { xs: "1.5px solid #00B4FF", sm: "2px solid #00B4FF" },
            boxShadow: {
              xs: "4px 4px 0px #D500BA",
              sm: "6px 6px 0px #D500BA",
            },
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 1, sm: 1.5, md: 2 },
            mb: { xs: 2, sm: 3 },
            position: "relative",
            maxWidth: "100%",
          }}
        >
          <CornerDots />

          <Typography
            component="span"
            sx={{
              fontFamily: "'Neue Haas Grotesk', sans-serif",
              fontSize: { xs: "2rem", sm: "3.2rem", md: "4.8rem" },
              fontWeight: 800,
              lineHeight: 1,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            Multi Day
          </Typography>

          <Typography
            component="span"
            sx={{
              fontFamily: "'Neue Haas Grotesk', sans-serif",
              fontSize: { xs: "2rem", sm: "3.2rem", md: "4.8rem" },
              fontWeight: 800,
              lineHeight: 1,
              color: "#00B4FF",
              letterSpacing: "-0.02em",
            }}
          >
            2026
          </Typography>
        </Box>

        {/* ─── DESCRIPCIÓN ─────────────────────────────────────────── */}
        <Box
          sx={{
            display: "inline-block",
            maxWidth: { xs: "100%", sm: 520, md: 620 },
            width: { xs: "100%", sm: "auto" },
            mx: "auto",
            mb: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.5, md: 1.8 },
            bgcolor: "#03083B",
            border: "1.5px solid #00B4FF",
            boxShadow: "4px 4px 0px #D500BA",
            position: "relative",
          }}
        >
          <CornerDots size={5} offset={-3} />

          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Neue Haas Grotesk', sans-serif",
              color: "#FFFFFF",
              fontSize: { xs: "0.8rem", sm: "0.92rem", md: "1.05rem" },
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Jornada institucional y apertura de pre-inscripciones. Participa de
            las charlas, talleres y actividades prácticas.
          </Typography>
        </Box>

        {/* ─── FECHA ───────────────────────────────────────────────── */}
        <Box
          sx={{
            mb: { xs: 2.5, sm: 4 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <VectorBox
            borderColor="#D500BA"
            sx={{
              px: { xs: 2, sm: 3 },
              py: 0.6,
              bgcolor: "rgba(3, 8, 59, 0.75)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#FFFFFF",
                fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1.05rem" },
                letterSpacing: "0.12em",
              }}
            >
              6 DE OCTUBRE
            </Typography>
          </VectorBox>
        </Box>

        {/* ─── GLOBO "TE ESPERAMOS" ────────────────────────────────── */}
        <Box
          sx={{
            mb: { xs: 3, sm: 4 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              border: "2px solid #00B4FF",
              bgcolor: "#03083B",
              px: { xs: 1.5, sm: 2.2 },
              py: 0.4,
              boxShadow: "3px 3px 0px #00B4FF",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
                color: "#FFFFFF",
              }}
            >
              ¡Te esperamos!
            </Typography>
          </Box>
        </Box>

        {/* ─── BOTONES DE ACCIÓN ───────────────────────────────────── */}
        <Box
          sx={{
            mb: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 1.5, sm: 2.5 },
            px: { xs: 1, sm: 0 },
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/registro")}
            sx={{
              bgcolor: "#00B4FF",
              borderColor: "#00B4FF",
              color: "#03083B",
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.8rem", sm: "0.88rem", md: "0.95rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "#4dc9ff", color: "#03083B" },
            }}
          >
            Registrarse al Evento
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/inscripcion")}
            sx={{
              background: (theme) => theme.customGradients?.magenta || "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.8rem", sm: "0.88rem", md: "0.95rem" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Inscripcion al Evento
          </Button>

          {/* BOTÓN PREINSCRIPCIÓN */}
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/pre-ciclo")}
            sx={{
              background: (theme) => theme.customGradients?.magenta || "linear-gradient(45deg, #D500BA 30%, #FF007F 90%)",
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.8rem", sm: "0.88rem", md: "0.95rem" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Preinscripción
          </Button>

          {/* BOTÓN ESTADÍSTICAS */}
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/estadisticas")}
            sx={{
              borderColor: "#00B4FF",
              color: "#00B4FF",
              bgcolor: "transparent",
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.8rem", sm: "0.88rem", md: "0.95rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "rgba(0, 180, 255, 0.1)", borderColor: "#00B4FF" },
            }}
          >
            Estadísticas
          </Button>
        </Box>

        {/* ─── PANEL DE CRONOGRAMA ─────────────────────────────────── */}
        <Box
          sx={{
            display: { xs: "block", sm: "inline-block" },
            position: "relative",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <SchedulePanel />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;