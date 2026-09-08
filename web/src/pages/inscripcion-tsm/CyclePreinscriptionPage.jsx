import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, Paper, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { getPreCycleRegistrations, registerToPreCycle } from '../../services/preCycleService';
import { PreInscripcionModal } from './PreInscripcionModal';

// ─── Assets de fondo y decoración ────────────────────────────────────
import bgGrid from "../../assets/images/fondo/FONDO3.png";
import cursorImg from "../../assets/images/CURSOR.png";
import masImg from "../../assets/images/MAS.png";
import playImg from "../../assets/images/PLAY.png";
import pixeladoImg from "../../assets/images/pixelado.png";

export const CyclePreinscriptionPage = () => {
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchRecords = async () => {
    try {
      const data = await getPreCycleRegistrations();
      setList(data || []);
    } catch (error) {
      toast.error(error.message || 'Error al cargar pre-inscripciones');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await registerToPreCycle(formData);
      toast.success('Pre-inscripción registrada con éxito');
      setOpenModal(false);
      fetchRecords();
    } catch (error) {
      toast.error(error.message || 'Error al registrar pre-inscripción');
    }
  };

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
      {/* ELEMENTOS FLOTANTES DECORATIVOS (Fondo)                       */}
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
          zIndex: 1,
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
          zIndex: 1,
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
          zIndex: 1,
          opacity: { xs: 0.4, sm: 0.7, md: 1 },
          filter: "drop-shadow(0 15px 30px rgba(3, 8, 59, 0.8))",
        }}
      />

      {/* ============================================================= */}
      {/* CONTENIDO PRINCIPAL DE LA PÁGINA                              */}
      {/* ============================================================= */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Encabezado y acciones principales */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: '#00e5ff', fontWeight: 'bold' }}>
              Gestión de Pre-inscripciones
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#8fa0dd' }}>
              Ciclo 2027 — {list.length} inscriptos
            </Typography>
          </Box>

          <Box display="flex" gap={1.5} alignItems="center">
            <IconButton 
              onClick={fetchRecords} 
              sx={{ color: '#00e5ff', border: '1px solid #00e5ff', borderRadius: 1 }}
            >
              <RefreshIcon />
            </IconButton>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                bgcolor: '#00e5ff',
                color: '#03083b',
                fontWeight: 'bold',
                boxShadow: '3px 3px 0px #d500ba',
                '&:hover': { bgcolor: '#00b4ff' }
              }}
            >
              AGREGAR
            </Button>
          </Box>
        </Box>

        {/* Contenedor central (Estado vacío o lista) */}
        {list.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              backgroundColor: '#12193b',
              border: '2px solid #2b3566',
              boxShadow: '4px 4px 0px #d500ba',
              borderRadius: 1
            }}
          >
            <Typography mb={3} sx={{ color: '#00e5ff' }}>
              No hay pre-inscripciones registradas.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                color: '#00e5ff',
                borderColor: '#00e5ff',
                borderWidth: 2,
                fontWeight: 'bold',
                '&:hover': { borderColor: '#00b4ff', borderWidth: 2 }
              }}
            >
              AGREGAR LA PRIMERA
            </Button>
          </Paper>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {list.map((item) => (
              <Paper
                key={item.registrarId || item._id}
                sx={{
                  p: 2,
                  backgroundColor: '#12193b',
                  border: '1px solid #00e5ff',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: '#00e5ff' }}>
                    {item.nombre} {item.apellido}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8fa0dd' }}>
                    DNI: {item.dni} | Teléfono: {item.telefono}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ color: '#d500ba', fontWeight: 'bold' }}>
                  ID: {item.registrarId}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Modal emergente para registrar */}
        <PreInscripcionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleCreate}
        />
      </Container>
    </Box>
  );
};