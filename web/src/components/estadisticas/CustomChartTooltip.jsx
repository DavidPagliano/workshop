import { Box, Typography } from "@mui/material";

export const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Box
        sx={{
          bgcolor: "#03083B",
          border: "1.5px solid #00B4FF",
          p: 1.2,
          boxShadow: "3px 3px 0px #D500BA",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Omega Pixel BIFORM', monospace",
            fontSize: "0.85rem",
            color: "#FFFFFF",
          }}
        >
          {data.name}: {data.value}
        </Typography>
      </Box>
    );
  }
  return null;
};
