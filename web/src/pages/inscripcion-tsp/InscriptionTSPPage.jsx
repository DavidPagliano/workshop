import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  LinearProgress,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { tspTheme } from "../../config/theme";
import { InscriptionForm } from "../../components/inscripcion-tsp/InscriptionForm";
import InscriptionSuccess from "../../components/inscripcion-tsp/InscriptionSuccess";
import { useInscriptionForm } from "../../hooks/useInscriptionForm";
import { inscriptionTSPService } from "../../services/inscriptionTSPService";

const InscriptionTSPPage = () => {
  const navigate = useNavigate();
  const inscription = useInscriptionForm(
    inscriptionTSPService.createInscription,
  );
  const { registration, progress, resetInscription } = inscription;

  return (
    <ThemeProvider theme={tspTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
          bgcolor: "background.default",
          color: "text.primary",
          pt: { xs: 2.5, sm: 3.5, md: 5 },
          pb: { xs: 5, sm: 7, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              boxSizing: "border-box",
              px: { xs: 1, sm: 0.5 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/tsp")}
            >
              ← Volver
            </Button>
            <Chip
              label="TSP · 2027"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, letterSpacing: "0.05em" }}
            />
          </Box>

          <Fade in timeout={500}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 5 } }}>
                {registration ? (
                  <InscriptionSuccess
                    registration={registration}
                    onReset={resetInscription}
                    onExit={() => navigate("/tsp")}
                  />
                ) : (
                  <Box>
                    <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Progreso de inscripción
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "secondary.main", fontWeight: 800 }}
                        >
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color="secondary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Typography
                      component="h1"
                      variant="h4"
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                        mb: 1,
                      }}
                    >
                      Inscripción Ciclo Lectivo 2027 — TSP
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: { xs: 2.5, sm: 3.5 } }}
                    >
                      Tecnico Superior en Periodismo — Completá los pasos: tu
                      foto, datos principales, fotos de tu DNI, ficha médica,
                      comprobante de pago y confirmación.
                    </Typography>

                    <InscriptionForm {...inscription} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default InscriptionTSPPage;
