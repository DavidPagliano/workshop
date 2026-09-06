import { Box, Typography, Stack } from "@mui/material";

const items = [
  { num: "01", title: "charlas", symbol: "→" },
  { num: "02", title: "Talleres", symbol: "✿" },
  { num: "03", title: "Muestras", symbol: "✱" },
  { num: "04", title: "Tips", symbol: "✕" },
];

export const SchedulePanel = () => {
  return (
    <Box
      sx={{
        bgcolor: "#071052",
        border: { xs: "1.5px solid #00B4FF", sm: "2px solid #00B4FF" },
        p: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: {
          xs: "4px 4px 0px #D500BA",
          sm: "6px 6px 0px #D500BA",
        },
        maxWidth: { xs: "100%", sm: 420 },
        width: { xs: "100%", sm: "auto" },
        minWidth: { sm: 320 },
        mx: "auto",
      }}
    >
      <Stack spacing={{ xs: 1.2, sm: 1.8 }}>
        {items.map((item, idx) => (
          <Box
            key={item.num}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom:
                idx !== items.length - 1
                  ? "1px solid rgba(0, 180, 255, 0.2)"
                  : "none",
              pb: { xs: 0.8, sm: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {item.symbol === "→" && (
                <Typography
                  sx={{
                    fontFamily: "'Omega Pixel BIFORM', monospace",
                    color: "#00B4FF",
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  }}
                >
                  →
                </Typography>
              )}
              <Box
                sx={{
                  bgcolor: "#D500BA",
                  color: "#FFFFFF",
                  px: { xs: 0.6, sm: 0.8 },
                  py: 0.1,
                  fontFamily: "'Omega Pixel BIFORM', monospace",
                  fontSize: { xs: "0.75rem", sm: "0.9rem" },
                  fontWeight: "bold",
                }}
              >
                {item.num}
              </Box>
              <Typography
                sx={{
                  fontFamily:
                    item.num === "01"
                      ? "'Omega Pixel BIFORM', monospace"
                      : "'Neue Haas Grotesk', sans-serif",
                  fontSize: { xs: "0.95rem", sm: "1.15rem" },
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                }}
              >
                {item.title}
              </Typography>
            </Box>

            {item.symbol !== "→" && (
              <Typography
                sx={{
                  fontFamily: "'Omega Pixel BIFORM', monospace",
                  color: item.num === "02" ? "#D500BA" : "#00B4FF",
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                }}
              >
                {item.symbol}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
