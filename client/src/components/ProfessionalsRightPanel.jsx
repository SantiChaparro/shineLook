import React from "react";
import { Box, Typography, styled } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NextAppointmentsList from "../components/NextAppointmentsList";
import EmptyState from "./EmptyState";

const ProfessionalRightPanel = ({
  selectedProfessional,
  rating,
  totalAmount,
  tenantId,
}) => {
  if (!selectedProfessional) return <EmptyState/>;

  return (
    <>
      <CardsContainer>
        {/* PROFILE */}
        <Card>
          <ProfileImage
            src={selectedProfessional.profileImage}
            alt={selectedProfessional.name}
          />
        </Card>

        {/* RATING */}
        <Card>
          <Typography>Rating</Typography>
          <Row>
            <IconCircle color="rgba(255,180,0,0.2)">
              <StarIcon sx={{ color: "#FFB400", fontSize: 45 }} />
            </IconCircle>
            <Typography sx={{ fontSize: 40 }}>
              {rating?.ratingAverage ?? "-"}
            </Typography>
          </Row>
        </Card>

        {/* INCOME */}
        <Card>
          <Typography>Ingresos</Typography>
          <Row>
            <IconCircle color="rgba(148,65,255,0.2)">
              <AttachMoneyIcon sx={{ color: "#9441FF", fontSize: 45 }} />
            </IconCircle>
            <Typography sx={{ fontSize: 40 }}>{totalAmount}</Typography>
          </Row>
        </Card>
      </CardsContainer>

      {/* NEXT APPOINTMENTS */}
      <NextAppointmentsList
        selectedId={selectedProfessional.id}
        tenantId={tenantId}
      />
    </>
  );
};

export default ProfessionalRightPanel;

/* ================= STYLES ================= */

const CardsContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
});

const Card = styled(Box)({
  width: "200px",
  height: "125px",
  backgroundColor: "#FBFBFB",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
});

const Row = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "15px",
});

const IconCircle = styled(Box)(({ color }) => ({
  backgroundColor: color,
  borderRadius: "50%",
  padding: "5px",
}));

const ProfileImage = styled("img")({
  width: "115px",
  height: "115px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "1px solid #9441FF",
});
