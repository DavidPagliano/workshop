import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

// ─── Iconos MUI ──────────────────────────────────────────────────────
import GroupsIcon from "@mui/icons-material/Groups";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";

// ─── Assets ──────────────────────────────────────────────────────────
import bgGrid from "../assets/images/fondo/FONDO3.png";
import cursorImg from "../assets/images/CURSOR.png";
import masImg from "../assets/images/MAS.png";
import playImg from "../assets/images/PLAY.png";
import pixeladoImg from "../assets/images/pixelado.png";

// Imágenes de Workshops Anteriores
import ws1 from "../assets/images/workshops/ws1.jpeg";
import ws2 from "../assets/images/workshops/ws2.jpeg";
import ws3 from "../assets/images/workshops/ws3.jpeg";
import ws4 from "../assets/images/workshops/ws4.jpeg";
import ws5 from "../assets/images/workshops/ws5.png";

// Array de imágenes del carrusel
const WORKSHOP_IMAGES = [
  { id: 1, title: "Workshop 2024", src: ws1 },
  { id: 2, title: "Workshop 2019", src: ws2 },
  { id: 3, title: "Workshop 2024", src: ws3 },
  { id: 4, title: "Workshop 2019", src: ws4 },
  { id: 5, title: "Workshop 2025", src: ws5 },
];

// ─── Helpers reutilizables ───────────────────────────────────────────

/** Nodos vectoriales (cuadraditos) en las 4 esquinas de un contenedor */
const CornerDots = ({ size = 6, offset = -4, color = "#00B4FF" }) => {
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
        zIndex: 2,
        ...pos,
      }}
    />
  ));
};

/** Componente Contador Regresivo (Estética Neon Retro) */
const TARGET_DATE = new Date("2026-10-07T19:00:00-03:00").getTime();

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const difference = TARGET_DATE - Date.now();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  });

  useEffect(() => {
    const calculateTimeLeft = (now) => {
      const difference = TARGET_DATE - now;
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, "0");

  const timerItems = [
    { label: "DÍAS", value: formatNumber(timeLeft.days) },
    { label: "HORAS", value: formatNumber(timeLeft.hours) },
    { label: "MIN", value: formatNumber(timeLeft.minutes) },
    { label: "SEG", value: formatNumber(timeLeft.seconds) },
  ];

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        mb: { xs: 5, sm: 7 },
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Omega Pixel BIFORM', monospace",
          fontSize: { xs: "0.75rem", sm: "0.9rem" },
          color: "#D500BA",
          letterSpacing: "0.15em",
          mb: 1.5,
          textTransform: "uppercase",
        }}
      >
        TIEMPO RESTANTE PARA EL EVENTO...
      </Typography>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 1, sm: 3, md: 4 },
          bgcolor: "#03083B",
          border: "2px solid #00B4FF",
          boxShadow: {
            xs: "4px 4px 0px #D500BA",
            sm: "5px 5px 0px #D500BA",
          },
          px: { xs: 1.2, sm: 3, md: 4 },
          py: { xs: 1.2, sm: 2 },
          maxWidth: "100%",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <CornerDots size={6} offset={-4} color="#00B4FF" />

        {timerItems.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: { xs: "38px", sm: "65px", md: "80px" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "1.35rem", sm: "2.3rem", md: "3rem" },
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1,
                textShadow: "0 0 8px rgba(0, 180, 255, 0.6)",
              }}
            >
              {item.value}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "0.55rem", sm: "0.72rem", md: "0.82rem" },
                fontWeight: 700,
                color: "#00B4FF",
                letterSpacing: "0.1em",
                mt: 0.8,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/** Componente Carrusel de Workshops Anteriores */
const WorkshopCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % WORKSHOP_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? WORKSHOP_IMAGES.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        my: { xs: 4, sm: 5, md: 6 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Omega Pixel BIFORM', monospace",
          fontSize: { xs: "0.85rem", sm: "1.1rem" },
          color: "#D500BA",
          letterSpacing: "0.12em",
          mb: 2,
          textTransform: "uppercase",
        }}
      >
        Workshops Anteriores
      </Typography>

      {/* Contenedor Principal del Carrusel en 16:9 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          aspectRatio: "16 / 9",
          bgcolor: "#03083B",
          border: "2px solid #00B4FF",
          boxShadow: {
            xs: "5px 5px 0px #D500BA",
            sm: "8px 8px 0px #D500BA",
          },
          overflow: "hidden",
        }}
      >
        <CornerDots size={8} offset={-4} color="#00B4FF" />

        {/* Imagen actual */}
        <Box
          component="img"
          src={WORKSHOP_IMAGES[currentIndex].src}
          alt={WORKSHOP_IMAGES[currentIndex].title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "opacity 0.4s ease-in-out",
          }}
        />

        {/* Overlay con Título */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(3, 8, 59, 0.85)",
            borderTop: "1px solid #00B4FF",
            px: 2,
            py: 1,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Neue Haas Grotesk', sans-serif",
              fontSize: { xs: "0.75rem", sm: "0.95rem" },
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            {WORKSHOP_IMAGES[currentIndex].title}
          </Typography>
        </Box>

        {/* Botón Anterior */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            bgcolor: "#03083B",
            color: "#00B4FF",
            border: "1.5px solid #00B4FF",
            borderRadius: 0,
            boxShadow: "2px 2px 0px #D500BA",
            "&:hover": {
              bgcolor: "#00B4FF",
              color: "#03083B",
            },
          }}
        >
          ◄
        </IconButton>

        {/* Botón Siguiente */}
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            bgcolor: "#03083B",
            color: "#00B4FF",
            border: "1.5px solid #00B4FF",
            borderRadius: 0,
            boxShadow: "2px 2px 0px #D500BA",
            "&:hover": {
              bgcolor: "#00B4FF",
              color: "#03083B",
            },
          }}
        >
          ►
        </IconButton>
      </Box>

      {/* Indicadores (Dots) */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 2, justifyContent: "center" }}>
        {WORKSHOP_IMAGES.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 10,
              height: 10,
              bgcolor: index === currentIndex ? "#00B4FF" : "transparent",
              border: "1.5px solid #00B4FF",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
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
        backgroundSize: "auto",
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 8, sm: 12 },
      }}
    >
      {/* ─── ELEMENTOS FLOTANTES DECORATIVOS ──────────────────────── */}

      {/* Rastro Pixelado — derecha superior */}
      <Box
        component="img"
        src={pixeladoImg}
        alt="Pixel art decoration"
        sx={{
          position: "absolute",
          top: { xs: "1%", md: "5%" },
          right: { xs: "-40px", md: "1%" },
          width: { xs: "160px", md: "320px" },
          opacity: 0.85,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Cursor 3D — desplazado más a la derecha */}
      <Box
        component="img"
        src={cursorImg}
        alt="3D Cursor"
        sx={{
          position: "absolute",
          top: { xs: "2%", md: "8%" },
          right: { xs: "0%", md: "1%" },
          width: { xs: "70px", sm: "110px", md: "160px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 10px 20px rgba(0, 180, 255, 0.35))",
        }}
      />

      {/* Botón PLAY 3D — desplazado más a la izquierda */}
      <Box
        component="img"
        src={playImg}
        alt="3D Play Button"
        sx={{
          position: "absolute",
          top: { xs: "20%", md: "35%" },
          left: { xs: "0%", md: "1%" },
          width: { xs: "65px", sm: "110px", md: "160px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 10px 20px rgba(213, 0, 186, 0.3))",
        }}
      />

      {/* Cruz / Más 3D — desplazado más hacia la derecha exterior */}
      <Box
        component="img"
        src={masImg}
        alt="3D Cross Decoration"
        sx={{
          position: "absolute",
          bottom: { xs: "1%", md: "4%" },
          right: { xs: "-30px", sm: "-50px", md: "-70px" },
          width: { xs: "80px", sm: "140px", md: "220px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 12px 25px rgba(3, 8, 59, 0.8))",
        }}
      />

      {/* ─── CONTENIDO CENTRAL ────────────────────────────────────── */}
      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* 1. CAJA SUPERIOR: JORNADA INSTITUCIONAL */}
        <Box
          sx={{
            display: "inline-block",
            bgcolor: "#03083B",
            border: "1.5px solid #00B4FF",
            px: { xs: 2, sm: 3 },
            py: 0.6,
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: "0.7rem", sm: "0.85rem" },
              color: "#00B4FF",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            JORNADA INSTITUCIONAL • 2026
          </Typography>
        </Box>

        {/* 2. TÍTULO PRINCIPAL: MULTIDAY 2026 */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #00B4FF",
              boxShadow: "6px 6px 0px #D500BA",
              px: { xs: 1.5, sm: 6, md: 8 },
              py: { xs: 2, sm: 3 },
              position: "relative",
              width: "100%",
              maxWidth: "680px",
            }}
          >
            <CornerDots size={7} offset={-4} color="#00B4FF" />

            {/* MULTIDAY Centrado */}
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: {
                  xs: "clamp(1.9rem, 8.5vw, 2.8rem)",
                  sm: "4.5rem",
                  md: "5.8rem",
                },
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 0.9,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              MULTIDAY
            </Typography>

            {/* 2026 Alineado a la derecha */}
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "1.8rem", sm: "3rem", md: "3.8rem" },
                fontWeight: 800,
                color: "#00B4FF",
                lineHeight: 1,
                textAlign: "right",
                mt: 0.5,
              }}
            >
              2026
            </Typography>
          </Box>
        </Box>

        {/* 4. BOTÓN ÚNICO DE ACCIÓN */}
        <Box sx={{ mb: 5 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/inscripcion")}
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              bgcolor: "#00B4FF",
              color: "#03083B",
              border: "2px solid #00B4FF",
              boxShadow: "4px 4px 0px #D500BA",
              borderRadius: 0,
              px: { xs: 3, sm: 5 },
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              fontWeight: 700,
              textTransform: "lowercase",
              "&:hover": {
                bgcolor: "#4dc9ff",
                boxShadow: "4px 4px 0px #D500BA",
              },
            }}
          >
            iNSCRiBiRME AL EVENTO ↓
          </Button>
        </Box>

        {/* 5. CONTADOR REGRESIVO (7 DE OCTUBRE) */}
        <CountdownTimer />

        {/* 6a. CAJA ANCHA: UNA JORNADA PARA ENCONTRARNOS */}
        <Box
          sx={{
            bgcolor: "#03083B",
            border: "2px solid #00B4FF",
            boxShadow: "5px 5px 0px #D500BA",
            p: { xs: 2.5, sm: 4 },
            mb: 4,
            position: "relative",
            maxWidth: "840px",
            mx: "auto",
          }}
        >
          <CornerDots size={6} offset={-4} color="#00B4FF" />
          <Typography
            sx={{
              fontFamily: "'Neue Haas Grotesk', sans-serif",
              fontSize: { xs: "1.2rem", sm: "1.6rem", md: "1.8rem" },
              fontWeight: 800,
              color: "#00B4FF",
              mb: 1,
              textAlign: "center",
            }}
          >
            Una jornada para encontrarnos
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Neue Haas Grotesk', sans-serif",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              color: "#FFFFFF",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Ideas, herramientas y experiencias para potenciar lo que hacemos.
          </Typography>
        </Box>

        {/* 6b. CARRUSEL WORKSHOPS ANTERIORES (Entre Una jornada para encontrarnos y las 3 tarjetas) */}
        <WorkshopCarousel />

        {/* 6c. TRES CAJAS TARJETAS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: { xs: 2.5, sm: 2 },
            maxWidth: "840px",
            mx: "auto",
            mb: 5,
            width: "100%",
          }}
        >
          {/* Card 1: Comunidad */}
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #00B4FF",
              boxShadow: "4px 4px 0px #D500BA",
              p: { xs: 2.5, sm: 2.5 },
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CornerDots size={6} offset={-4} color="#00B4FF" />
            <GroupsIcon sx={{ color: "#00B4FF", fontSize: 34, mb: 1.5 }} />
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#FFFFFF",
                mb: 1,
              }}
            >
              Comunidad
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "0.8rem",
                color: "#B0B8C4",
                lineHeight: 1.4,
              }}
            >
              Conectá con estudiantes, docentes, profesionales y personas
              curiosas que comparten tus intereses.
            </Typography>
          </Box>

          {/* Card 2: Inspiración */}
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #D500BA",
              boxShadow: "4px 4px 0px #00B4FF",
              p: { xs: 2.5, sm: 2.5 },
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CornerDots size={6} offset={-4} color="#D500BA" />
            <LightbulbIcon sx={{ color: "#D500BA", fontSize: 34, mb: 1.5 }} />
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#FFFFFF",
                mb: 1,
              }}
            >
              Inspiración
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "0.8rem",
                color: "#B0B8C4",
                lineHeight: 1.4,
              }}
            >
              Participá de charlas, talleres y actividades pensadas para abrir
              nuevas perspectivas.
            </Typography>
          </Box>

          {/* Card 3: Aprendizaje */}
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #00B4FF",
              boxShadow: "4px 4px 0px #D500BA",
              p: { xs: 2.5, sm: 2.5 },
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CornerDots size={6} offset={-4} color="#00B4FF" />
            <SchoolIcon sx={{ color: "#00B4FF", fontSize: 34, mb: 1.5 }} />
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#FFFFFF",
                mb: 1,
              }}
            >
              Aprendizaje
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "0.8rem",
                color: "#B0B8C4",
                lineHeight: 1.4,
              }}
            >
              Llevate ideas aplicables, experiencias reales y nuevas
              herramientas para seguir creciendo.
            </Typography>
          </Box>
        </Box>

        {/* 6c. CAJA GUARDÁ LA FECHA */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #00B4FF",
              boxShadow: "5px 5px 0px #D500BA",
              p: { xs: 3, sm: 4 },
              maxWidth: "750px",
              width: "100%",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <CornerDots size={6} offset={-4} color="#00B4FF" />

            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#FFFFFF",
                textAlign: "center",
                mb: 3,
                width: "100%",
              }}
            >
              Guardá la fecha
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-around",
                alignItems: "center",
                gap: { xs: 3, sm: 2 },
                width: "100%",
              }}
            >
              {/* Bloque 1: Fecha */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <CalendarMonthIcon
                  sx={{ color: "#00B4FF", fontSize: 28, mb: 1 }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  7 DE OCTUBRE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: "0.75rem",
                    color: "#B0B8C4",
                    mt: 0.3,
                    textAlign: "center",
                  }}
                >
                  Fecha del evento
                </Typography>
              </Box>

              {/* Bloque 2: Lugar */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <PlaceIcon sx={{ color: "#00B4FF", fontSize: 28, mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  BALCARCE 2640, ROSARIO
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: "0.75rem",
                    color: "#B0B8C4",
                    mt: 0.3,
                    textAlign: "center",
                  }}
                >
                  Lugar de encuentro
                </Typography>
              </Box>

              {/* Bloque 3: Experiencias */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <AllInclusiveIcon
                  sx={{ color: "#00B4FF", fontSize: 28, mb: 1 }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  EXPERIENCIAS
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: "0.75rem",
                    color: "#B0B8C4",
                    mt: 0.3,
                    textAlign: "center",
                  }}
                >
                  Charlas y talleres
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default HomePage;