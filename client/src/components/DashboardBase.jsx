import React, { useEffect, useState, useRef } from "react";
import { Box, styled, Typography, Button, Card } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NextAppointmentsList from "./NextAppointmentsList";
import IconButton from '@mui/material/IconButton';

//import NextAppointmentsList from "./RightPanelList";


const DashboardBase = ({title,icon,buttonText,leftPanelData,selectedId, setSelectedId,tenantId,setEditingId}) => {
    console.log('leftpanelData',leftPanelData);
    
  return (
    <MainContainer>
        <HeaderContainer>
            <Typography sx={{fontSize:'32px',fontWeight:600,fontFamily:'poppins'}}>{title}</Typography>
            <CustomButton >
                {icon}
                {buttonText}
            </CustomButton>
        </HeaderContainer>
        <ContentContainer>
            <LeftPanel>
                <LeftPanelList>
                   {leftPanelData.map(item => (
                   <LeftPanelCards
                      key={item.id}
                      selected={selectedId === item.Professional.dni}
                      onClick={() => setSelectedId(item.Professional.dni)} // solo selecciona la card
                    >
  <Typography>{item.Professional.name}</Typography>
  <Typography>{item.Professional.dni}</Typography>

  <ActionCardContainer>
    <IconButton
      onClick={(e) => {
        e.stopPropagation(); // evita que el click seleccione la card
        setEditingId(item.Professional.dni); // abre el modal
      }}
    >
      <EditOutlinedIcon />
    </IconButton>
    <IconButton>
      <DeleteOutlineIcon />
    </IconButton>
  </ActionCardContainer>
</LeftPanelCards>
                         ))}
                </LeftPanelList>
            </LeftPanel>
            
            <RightPanel>
              
                <RightPanelCardsContainer>
                  <RightPanelCards
                  selectedId={selectedId}
                  >
                   {leftPanelData
                    .filter(item => item.Professional.dni === selectedId)
                    .map(filteredItem => (
                      <ProfileImage
                        key={filteredItem.id}
                        src={filteredItem.Professional.profileImage}
                        alt={filteredItem.Professional.name}
                        
                      />
                    ))}
                    
                  </RightPanelCards>
                  <RightPanelCards></RightPanelCards>
                  <RightPanelCards></RightPanelCards>
                </RightPanelCardsContainer>
                
               <NextAppointmentsList selectedId={selectedId} tenantId={tenantId} />

            </RightPanel>

        </ContentContainer>
    </MainContainer>
  )
}


export default DashboardBase

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch', // importante para que los paneles ocupen todo el ancho
  justifyContent: 'flex-start', // no centrar verticalmente
  padding: '20px 40px',
  boxSizing: 'border-box',
  backgroundColor:'#EEEEEE'
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
 width: '100%',
 minHeight: '150px',
 display: 'flex',
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent:'space-between',
 //border:'1px solid #E0E0E0',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: 1, // que ocupe todo el espacio restante
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch', // estira paneles al 100% vertical
  justifyContent: 'space-between',
  gap: '20px',
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch', // estira el contenido horizontalmente
  justifyContent: 'flex-start', // evita que los elementos se separen verticalmente
  padding: '20px',
  backgroundColor: '#FBFBFB',
  borderRadius: '15px',
  boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
}));

const RightPanel = styled(Box)(({ theme }) => ({
  width:'50%',
  minHeight:'100%',
  //flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  //padding: '20px',
  //backgroundColor: 'transparent',
  borderRadius: '15px',
  borderr:'1px solid  red',
  gap: '20px',
  //boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
}));

const CustomButton = styled(Button)(({ theme }) => ({
 width: '232px',
 height: '48px',
 display: 'flex',
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent:'space-around',
 padding:'5px',
 color: '#fff',
 background: 'linear-gradient(90deg, #B985FF 0%, #5B2B99 100%)',
 textTransform: 'none',
 fontFamily: 'arial',
 fontSize:'18px',
 fontWeight:400,
 borderRadius:'10px',
 boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",

  
  '&:hover': {
    background: 'linear-gradient(90deg, #A66DF8 0%, #51248A 100%)',
  },
}));

const LeftPanelList = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: 1, // que ocupe todo el espacio vertical del panel
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  overflowY: 'auto',
  overflowX: 'hidden',
  gap: '10px',
  backgroundColor: 'transparent',
}));

const LeftPanelCards = styled(Card)(({ selected }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: '80px',
  padding: '15px',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: 'rgba(237, 237, 237, 0.5)',
  transition: '0.2s ease',

  border: selected ? '1px solid #9441FF' : '1px solid transparent',
  boxShadow: selected
    ? '0px 4px 4px rgba(148, 65, 255, 0.25)'
    : 'none',

  '&:hover': {
    backgroundColor: '#F7F3FF',
  },
}));


const ActionCardContainer = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  
}));


const RightPanelCardsContainer = styled(Box)(({ theme }) => ({
 width: '100%',
 height: 'auto',
 display: 'flex',
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'space-between',
 gap: '20px',

}));

const RightPanelCards = styled(Box)({
width: "200px",
height: "125px",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
backgroundColor: "#FBFBFB",
borderRadius: "15px",
boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
padding:'20px'
});

const ProfileImage = styled('img')(({ theme }) => ({
  width: '115px',
  height: '115px',
  borderRadius: '50%',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',      // hace que sea circular
  objectFit: 'cover',       // mantiene proporción sin deformar
  border: `1px solid #9441FF`, // borde opcional
   boxShadow: '0px 4px 4px rgba(148, 65, 255, 0.25)',  // sombra suave
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)', // efecto al pasar el mouse
  }
}));



