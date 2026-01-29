import React from "react";
import { Box, styled, Typography, Button, Card, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DashboardBase = ({
  title,
  icon,
  buttonText,
  data,
  selectedId,
  onSelect,
  onEdit,
  onButtonClick,
  renderLeftItem,
  rightPanel,
}) => {
  return (
    <MainContainer>
      <HeaderContainer>
        <Typography sx={{ fontSize: "32px", fontWeight: 600 }}>
          {title}
        </Typography>

        <CustomButton onClick={onButtonClick}>
          {icon}
          {buttonText}
        </CustomButton>
      </HeaderContainer>

      <ContentContainer>
        {/* LEFT PANEL */}
        <LeftPanel>
          <LeftPanelList>
            {data.map((item) => (
              <LeftPanelCard
                key={item.id}
                selected={selectedId === item.id}
                onClick={() => onSelect(item)}
              >
                {renderLeftItem(item)}

                <ActionCardContainer>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item.id);
                    }}
                  >
                    <EditOutlinedIcon />
                  </IconButton>

                  <IconButton>
                    <DeleteOutlineIcon />
                  </IconButton>
                </ActionCardContainer>
              </LeftPanelCard>
            ))}
          </LeftPanelList>
        </LeftPanel>

        {/* RIGHT PANEL */}
        <RightPanel>{rightPanel}</RightPanel>
      </ContentContainer>
    </MainContainer>
  );
};

export default DashboardBase;

/* ================= STYLES ================= */

const MainContainer = styled(Box)({
  width: "100%",
  minHeight: "100vh",
  height:'100vh',
  display: "flex",
  flexDirection: "column",
  padding: "20px 40px",
  backgroundColor: "#EEEEEE",
  border:'1px solid red',
  
});

const HeaderContainer = styled(Box)({
  height: "120px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const ContentContainer = styled(Box)({
  flex: 1,
  display: "flex",
  gap: "20px",
  overflow: "hidden", 
  
});

const LeftPanel = styled(Box)({
  flex: 1,
  padding: "20px",
  backgroundColor: "#FBFBFB",
  borderRadius: "15px",
  boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
 // marginBottom:'10px'
  // overflow: "hidden",
 // paddingBottom: "12px", 
 // border:'1px solid blue'
});


const RightPanel = styled(Box)({
  width: "50%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const CustomButton = styled(Button)({
  width: "232px",
  height: "48px",
  display: "flex",
  justifyContent: "space-around",
  color: "#fff",
  background: "linear-gradient(90deg, #B985FF 0%, #5B2B99 100%)",
  textTransform: "none",
  borderRadius: "10px",
});

const LeftPanelList = styled(Box)({
   display: "flex",
  flexDirection: "column",
  gap: "10px",
  flex: 1,
  overflowY: "auto",

  /* Firefox */
  scrollbarWidth: "thin",
  scrollbarColor: "#B0B0B0 transparent",

  /* Chrome / Edge / Safari */
  "&::-webkit-scrollbar": {
    width: "1px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#C0C0C0",
    borderRadius: "0px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#A0A0A0",
  },
});



const LeftPanelCard = styled(Card)(({ selected }) => ({
  height: "80px",
  minHeight: "80px",      // 🔑
  flexShrink: 0,          // 🔑 CLAVE
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "rgba(237,237,237,0.5)",
  border: selected ? "1px solid #9441FF" : "1px solid transparent",
  borderRadius:'10px'
  
}));

const ActionCardContainer = styled(Box)({
  width: "80px",
  display: "flex",
  justifyContent: "space-between",
});
