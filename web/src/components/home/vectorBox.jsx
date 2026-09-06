import React from 'react';
import { Box } from '@mui/material';

export const VectorBox = ({ children, borderColor = '#D500BA', sx = {} }) => {
  const handleSize = 6;
  const handleStyle = {
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    bgcolor: '#03083B',
    border: `1.5px solid ${borderColor}`,
  };

  return (
    <Box sx={{ position: 'relative', border: `1.5px solid ${borderColor}`, ...sx }}>
      <Box sx={{ ...handleStyle, top: -4, left: -4 }} />
      <Box sx={{ ...handleStyle, top: -4, right: -4 }} />
      <Box sx={{ ...handleStyle, bottom: -4, left: -4 }} />
      <Box sx={{ ...handleStyle, bottom: -4, right: -4 }} />
      {children}
    </Box>
  );
};