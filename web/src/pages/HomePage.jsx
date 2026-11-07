import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, ThemeProvider } from "@mui/material/styles";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useNavigate } from "react-router-dom";

import { institutionalTheme } from "../config/theme";
import logoTsm from "../assets/images/logo-tsm.png";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={institutionalTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Fade in timeout={600}>
            <Card>
              <CardContent
                sx={{
                  p: { xs: 3.5, sm: 5, md: 6 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src={logoTsm}
                  alt="Logo TSM"
                  sx={{
                    height: { xs: 64, sm: 80 },
                    objectFit: "contain",
                    mb: 3,
                  }}
                />

                <Chip
                  icon={<AutoAwesomeOutlinedIcon fontSize="small" />}
                  label="EN CONSTRUCCIÓN"
                  color="secondary"
                  size="small"
                  sx={(theme) => ({
                    mb: 2,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: "secondary.main",
                    "& .MuiChip-icon": { color: "secondary.main" },
                  })}
                />

                <Typography
                  component="h1"
                  variant="h3"
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.35rem", md: "2.6rem" },
                    lineHeight: 1.15,
                    mb: 1.5,
                  }}
                >
                  Próximamente nueva web del TSM
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    maxWidth: 440,
                    mb: 4,
                  }}
                >
                  Estamos renovando nuestro sitio institucional de la Tecnicatura
                  Superior en Multimedia. Mientras tanto, podés acceder a los
                  portales activos:
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SchoolOutlinedIcon />}
                    onClick={() => navigate("/tsm")}
                    sx={{ flex: 1, minHeight: 50 }}
                  >
                    Inscripción Ciclo 2027
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<EventOutlinedIcon />}
                    onClick={() => navigate("/workshop")}
                    sx={{ flex: 1, minHeight: 50 }}
                  >
                    Workshop 2026
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
