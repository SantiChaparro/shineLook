import React from 'react';
import { Box, Typography, styled } from "@mui/material";
import dayjs from 'dayjs';

const CardAppointment = ({ data }) => {

  // Combinar date y time en un objeto Date completo
  const dateTime = dayjs(`${data.date}T${data.time}`);

  const formattedDate = dateTime.format('DD/MM/YY'); // dd/mm/yy
  const formattedTime = dateTime.format('HH:mm');    // hh:mm en 24h

  return (
    <CardContainer>
      <Container>
        <BlackText>{data.Service.service_name}</BlackText>
        <GreyText>{data.Client.name}</GreyText>
      </Container>
      <Container>
        <BlackText>fecha:</BlackText>
        <GreyText>{formattedDate} - {formattedTime}</GreyText>
      </Container>
    </CardContainer>
  )
}

export default CardAppointment;

// Styled Components
const CardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '80px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px',
  backgroundColor: 'rgba(237, 237, 237, 0.5)',
  boxShadow: '-3px 0px 0px 0px #9441FF',
  borderRadius: '5px'
}));

const Container = styled(Box)(({ theme }) => ({
  width: 'auto',
  height: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '5px',
  backgroundColor: 'transparent',
  textAlign: 'left'
}));

const BlackText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: '14px',
  fontWeight: '500',
  color: '#000000',
}));

const GreyText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: '14px',
  fontWeight: '500',
  color: '#656565',
}));
