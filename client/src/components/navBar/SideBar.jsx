import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { grey } from "@mui/material/colors";
import { css, styled } from "@mui/system";
import * as React from "react";
import logoBlanco from "../../assets/LogoBlanco.PNG";
import Appointments from "../../views/Appointments/Appointments";
import Dashboard from "../../views/Dashboard/Dashboard";


import { Link, Route, Routes, useLocation } from "react-router-dom";

const drawerWidth = 180;
const appHeight = 0;

export default function SideBar({ onLogout }) {
  const { pathname } = useLocation();

  const [open, setOpen] = React.useState(false);
  const [clientesOpen, setClientesOpen] = React.useState(false);
  const [serviciosOpen, setServiciosOpen] = React.useState(false);
  const [profesionalesOpen, setProfesionalesOpen] = React.useState(false);

  const handleOtherItemClick = () => {
    setOpen(false);
    setClientesOpen(false);
    setServiciosOpen(false);
    setProfesionalesOpen(false);
  };

  const openClientModal = () => {
    setClientesOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CssBaseline />
      

      <Drawer
        sx={{
          width: drawerWidth,
          zIndex: "0",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: codGray[930],
            border: "none",
          },
        }}
        variant="permanent"
        anchor="left">
        <div
          style={{
            position: "absolute",
            top: "10px",
            padding: "10px",
            width:'100%',
          }}>
        
          <img
            src={logoBlanco}
            style={{
              width: "100%",
              color:dell[500],
            }}
            alt="Logo Blanco"
          />
        </div>
        <Divider />
        <List>
          <ListItem
            key={"Appointments"}
            disablePadding
            sx={{
              bgcolor: pathname === "/" ? dell[500] : null,
              width: "100%",
            }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: pathname === "/" ? dell[950] : dell[50],
                width: "100%",
              }}>
              <ListItemButton
                sx={{ padding: "6px 12px" }}
                onClick={handleOtherItemClick}>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <HomeIcon
                    color="primary"
                    sx={{ color: pathname === "/" ? dell[950] : dell[50] }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Turnos"} />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem
            key={"Dashboard"}
            disablePadding
            sx={{
              bgcolor: pathname === "/Dashboard" ? dell[500] : null,
              width: "100%",
            }}>
            <ListItemButton
              sx={{
                padding: "6px 12px",
                color: pathname === "/Dashboard" ? dell[950] : dell[50],
                width: "100%",
              }}
              component={Link}
              to="/Dashboard">
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <DashboardIcon
                  color="primary"
                  sx={{
                    color: pathname === "/Dashboard" ? dell[950] : dell[50],
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={"Panel de control"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <LogoutButton
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "fit-content",
            bottom: "30px",
            position: "absolute",
          }}
          onClick={onLogout}>
          <LogoutIcon /> Salir
        </LogoutButton>
      </Drawer>

      <Box
        component="main"
        sx={{
          position: "fixed",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center", // Centrar horizontalmente
          alignItems: "center", // Centrar verticalmente
          ml: `${drawerWidth}px`,
          height: `calc(100vh - ${appHeight}px)`, // Altura que ocupa el restante de la pantalla
          width: `calc(100% - ${drawerWidth}px)`,
        }}>
        <Routes>
          <Route path="/" element={<Appointments />} />
          <Route
            path="/Dashboard"
            element={
              <Dashboard drawerWidth={drawerWidth} appHeight={appHeight} />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

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

const LogoutButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? green[900] : dell[50]};
    // border: 1px solid ${theme.palette.mode === "dark" ? green[700] : green[200]};
    border:none;
    color: ${theme.palette.mode === "dark" ? grey[200] : dell[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? green[800] : dell[500]};
      border-color: ${theme.palette.mode === "dark" ? green[600] : dell[300]};
      color: ${theme.palette.mode === "dark" ? green[600] : dell[950]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? green[700] : green[300]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? green[300] : green[200]};
      outline: none;
    }
  `
);

const green = {
  50: "#E7F6E7",
  100: "#C2E6C1",
  200: "#9DD69D",
  300: "#78C778",
  400: "#52B752",
  500: "#2DA82D",
  600: "#279927",
  700: "#208B20",
  800: "#1A751A",
  900: "#145E14",
};
