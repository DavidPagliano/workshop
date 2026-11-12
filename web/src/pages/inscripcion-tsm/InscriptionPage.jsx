import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  LinearProgress,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { tsmTheme } from "../../config/theme";
import { InscriptionForm } from "../../components/inscripcion-tsm2027/InscriptionForm";
import InscriptionSuccess from "../../components/inscripcion-tsm2027/InscriptionSuccess";
import { useInscriptionForm } from "../../hooks/useInscriptionForm";
import { inscriptionTSMService } from "../../services/inscriptionTSMService";
import logoTsm from "../../assets/images/logo-tsm.png";

const InscriptionTSMPage = () => {
  const navigate = useNavigate();
  const inscription = useInscriptionForm(inscriptionTSMService.createInscription);
  const { registration, progress, resetInscription } = inscription;

  return (
    <ThemeProvider theme={tsmTheme}>
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
            <Button variant="outlined" color="primary" onClick={() => navigate("/tsm")}>
              ← Volver al inicio
            </Button>
            <Box
              component="img"
              src={logoTsm}
              alt="TSM"
              sx={{ height: { xs: 36, sm: 44 }, objectFit: "contain" }}
            />
          </Box>

          <Fade in timeout={500}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 5 } }}>
                {registration ? (
                  <InscriptionSuccess
                    registration={registration}
                    onReset={resetInscription}
                    onExit={() => navigate("/tsm")}
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
                      Inscripción Ciclo Lectivo 2027 — TSM
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: { xs: 2.5, sm: 3.5 } }}
                    >
                      Completá los pasos: tu foto, tus datos principales, fotos de tu DNI, ficha médica, comprobante de pago y confirmación.
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

export default InscriptionTSMPage;
