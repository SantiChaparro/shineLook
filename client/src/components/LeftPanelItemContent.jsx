import React from 'react'
import { Box, Typography, styled } from "@mui/material";

const LeftPanelItemContent = ({ name, dni }) => {
  return (
    <Box sx={{width:'60%',display:'flex',alignItems:'center',justifyContent:'space-between',boxSizing:'border-box'}}>
      <Typography variant="subtitle1">
        {name}
      </Typography>

      {dni && (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          DNI: {dni}
        </Typography>
      )}
    </Box>
  );
}

export default LeftPanelItemContent