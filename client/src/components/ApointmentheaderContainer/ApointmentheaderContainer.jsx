import React from "react";
import { Box, Button, Typography ,styled} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";

const ApointmentheaderContainer = ({currentDate, setCurrentDate, onPrev, onNext, onToday}) => {
  return (
   <AppointmentsContainer>
<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
  <DatePicker
    value={currentDate}
    onChange={(newDate) => setCurrentDate(newDate)}
    slotProps={{
      textField: {
        sx: {
          backgroundColor: "#F6F5F5",
          borderRadius: "8px",
          width: "208px",
          border: "1px solid #D4D2D2",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { border: "none" },
            "& input": {
              color: "#7D7D7D", // 👈 color de texto del input
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#7D7D7D",
              opacity: 1, // asegura que el color se vea
            },
          },
        },
        size: "small",
      },
    }}
  />
</LocalizationProvider>

      <Box sx={{ display: "flex", gap: 1 }}>
        
        <Button
          variant="contained"
          onClick={onPrev}
          sx={{
            bgcolor: "#FFFFFF",
            color: "#7D7D7D",
            fontWeight: 400,
             fontFamily: 'Poppins',
             textTransform: "none", 
            "&:hover": { bgcolor: "#f3e9ff" },
          }}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          onClick={onToday}
          sx={{
            bgcolor: "#FFFFFF",
            color: "#7D7D7D",
            fontWeight: 400,
            fontFamily: 'Poppins',
             textTransform: "none", 
            "&:hover": { bgcolor: "#f3e9ff" },
          }}
        >
          Today
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          sx={{
            bgcolor: "#FFFFFF",
            color: "#7D7D7D",
             fontFamily: 'Poppins',
            fontWeight: 400,
             fontFamily: 'Poppins',
             textTransform: "none", 
            "&:hover": { bgcolor: "#f3e9ff" },
          }}
        >
          Next
        </Button>
      </Box>
      
    
   </AppointmentsContainer>
  )
}

export default ApointmentheaderContainer

const AppointmentsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100px",
 // border: "1px solid #E0E0E0",

  
  
  // responsive layout
  [theme.breakpoints.down("md")]: {
   
  },
}));