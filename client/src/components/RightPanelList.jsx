import { Box, styled } from '@mui/material';

export const RightPanelList = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px',
  overflowY: 'auto',
  overflowX: 'hidden',
  gap: '10px',
  backgroundColor: '#FBFBFB',
  borderRadius:'15px',
  padding: '20px',
  boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
}));

export const RightPanelHeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'colrow',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '25px',
  backgroundColor: '#FBFBFB',
  
  
}));