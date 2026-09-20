import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

// ─── Iconos MUI ──────────────────────────────────────────────────────
import GroupsIcon from "@mui/icons-material/Groups";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SchoolIcon from "@mui/icons-material/School";
import BuildIcon from "@mui/icons-material/Build";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// ─── Assets ──────────────────────────────────────────────────────────
import bgGrid from "../assets/images/fondo/FONDO3.png";
import cursorImg from "../assets/images/CURSOR.png";
import masImg from "../assets/images/MAS.png";
import playImg from "../assets/images/PLAY.png";
import pixeladoImg from "../assets/images/pixelado.png";
import logoMD from "../assets/images/LOGOMD2026.png"; // logo del evento
import recuadroImg from "../assets/images/RECUADRO.png"; // ← NUEVO: recuadro (cambiar nombre si es otro)

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

// ═════════════════════════════════════════════════════════════════════
// ANIMACIONES DE ÍCONOS Y PNG (estética neón retro)
// Cada constante es un fragmento de `sx` que se "esparce" (...) en el
// elemento. Todas respetan prefers-reduced-motion.
// ═════════════════════════════════════════════════════════════════════

/** Helper: arma un fragmento sx con animación infinita + su @keyframes */
const motion = (
  name,
  frames,
  {
    duration = "4s",
    timing = "ease-in-out",
    delay = "0s",
    origin = "center",
  } = {},
) => ({
  animation: `${name} ${duration} ${timing} ${delay} infinite`,
  transformOrigin: origin,
  willChange: "transform",
  [`@keyframes ${name}`]: frames,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

// ─── PNG decorativos ─────────────────────────────────────────────────

/** Cursor 3D: flota, se inclina y "hace click" */
const CURSOR_MOTION = motion(
  "mdCursorClick",
  {
    "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
    "40%, 70%": { transform: "translate(-6px, -14px) rotate(-4deg) scale(1)" },
    "78%": { transform: "translate(-6px, -14px) rotate(-4deg) scale(0.88)" },
    "88%": { transform: "translate(-6px, -14px) rotate(-4deg) scale(1)" },
  },
  { duration: "5s" },
);

/** Play 3D: late y el glow magenta se intensifica */
const PLAY_MOTION = motion(
  "mdPlayPulse",
  {
    "0%, 100%": {
      transform: "scale(1)",
      filter: "drop-shadow(0 10px 20px rgba(213, 0, 186, 0.3))",
    },
    "50%": {
      transform: "scale(1.1)",
      filter: "drop-shadow(0 10px 32px rgba(213, 0, 186, 0.9))",
    },
  },
  { duration: "2.6s", delay: "-1s" },
);

/** Más 3D: gira de a 90° con rebote (snap) */
const MAS_MOTION = motion(
  "mdMasSnap",
  {
    "0%, 20%": { transform: "rotate(0deg)" },
    "25%, 45%": { transform: "rotate(90deg)" },
    "50%, 70%": { transform: "rotate(180deg)" },
    "75%, 95%": { transform: "rotate(270deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  { duration: "9s", timing: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" },
);

/** Recuadro 3D: flota y se balancea */
const RECUADRO_MOTION = motion(
  "mdFrameFloat",
  {
    "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
    "50%": { transform: "translateY(-14px) rotate(2deg)" },
  },
  { duration: "6s", delay: "-3s" },
);

/** Rastro pixelado: glitch por saltos (steps) */
const PIXELADO_MOTION = motion(
  "mdPixelGlitch",
  {
    "0%, 100%": { transform: "translateX(0)", opacity: 0.85 },
    "10%": { transform: "translateX(-8px)", opacity: 0.6 },
    "12%": { transform: "translateX(0)", opacity: 0.85 },
    "48%": { transform: "translateX(6px)", opacity: 0.95 },
    "50%": { transform: "translateX(0)", opacity: 0.85 },
    "80%": { transform: "translateX(0)", opacity: 0.45 },
    "82%": { transform: "translateX(-4px)", opacity: 0.85 },
  },
  { duration: "5s", timing: "steps(1, end)" },
);

// ─── Íconos MUI (el glow usa currentColor: toma el color del ícono) ──

/** Lamparita: glow que respira + parpadeo de tubo */
const BULB_MOTION = motion(
  "mdBulbGlow",
  {
    "0%, 100%": { filter: "drop-shadow(0 0 2px currentColor)", opacity: 1 },
    "50%": { filter: "drop-shadow(0 0 14px currentColor)" },
    "91%": { opacity: 1 },
    "92%": { opacity: 0.35 },
    "94%": { opacity: 1 },
    "96%": { opacity: 0.55 },
    "98%": { opacity: 1 },
  },
  { duration: "5s" },
);

/** Llave: se sacude como ajustando una tuerca */
const WRENCH_MOTION = motion(
  "mdWrenchTurn",
  {
    "0%, 55%, 100%": { transform: "rotate(0deg)" },
    "10%": { transform: "rotate(-18deg)" },
    "20%": { transform: "rotate(14deg)" },
    "30%": { transform: "rotate(-10deg)" },
    "40%": { transform: "rotate(6deg)" },
    "50%": { transform: "rotate(0deg)" },
  },
  { duration: "4s", origin: "50% 80%" },
);

/** Tendencia: sube en diagonal con glow */
const TREND_MOTION = motion(
  "mdTrendRise",
  {
    "0%, 100%": {
      transform: "translate(0, 0)",
      filter: "drop-shadow(0 0 2px currentColor)",
    },
    "50%": {
      transform: "translate(5px, -5px)",
      filter: "drop-shadow(0 0 12px currentColor)",
    },
  },
  { duration: "3s" },
);

/** Comunidad: latido doble */
const GROUPS_MOTION = motion(
  "mdGroupsBeat",
  {
    "0%, 60%, 100%": { transform: "scale(1)" },
    "15%": { transform: "scale(1.14)" },
    "30%": { transform: "scale(1)" },
    "45%": { transform: "scale(1.14)" },
  },
  { duration: "3.2s" },
);

/** Birrete: saltito y giro */
const SCHOOL_MOTION = motion(
  "mdCapHop",
  {
    "0%, 65%, 100%": { transform: "translateY(0) rotate(0deg)" },
    "20%": { transform: "translateY(-9px) rotate(-8deg)" },
    "40%": { transform: "translateY(0) rotate(0deg)" },
    "52%": { transform: "translateY(-4px) rotate(6deg)" },
  },
  { duration: "4.5s" },
);

// ─── Logo del evento ─────────────────────────────────────────────────

/**
 * Imagen del logo (3 efectos que no se pisan entre sí):
 *  1. Encendido: parpadea como un neón al prender (una sola vez, al cargar)
 *  2. Glow: el resplandor pasa de celeste a magenta y vuelve
 *  3. Glitch: cada 7s "salta" un instante, como una señal con interferencia
 */
const LOGO_FX = {
  animation:
    "mdLogoBoot 1.2s steps(1, end) 1, mdLogoGlow 4s ease-in-out infinite, mdLogoGlitch 7s steps(1, end) infinite",
  "@keyframes mdLogoBoot": {
    "0%": { opacity: 0 },
    "10%": { opacity: 1 },
    "20%": { opacity: 0.2 },
    "30%": { opacity: 1 },
    "45%": { opacity: 0.4 },
    "55%, 100%": { opacity: 1 },
  },
  "@keyframes mdLogoGlow": {
    "0%, 100%": {
      filter:
        "drop-shadow(0 0 4px rgba(0, 180, 255, 0.6)) drop-shadow(0 0 14px rgba(0, 180, 255, 0.3))",
    },
    "50%": {
      filter:
        "drop-shadow(0 0 8px rgba(213, 0, 186, 0.7)) drop-shadow(0 0 26px rgba(213, 0, 186, 0.45))",
    },
  },
  "@keyframes mdLogoGlitch": {
    "0%, 100%": { transform: "translate(0, 0) skewX(0deg)" },
    "90%": { transform: "translate(-4px, 0) skewX(-4deg)" },
    "91%": { transform: "translate(5px, 1px) skewX(3deg)" },
    "92%": { transform: "translate(-2px, -1px) skewX(0deg)" },
    "93%": { transform: "translate(0, 0) skewX(0deg)" },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

// ─── Efectos neón para el bloque "Seguinos en redes" ─────────────────
// (mismos que el bloque de fecha, con delays distintos para que no
//  respiren exactamente al mismo tiempo)

/** Caja: brillo celeste que sube y baja */
const NEON_BOX_MOTION = {
  animation: "mdNeonBreathe 3s ease-in-out -1.5s infinite",
  "@keyframes mdNeonBreathe": {
    "0%, 100%": {
      boxShadow: "5px 5px 0px #D500BA, 0 0 6px rgba(0, 180, 255, 0.25)",
    },
    "50%": {
      boxShadow: "5px 5px 0px #D500BA, 0 0 22px rgba(0, 180, 255, 0.75)",
    },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

/** Título: parpadeo de tubo fluorescente */
const TUBE_FLICKER = {
  animation: "mdTubeFlicker 6s linear -2.5s infinite",
  "@keyframes mdTubeFlicker": {
    "0%, 90%, 100%": { opacity: 1 },
    "92%": { opacity: 0.35 },
    "94%": { opacity: 1 },
    "96%": { opacity: 0.5 },
    "98%": { opacity: 1 },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

/** Textos: el glow celeste respira */
const TEXT_BREATHE = {
  textShadow: "0 0 8px rgba(0, 180, 255, 0.6)",
  animation: "mdTextBreathe 3s ease-in-out -1.5s infinite",
  "@keyframes mdTextBreathe": {
    "0%, 100%": { textShadow: "0 0 4px rgba(0, 180, 255, 0.4)" },
    "50%": {
      textShadow:
        "0 0 12px rgba(0, 180, 255, 0.95), 0 0 22px rgba(0, 180, 255, 0.5)",
    },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

// ─── Redes sociales (solo hover) ─────────────────────────────────────
const SOCIAL_HOVER = {
  "&:hover .social-icon": {
    bgcolor: "#00B4FF",
    color: "#03083B",
    transform: "translate(-2px, -2px)",
    boxShadow: "5px 5px 0px #D500BA",
  },
  "&:hover .social-icon svg": {
    animation: "mdIconPop 0.5s steps(5) 1",
    "@keyframes mdIconPop": {
      "0%": { transform: "scale(1) rotate(0deg)" },
      "50%": { transform: "scale(1.25) rotate(-8deg)" },
      "100%": { transform: "scale(1) rotate(0deg)" },
    },
    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
  },
};

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

/** Relojito con manecilla que gira (para el "FALTAN...") */
const ClockLoader = () => (
  <Box
    aria-hidden="true"
    sx={{
      width: { xs: 24, sm: 30, md: 36 },
      height: { xs: 24, sm: 30, md: 36 },
      flexShrink: 0,
      "& .clock-hand": {
        transformOrigin: "12px 12px",
        transformBox: "view-box",
        animation: "mdClockSpin 4s linear infinite",
      },
      "@keyframes mdClockSpin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      "@media (prefers-reduced-motion: reduce)": {
        "& .clock-hand": { animation: "none" },
      },
    }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00B4FF"
      strokeWidth="2"
      strokeLinecap="square"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2="16" y2="12" />
      <line className="clock-hand" x1="12" y1="12" x2="12" y2="5" />
    </svg>
  </Box>
);

/** Indicador REC parpadeando (esquina superior izquierda de una caja) */
const RecIndicator = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: "absolute",
      top: { xs: 10, sm: 12 },
      left: { xs: 14, sm: 18 },
      display: "flex",
      alignItems: "center",
      gap: 0.8,
    }}
  >
    <Box
      sx={{
        width: { xs: 8, sm: 10 },
        height: { xs: 8, sm: 10 },
        bgcolor: "#D500BA",
        boxShadow: "0 0 8px rgba(213, 0, 186, 0.9)",
        animation: "mdRecBlink 1.2s linear infinite",
        "@keyframes mdRecBlink": {
          "0%, 55%": { opacity: 1 },
          "56%, 100%": { opacity: 0.15 },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    />
    <Typography
      sx={{
        fontFamily: "'Omega Pixel BIFORM', monospace",
        fontSize: { xs: "0.65rem", sm: "0.8rem" },
        color: "#D500BA",
        letterSpacing: "0.15em",
        lineHeight: 1,
      }}
    >
      REC
    </Typography>
  </Box>
);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 1, sm: 1.5 },
          mb: 1.5,
        }}
      >
        <ClockLoader />
        <Typography
          sx={{
            fontFamily: "'Omega Pixel BIFORM', monospace",
            fontSize: { xs: "1rem", sm: "1.4rem", md: "1.7rem" },
            color: "#00B4FF",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          FALTAN
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              component="span"
              sx={{
                animation: "mdLoadingDots 1.4s linear infinite",
                animationDelay: `${i * 0.2}s`,
                "@keyframes mdLoadingDots": {
                  "0%, 20%": { opacity: 0.15 },
                  "40%, 100%": { opacity: 1 },
                },
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            >
              .
            </Box>
          ))}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.8, sm: 3, md: 4 },
          bgcolor: "#03083B",
          border: "2px solid #00B4FF",
          boxShadow: "4px 4px 0px #D500BA",
          borderRadius: 0,
          px: { xs: 1, sm: 3, md: 4 },
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
              minWidth: { xs: "auto", sm: "65px", md: "80px" },
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
      prevIndex === 0 ? WORKSHOP_IMAGES.length - 1 : prevIndex - 1,
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
          size="small"
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: 4, sm: 10 },
            transform: "translateY(-50%)",
            bgcolor: "#03083B",
            color: "#00B4FF",
            border: "1.5px solid #00B4FF",
            borderRadius: 0,
            boxShadow: "2px 2px 0px #D500BA",
            p: { xs: 0.5, sm: 1 },
            fontSize: { xs: "0.85rem", sm: "1.1rem" },
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
          size="small"
          sx={{
            position: "absolute",
            top: "50%",
            right: { xs: 4, sm: 10 },
            transform: "translateY(-50%)",
            bgcolor: "#03083B",
            color: "#00B4FF",
            border: "1.5px solid #00B4FF",
            borderRadius: 0,
            boxShadow: "2px 2px 0px #D500BA",
            p: { xs: 0.5, sm: 1 },
            fontSize: { xs: "0.85rem", sm: "1.1rem" },
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

// ─── Tarjetas de la sección Jornada (íconos SVG de MUI) ──────────────
const JORNADA_FEATURES = [
  {
    label: "IDEAS",
    Icon: LightbulbIcon,
    accent: "#00B4FF",
    shadow: "#D500BA",
    captionColor: "#03083B",
    motionSx: BULB_MOTION,
  },
  {
    label: "HERRAMIENTAS",
    Icon: BuildIcon,
    accent: "#D500BA",
    shadow: "#00B4FF",
    captionColor: "#FFFFFF",
    motionSx: WRENCH_MOTION,
  },
  {
    label: "POTENCIAR TU FUTURO",
    Icon: TrendingUpIcon,
    accent: "#00B4FF",
    shadow: "#D500BA",
    captionColor: "#03083B",
    motionSx: TREND_MOTION,
  },
];

/** Tarjeta con ícono arriba y barra de título abajo */
const FeatureTile = ({
  label,
  Icon,
  accent,
  shadow,
  captionColor,
  motionSx,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      bgcolor: "#03083B",
      border: `2px solid ${accent}`,
      boxShadow: `4px 4px 0px ${shadow}`,
    }}
  >
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 3, sm: 4 },
      }}
    >
      <Icon
        sx={{
          color: accent,
          fontSize: { xs: 60, sm: 68, md: 88 },
          ...motionSx,
        }}
      />
    </Box>
    <Box
      sx={{
        bgcolor: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: { sm: "3.5rem" },
        px: 1,
        py: 1,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Omega Pixel BIFORM', monospace",
          fontSize: { xs: "1rem", sm: "0.8rem", md: "1rem" },
          color: captionColor,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          lineHeight: 1.2,
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </Box>
  </Box>
);

// ─── Redes sociales ──────────────────────────────────────────────────
const FACEBOOK_URL =
  "https://www.facebook.com/TECNICOSUPERIORENMULTIMEDIA?locale=es_LA";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    label: "@TECNICOSUPERIORENMULTIMEDIA",
    href: "https://www.instagram.com/tecnicosuperiorenmultimedia",
    Icon: InstagramIcon,
  },
  {
    name: "WhatsApp",
    label: "341 - 6611509",
    href: "https://wa.me/5493416611509",
    Icon: WhatsAppIcon,
    labelSx: {
      fontSize: { xs: "1.25rem", sm: "1.5rem" },
      letterSpacing: "0.12em",
    },
  },
  {
    name: "Facebook",
    label: "TECNICO SUPERIOR EN MULTIMEDIA",
    href: FACEBOOK_URL,
    Icon: FacebookIcon,
  },
];

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
          top: { xs: "-2%", md: "5%" },
          right: { xs: "-60px", md: "1%" },
          width: { xs: "120px", sm: "200px", md: "320px" },
          opacity: { xs: 0.5, md: 0.85 },
          pointerEvents: "none",
          zIndex: 1,
          ...PIXELADO_MOTION,
        }}
      />

      {/* Cursor 3D — desplazado más a la derecha */}
      <Box
        component="img"
        src={cursorImg}
        alt="3D Cursor"
        sx={{
          position: "absolute",
          top: { xs: "290px", sm: "3%", md: "8%" },
          right: { xs: "3%", sm: "-5px", md: "1%" },
          width: { xs: "50px", sm: "90px", md: "160px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 10px 20px rgba(0, 180, 255, 0.35))",
          ...CURSOR_MOTION,
        }}
      />

      {/* Botón PLAY 3D — desplazado más a la izquierda */}
      <Box
        component="img"
        src={playImg}
        alt="3D Play Button"
        sx={{
          position: "absolute",
          top: { xs: "24%", md: "35%" },
          left: { xs: "-15px", md: "1%" },
          width: { xs: "45px", sm: "90px", md: "160px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 10px 20px rgba(213, 0, 186, 0.3))",
          ...PLAY_MOTION,
        }}
      />

      {/* Cruz / Más 3D — margen izquierdo del logo (simétrico al cursor) */}
      <Box
        component="img"
        src={masImg}
        alt="3D Cross Decoration"
        sx={{
          position: "absolute",
          top: { xs: "280px", sm: "3%", md: "8%" },
          left: { xs: "3%", sm: "-5px", md: "1%" },
          width: { xs: "50px", sm: "90px", md: "160px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 12px 25px rgba(3, 8, 59, 0.8))",
          ...MAS_MOTION,
        }}
      />

      {/* Recuadro 3D — abajo a la derecha (donde estaba la cruz) */}
      <Box
        component="img"
        src={recuadroImg}
        alt="3D Frame Decoration"
        sx={{
          position: "absolute",
          bottom: { xs: "1%", md: "4%" },
          right: { xs: "-40px", sm: "-50px", md: "-70px" },
          width: { xs: "60px", sm: "140px", md: "220px" },
          pointerEvents: "none",
          zIndex: 3,
          filter: "drop-shadow(0 12px 25px rgba(3, 8, 59, 0.8))",
          ...RECUADRO_MOTION,
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
        {/* 1. LOGO MULTIMEDIA DAY 2026 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: { xs: 5, sm: 6 },
          }}
        >
          <Box
            component="img"
            src={logoMD}
            alt="Multimedia Day 2026"
            sx={{
              width: "100%",
              maxWidth: { xs: "85%", sm: "520px", md: "620px" },
              height: "auto",
              display: "block",
              ...LOGO_FX,
            }}
          />
        </Box>

        {/* 4. BOTÓN ÚNICO DE ACCIÓN */}
        <Box
          sx={{
            mb: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: "0.85rem", sm: "1.1rem", md: "1.3rem" },
              color: "#D500BA",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(213, 0, 186, 0.5)",
              animation: "mdInscribetePulse 2.5s ease-in-out infinite",
              "@keyframes mdInscribetePulse": {
                "0%, 100%": {
                  textShadow: "0 0 6px rgba(213, 0, 186, 0.3)",
                },
                "50%": {
                  textShadow:
                    "0 0 14px rgba(213, 0, 186, 0.8), 0 0 28px rgba(213, 0, 186, 0.4)",
                },
              },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          >
            ¡Entrada gratuita con inscripción previa!
          </Typography>
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
            REGISTRATE AQUI ↓
          </Button>
        </Box>

        {/* 5. NO TE QUEDES AFUERA: FECHA, HORA Y LUGAR */}
        <Box
          sx={{
            position: "relative",
            maxWidth: "840px",
            width: "100%",
            mx: "auto",
            mb: { xs: 5, sm: 6 },
            px: { xs: 2, sm: 4 },
            pt: { xs: 4.5, sm: 4 },
            pb: { xs: 2.5, sm: 3.5 },
            bgcolor: "#03083B",
            border: "2px solid #00B4FF",
            boxShadow: "5px 5px 0px #D500BA",
            boxSizing: "border-box",
            // Neón que respira (brillo celeste que sube y baja)
            animation: "mdNeonBreathe 3s ease-in-out infinite",
            "@keyframes mdNeonBreathe": {
              "0%, 100%": {
                boxShadow:
                  "5px 5px 0px #D500BA, 0 0 6px rgba(0, 180, 255, 0.25)",
              },
              "50%": {
                boxShadow:
                  "5px 5px 0px #D500BA, 0 0 22px rgba(0, 180, 255, 0.75)",
              },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <CornerDots size={6} offset={-4} color="#00B4FF" />

          {/* Indicador REC parpadeando */}
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: { xs: 10, sm: 12 },
              left: { xs: 14, sm: 18 },
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <Box
              sx={{
                width: { xs: 8, sm: 10 },
                height: { xs: 8, sm: 10 },
                bgcolor: "#D500BA",
                boxShadow: "0 0 8px rgba(213, 0, 186, 0.9)",
                animation: "mdRecBlink 1.2s linear infinite",
                "@keyframes mdRecBlink": {
                  "0%, 55%": { opacity: 1 },
                  "56%, 100%": { opacity: 0.15 },
                },
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "0.65rem", sm: "0.8rem" },
                color: "#D500BA",
                letterSpacing: "0.15em",
                lineHeight: 1,
              }}
            >
              REC
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: "1rem", sm: "1.4rem", md: "1.7rem" },
              color: "#D500BA",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mb: { xs: 2.5, sm: 3 },
              animation: "mdTubeFlicker 6s linear infinite",
              "@keyframes mdTubeFlicker": {
                "0%, 90%, 100%": { opacity: 1 },
                "92%": { opacity: 0.35 },
                "94%": { opacity: 1 },
                "96%": { opacity: 0.5 },
                "98%": { opacity: 1 },
              },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          >
            NO TE QUEDES AFUERA
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-around",
              alignItems: "center",
              gap: { xs: 2.5, sm: 2 },
            }}
          >
            {[
              { value: "7 DE OCTUBRE", label: "FECHA" },
              { value: "19HS", label: "HORA" },
              { value: "BALCARCE 2640", label: "LUGAR" },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Omega Pixel BIFORM', monospace",
                    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.7rem" },
                    fontWeight: 800,
                    color: "#FFFFFF",
                    lineHeight: 1,
                    textShadow: "0 0 8px rgba(0, 180, 255, 0.6)",
                    animation: "mdTextBreathe 3s ease-in-out infinite",
                    "@keyframes mdTextBreathe": {
                      "0%, 100%": {
                        textShadow: "0 0 4px rgba(0, 180, 255, 0.4)",
                      },
                      "50%": {
                        textShadow:
                          "0 0 12px rgba(0, 180, 255, 0.95), 0 0 22px rgba(0, 180, 255, 0.5)",
                      },
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                      animation: "none",
                    },
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: { xs: "0.65rem", sm: "0.72rem", md: "0.82rem" },
                    fontWeight: 700,
                    color: "#D500BA",
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

        {/* 5b. CONTADOR REGRESIVO (7 DE OCTUBRE) */}
        <CountdownTimer />

        {/* 6a. JORNADA INSTITUCIONAL (sin caja de fondo) */}
        <Box
          sx={{
            maxWidth: "840px",
            mx: "auto",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: "1.3rem", sm: "1.8rem", md: "2.2rem" },
              color: "#00B4FF",
              letterSpacing: "0.06em",
              // Sombra dura magenta (mismo recurso que las cajas), sin movimiento
              textShadow: "3px 3px 0px #D500BA",
              mb: 1,
              textAlign: "center",
            }}
          >
            MULTIMEDIA WORKSHOP DAY
          </Typography>
          <Box
            sx={{
              position: "relative",
              bgcolor: "#03083B",
              border: "2px solid #D500BA",
              boxShadow: "4px 4px 0px #00B4FF",
              px: { xs: 3, sm: 4 },
              py: { xs: 2, sm: 2.5 },
              mt: 1.5,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <CornerDots size={6} offset={-4} color="#D500BA" />
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                color: "#DDE3EC",
                fontWeight: 400,
                textAlign: "center",
                textShadow: "0 0 8px rgba(213, 0, 186, 0.35)",
              }}
            >
              Un lugar para conectar...
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 3, sm: 2.5 },
              mt: { xs: 3.5, sm: 4.5 },
            }}
          >
            {JORNADA_FEATURES.map((feature) => (
              <FeatureTile key={feature.label} {...feature} />
            ))}
          </Box>
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
              p: { xs: 3, sm: 2.5, md: 3 },
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CornerDots size={6} offset={-4} color="#00B4FF" />
            <GroupsIcon
              sx={{ color: "#00B4FF", fontSize: 52, mb: 2, ...GROUPS_MOTION }}
            />
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "1.3rem", sm: "0.8rem", md: "1.15rem" },
                color: "#FFFFFF",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
                overflowWrap: "anywhere",
                mb: 1.5,
              }}
            >
              COMUNIDAD
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "1rem", sm: "0.85rem", md: "1rem" },
                color: "#DDE3EC",
                lineHeight: 1.5,
              }}
            >
              Conectá con estudiantes, docentes, profesionales y personas
              innovadoras. Llévate nuevos contactos e intercambia experiencias
              que sumen a tus intereses.
            </Typography>
          </Box>

          {/* Card 2: Inspiración */}
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #D500BA",
              boxShadow: "4px 4px 0px #00B4FF",
              p: { xs: 3, sm: 2.5, md: 3 },
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CornerDots size={6} offset={-4} color="#D500BA" />
            <LightbulbIcon
              sx={{ color: "#D500BA", fontSize: 52, mb: 2, ...BULB_MOTION }}
            />
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "1.3rem", sm: "0.8rem", md: "1.15rem" },
                color: "#FFFFFF",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
                overflowWrap: "anywhere",
                mb: 1.5,
              }}
            >
              INSPIRACIÓN
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "1rem", sm: "0.85rem", md: "1rem" },
                color: "#DDE3EC",
                lineHeight: 1.5,
              }}
            >
              Vení a descubrir nuevas formas de ver y hacer las cosas. Súmate a
              charlas y talleres pensados para despertar tu creatividad.
            </Typography>
          </Box>

          {/* Card 3: Aprendizaje */}
          <Box
            sx={{
              bgcolor: "#03083B",
              border: "2px solid #00B4FF",
              boxShadow: "4px 4px 0px #D500BA",
              p: { xs: 3, sm: 2.5, md: 3 },
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CornerDots size={6} offset={-4} color="#00B4FF" />
            <SchoolIcon
              sx={{ color: "#00B4FF", fontSize: 52, mb: 2, ...SCHOOL_MOTION }}
            />
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "1.3rem", sm: "0.8rem", md: "1.15rem" },
                color: "#FFFFFF",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
                overflowWrap: "anywhere",
                mb: 1.5,
              }}
            >
              APRENDIZAJE
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "1rem", sm: "0.85rem", md: "1rem" },
                color: "#DDE3EC",
                lineHeight: 1.5,
              }}
            >
              Adquirí conocimientos prácticos, historias reales y herramientas
              que te van a ayudar a sumergirte en la comunicación audiovisual.
            </Typography>
          </Box>
        </Box>

        {/* 7. SEGUINOS EN REDES (mismo estilo que "No te quedes afuera") */}
        <Box
          sx={{
            bgcolor: "#03083B",
            border: "2px solid #00B4FF",
            boxShadow: "5px 5px 0px #D500BA",
            p: { xs: 3, sm: 4 },
            pt: { xs: 5.5, sm: 5.5 },
            ...NEON_BOX_MOTION,
            maxWidth: "840px",
            mx: "auto",
            position: "relative",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 3, sm: 4, md: 5 },
            textAlign: "left",
          }}
        >
          <CornerDots size={6} offset={-4} color="#00B4FF" />

          <RecIndicator />

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Omega Pixel BIFORM', monospace",
                fontSize: { xs: "1.4rem", sm: "1.8rem" },
                color: "#D500BA",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                lineHeight: 1.2,
                mb: 1.5,
                ...TUBE_FLICKER,
              }}
            >
              SEGUINOS EN REDES
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontSize: { xs: "1rem", sm: "1.05rem" },
                color: "#DDE3EC",
                lineHeight: 1.5,
              }}
            >
              Conocé todo nuestro trabajo, proyectos, actividades y experiencias
              de alumnos y profesionales.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            {SOCIAL_LINKS.map(({ name, label, href, Icon, labelSx }) => (
              <Box
                key={name}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  textDecoration: "none",
                  ...SOCIAL_HOVER,
                }}
              >
                <Box
                  className="social-icon"
                  sx={{
                    width: { xs: 44, sm: 56 },
                    height: { xs: 44, sm: 56 },
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #00B4FF",
                    boxShadow: "3px 3px 0px #D500BA",
                    color: "#00B4FF",
                    transition:
                      "background-color 0.2s ease, color 0.2s ease, transform 0.15s steps(3), box-shadow 0.15s steps(3)",
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 26, sm: 32 } }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Neue Haas Grotesk', sans-serif",
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    fontWeight: 700,
                    color: "#FFFFFF",
                    minWidth: 0,
                    overflowWrap: "anywhere",
                    ...TEXT_BREATHE,
                    ...labelSx,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 8. FOOTER */}
        <Box
          component="footer"
          sx={{
            mt: { xs: 6, sm: 8 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Omega Pixel BIFORM', monospace",
              fontSize: { xs: "0.75rem", sm: "1rem", md: "1.15rem" },
              color: "#03083B",
              letterSpacing: "0.08em",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {/* La @ va en otra tipografía porque en la pixelada no se ve bien */}
            <Box
              component="span"
              sx={{
                fontFamily: "'Neue Haas Grotesk', sans-serif",
                fontWeight: 700,
              }}
            >
              @
            </Box>
            institutosuperiortecnicoenmultimedia2026
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
