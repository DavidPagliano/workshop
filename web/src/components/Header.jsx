import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import logoImage from '../assets/images/MAS.png';
import coverImage from '../assets/images/CURSOR.png';

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 2, sm: 4 },
        py: { xs: 2, sm: 2.5 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(110deg, rgba(3, 8, 59, 0.98), rgba(28, 25, 133, 0.94))',
      }}
    >
      <Box
        component="img"
        src={coverImage}
        alt=""
        sx={{
          position: 'absolute',
          right: { xs: -34, sm: 12 },
          top: -54,
          width: { xs: 170, sm: 230 },
          opacity: 0.22,
          transform: 'rotate(-8deg)',
          pointerEvents: 'none',
        }}
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={logoImage}
          alt="Multimedia Day"
          sx={{ width: { xs: 52, sm: 64 }, height: { xs: 52, sm: 64 }, objectFit: 'contain' }}
        />
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <EventAvailableIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="overline" sx={{ color: 'primary.main', lineHeight: 1 }}>
              Multimedia Day 2026
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            Mesa de entrada
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}