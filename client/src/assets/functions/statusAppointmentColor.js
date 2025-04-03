const statusAppointmentColor = (costService, payValue, attended) => {


  if (costService === payValue ) {

    if (attended === "Si") {
        
     return "green";
    }
    else {
        if (attended === "No") {

            return "blue";
        }
        else{
            return "orange";
        }
    }
  }else{

    if(attended === "No") {
        return "blue"
    }else{
        return "red"
    }

  }
};

export default statusAppointmentColor;
