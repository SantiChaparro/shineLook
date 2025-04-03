import {
  Menu,
  MenuItem,
  styled,
  Typography
} from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import * as React from "react";

const dell = {
  50: "#f1fce9",
  100: "#e0f8cf",
  200: "#c2f2a4",
  300: "#9ae86e",
  400: "#77d942",
  500: "#57bf23",
  600: "#409818",
  700: "#337417",
  800: "#2e6119",
  900: "#284e19",
  950: "#112b08",
};

const codGray = {
  50: "#f7f7f6",
  100: "#e5e4e2",
  200: "#cac9c5",
  300: "#a8a7a0",
  400: "#85847c",
  500: "#6b6a61",
  600: "#54544d",
  700: "#454540",
  800: "#3a3935",
  900: "#32322f",
  930: "#161F1D",
  950: "#0b0b0a",
};
const StyledMenuItem = styled(MenuItem)({

  backgroundColor: "transparent",
    width: "100%",
  "&:hover": {
    
    backgroundColor: `${dell[500]}`,
  },
 
});

const MenuContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "60px", // Espacio entre elementos
position:'fixed',
  width: "100%",
 
  backgroundColor: `${codGray[930]}`,
  borderBottom: `2px solid ${dell[500]}`,
});

const StyledDiv = styled("div")({
  height: "100%",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  transition: "box-shadow 0.3s", // Ajuste de la transición
  "&:hover": {
    cursor: "pointer",
    boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.1)", // Efecto de sombra al hacer hover
    backgroundColor: `${dell[900]}`,
  },
});



const DashboardNavBar = ({ onOpcionSeleccionada, optionSelected }) => {
  
  return (
    
    <MenuContainer>
      <PopupState variant="popover" popupId="clientes-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <div
              sx={{
                border: "solid 2px red",
                display: "flex",
                flexDirection: "row",
              }}>
              <StyledDiv
                onClick={() => onOpcionSeleccionada("clientes")}
                sx={{
                  bgcolor:( optionSelected === "clientes" ||  optionSelected === "agregar_cliente" ) ? dell[500] : null,
                }}>
                <Typography
                  variant="h7"
                  // color="inherit"
                  sx={{
                    color: ( optionSelected === "clientes" ||  optionSelected === "agregar_cliente" ) ? dell[950] : dell[50],
                  }}
                  {...bindTrigger(popupState)}
                  noWrap>
                  Clientes
                </Typography>
              </StyledDiv>
            </div>
            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              sx={{ marginTop: "15px"}}>
              <StyledMenuItem
                onClick={() => {
                  onOpcionSeleccionada("agregar_cliente");
                  popupState.close();
                }}>
                Agregar cliente
              </StyledMenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>

      <PopupState variant="popover" popupId="servicios-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <StyledDiv
              onClick={() => onOpcionSeleccionada("servicios")}
              sx={{
                bgcolor: (optionSelected === "servicios" ||  optionSelected === "agregar_servicio") ? dell[500] : null,
              }}>
              <Typography
                variant="h7"
                // color="inherit"
                sx={{
                  color: (optionSelected === "servicios" ||  optionSelected === "agregar_servicio") ? dell[950] : dell[50],
                }}
                noWrap
                {...bindTrigger(popupState)}>
                Servicios
              </Typography>
            </StyledDiv>

            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              sx={{ marginTop: "15px" }}>
              <StyledMenuItem
                onClick={() => {
                  onOpcionSeleccionada("agregar_servicio");
                  popupState.close();
                }}>
                Agregar servicio
              </StyledMenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>

      <PopupState variant="popover" popupId="profesionales-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <StyledDiv
              onClick={() => onOpcionSeleccionada("profesionales")}
              sx={{
                bgcolor: (optionSelected === "profesionales" || optionSelected === "agregar_profesional") ? dell[500] : null,
              }}>
              <Typography
                variant="h7"
                // color="inherit"
                sx={{
                  color:
                  (optionSelected === "profesionales" || optionSelected === "agregar_profesional") ? dell[950] : dell[50],
                }}
                noWrap
                {...bindTrigger(popupState)}>
                Profesionales
              </Typography>
            </StyledDiv>

            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              sx={{ marginTop: "15px" }}>
              <StyledMenuItem
                onClick={() => {
                  onOpcionSeleccionada("agregar_profesional");
                  popupState.close();
                }}>
                Agregar Profesional
              </StyledMenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      <StyledDiv
        onClick={() => onOpcionSeleccionada("comisiones")}
        sx={{
          bgcolor: optionSelected === "comisiones" ? dell[500] : null,
        }}>
        <Typography
          variant="h7"
          // color="inherit"
          sx={{
            color: optionSelected === "comisiones" ? dell[950] : dell[50],
          }}
          noWrap>
          Comisiones
        </Typography>
      </StyledDiv>
    </MenuContainer>
    // </CenteredToolbar>
    // </AppBar>
  );
};

export default DashboardNavBar;
