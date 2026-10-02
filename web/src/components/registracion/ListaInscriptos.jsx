// src/components/registracion/ListaInscriptos.jsx
import { memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  ListItemButton,
  ListItemText,
  Chip,
  Grid,
} from "@mui/material";

// Alto fijo de cada fila: permite virtualizar la lista sin medir cada item.
const ROW_HEIGHT = 72;
// Filas extra por encima/debajo del viewport para evitar parpadeos al scrollear.
const OVERSCAN = 6;

/**
 * Fila individual memoizada: solo se re-renderiza si cambia su participante,
 * su estado de selección o el callback de selección.
 */
const InscriptoRow = memo(function InscriptoRow({
  participante,
  seleccionado,
  onSeleccionar,
}) {
  const { nombre, apellido, dni, seRegistro } = participante;

  return (
    <ListItemButton
      selected={seleccionado}
      onClick={() => onSeleccionar(participante)}
      sx={{
        height: ROW_HEIGHT,
        boxSizing: "border-box",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 1.5,
        "&.Mui-selected": {
          bgcolor: "rgba(0, 180, 255, 0.1)",
          borderLeft: "3px solid",
          borderColor: "primary.main",
        },
        "&:hover": {
          bgcolor: "rgba(0, 180, 255, 0.05)",
        },
      }}
    >
      <ListItemText
        primary={`${nombre} ${apellido}`}
        secondary={`DNI: ${dni}`}
        slotProps={{
          primary: {
            noWrap: true,
            sx: { fontWeight: 500 },
          },
          secondary: {
            noWrap: true,
            sx: { color: "text.secondary" },
          },
        }}
      />
      <Chip
        label={seRegistro ? "Presente" : "Pendiente"}
        color={seRegistro ? "success" : "default"}
        size="small"
        sx={{ borderRadius: 0 }}
      />
    </ListItemButton>
  );
});

const ListaInscriptos = ({
  participantesFiltrados,
  usuarioSeleccionado,
  onSeleccionar,
  resetScrollKey,
}) => {
  const containerRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(480);
  const [scrollTop, setScrollTop] = useState(0);

  // Mide el alto visible del contenedor (responsive) para calcular la ventana.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const update = () => setViewportHeight(el.clientHeight);
    update();

    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = participantesFiltrados.length;

  // Al cambiar el criterio de búsqueda, volver arriba.
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [resetScrollKey]);

  // Si la lista se acorta (p. ej. se elimina un registro), clampear el scroll.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxTop = Math.max(0, total * ROW_HEIGHT - el.clientHeight);
    if (el.scrollTop > maxTop) {
      el.scrollTop = maxTop;
      setScrollTop(maxTop);
    }
  }, [total]);

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    total,
    Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN,
  );
  const visibles = participantesFiltrados.slice(startIndex, endIndex);

  const seleccionadoId =
    usuarioSeleccionado?._id ?? usuarioSeleccionado?.registrarId;

  return (
    <Grid size={{ xs: 12, md: 5 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Inscriptos ({total})
      </Typography>

      <Paper
        ref={containerRef}
        variant="outlined"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        sx={{
          maxHeight: { xs: "calc(100vh - 320px)", md: 480 },
          overflow: "auto",
          border: "1.5px solid",
          borderColor: "primary.main",
          boxShadow: "4px 4px 0px rgba(213, 0, 186, 0.5)",
          borderRadius: 0,
          bgcolor: "background.paper",
        }}
      >
        {total === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No se encontraron personas con ese criterio.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: total * ROW_HEIGHT, position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: startIndex * ROW_HEIGHT,
                left: 0,
                right: 0,
              }}
            >
              {visibles.map((p) => {
                const key = p._id || p.registrarId;
                return (
                  <InscriptoRow
                    key={key}
                    participante={p}
                    seleccionado={
                      seleccionadoId === p._id ||
                      seleccionadoId === p.registrarId
                    }
                    onSeleccionar={onSeleccionar}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default memo(ListaInscriptos);
