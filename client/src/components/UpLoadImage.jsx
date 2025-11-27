import React from 'react'
import { Box, styled } from '@mui/material';

const UpLoadImage = ({setFile}) => {
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

  return (
    <UploadImageContainer>
        <input type="file"
         onChange={handleFileChange}   
        />
        
    </UploadImageContainer>
  )
}

export default UpLoadImage

const UploadImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // importante para que los paneles ocupen todo el ancho
  //justifyContent: 'space-between', // no centrar verticalmente
  
  boxSizing: 'border-box',
  backgroundColor:'transparent'
}));