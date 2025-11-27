import React, { useEffect } from "react";
import { RightPanelList , RightPanelHeaderContainer} from "../components/RightPanelList";
import { useSelector, useDispatch } from "react-redux";
import CardAppointment from "./CardAppointment";
import { getAppointments } from "../redux/slices/appointments/thunks";
import { Typography, Box, styled } from "@mui/material";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

const NextAppointmentsList = ({ selectedId, tenantId }) => {
const dispatch = useDispatch();

dayjs.extend(isSameOrAfter)

const today = dayjs();


const appointmentsState = useSelector((s) => s.appointment);
const appointments = (appointmentsState?.appointments || []).filter(app =>
  app.Professional.dni === selectedId &&
  dayjs(app.date).isSameOrAfter(today, 'day')
)

console.log('citas desde nextappointmentlist',appointmentsState);
console.log('citas desde appointments',appointments);
console.log('selectedId',selectedId);
console.log();





useEffect(() => {
if (tenantId) {
dispatch(getAppointments(tenantId));
}
}, [dispatch, tenantId]);

return ( 
  
   
    <RightPanelList>
 
<Typography
sx={{
textAlign: "left",
fontFamily: "Poppins",
fontSize: "22px",
marginBottom: "25px",
fontWeight: 600,
width:'100%',
}}
>
Próximas Citas </Typography>


  {appointments.length > 0 ? (  
    appointments.map((app) => <CardAppointment key={app.id} data={app} />)  
  ) : (  
    <EmptyContainer>  
      <Typography  
        sx={{ fontFamily: "Poppins", fontSize: "18px", color: "#555", marginBottom: "15px" }}  
      >  
        No hay citas Agendadas 
      </Typography>  
       
    </EmptyContainer>  
  )}  
</RightPanelList>  

 

);
};

export default NextAppointmentsList;

// ----- Estilos -----

const EmptyContainer = styled(Box)({
width: "100%",
minHeight: "150px",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
position: "relative",
overflow: "hidden",
backgroundColor: "#F5F5F5",
borderRadius: "10px",
});




