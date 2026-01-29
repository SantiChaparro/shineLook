

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
import  React,{useState} from "react";
import logoBlanco from "../../assets/LogoBlanco.PNG";
import Turnero from "../../views/Turnero/Turnero";
import Dashboard from "../../views/Dashboard/Dashboard";
import Whatsapp from "../../views/whatsapp/Whatsapp";
import Clientes from "../../views/Customers/Customers";
import Profesionales from "../../views/profetionals/Professionals";
import Servicios from "../../views/Services/Services";
import Comisiones from "../../views/Commissions/Commissions";
import {jwtDecode} from 'jwt-decode';
import { useSelector } from "react-redux";
import CommissionsContainer from "../CommissionContainer";

import { Link, Route, Routes, useLocation } from "react-router-dom";

const drawerWidth = 240;
const appHeight = 0;

export default function SideBar({ onLogout, selectedtenant }) {
  const { pathname } = useLocation();
  const selectedTenant = useSelector((state) => state.tenant.tenantId);

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const token = loggedUser?.tokken;
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;

  console.log("=== DEBUG TOKENS ===");
console.log("loggedUser:", loggedUser);
console.log("token desde loggedUser:", loggedUser?.tokken);
console.log("token correcto:", token);
console.log('decoded token',decodedToken);


  const isActive = (path) => pathname === path;
  const bg = (path) => (isActive(path) ? "#9441FF40" : "transparent");
  const color = (path) => (isActive(path) ? "#9441FF" : "#000000");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%",alignItems:'center', justifyContent:'center',backgroundColor:'#EEEEEE', boxSizing:'border-box',border:'1px solid blue'}}>
      <CssBaseline />

     <Drawer
  sx={{
    width: drawerWidth,
    height: '100%',
    zIndex: 0,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent:'center',
      width: drawerWidth,
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: '30px',
      borderBottomLeftRadius: '30px',
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // <--- sombra suave
    },
  }}
  variant="permanent"
  anchor="left"
>
        {/* Logo */}
        {/* <div style={{ position: "absolute", top: "10px", padding: "10px", width: "100%" }}>
          <img src={logoBlanco} style={{ width: "100%" }} alt="Logo Blanco" />
        </div> */}

        <Divider sx={{ mt: 12 }} />

        <List sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>

          {/* TURNOS */}
          <ListItem disablePadding sx={{ bgcolor: bg("/") }}>
            <Link to="/" style={{ textDecoration: "none", color: color("/") }}>
              <ListItemButton sx={{ padding: "6px 12px" }}>
                <ListItemIcon>
                  <HomeIcon sx={{ color: color("/") }} />
                </ListItemIcon>
                <ListItemText primary="Turnos" />
              </ListItemButton>
            </Link>
          </ListItem>

          {/* DASHBOARD */}
          <ListItem disablePadding sx={{ bgcolor: bg("/Dashboard") }}>
            <ListItemButton component={Link} to="/Dashboard" sx={{ color: color("/Dashboard") }}>
              <ListItemIcon>
                <DashboardIcon sx={{ color: color("/Dashboard") }} />
              </ListItemIcon>
              <ListItemText primary="Panel de control" />
            </ListItemButton>
          </ListItem>

          {/* CLIENTES */}
          <ListItem disablePadding sx={{ bgcolor: bg("/clientes") }}>
            <ListItemButton component={Link} to="/clientes" sx={{ color: color("/clientes") }}>
              <ListItemIcon>
                <DashboardIcon sx={{ color: color("/clientes") }} />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItemButton>
          </ListItem>

          {/* PROFESIONALES */}
          <ListItem disablePadding sx={{ bgcolor: bg("/profesionales") }}>
            <ListItemButton component={Link} to="/profesionales" sx={{ color: color("/profesionales") }}>
              <ListItemIcon>
                <DashboardIcon sx={{ color: color("/profesionales") }} />
              </ListItemIcon>
              <ListItemText primary="Profesionales" />
            </ListItemButton>
          </ListItem>

          {/* SERVICIOS */}
          <ListItem disablePadding sx={{ bgcolor: bg("/servicios") }}>
            <ListItemButton component={Link} to="/servicios" sx={{ color: color("/servicios") }}>
              <ListItemIcon>
                <DashboardIcon sx={{ color: color("/servicios") }} />
              </ListItemIcon>
              <ListItemText primary="Servicios" />
            </ListItemButton>
          </ListItem>

          {/* COMISIONES */}
          <ListItem disablePadding sx={{ bgcolor: bg("/comisiones") }}>
            <ListItemButton component={Link} to="/comisiones" sx={{ color: color("/comisiones") }}>
              <ListItemIcon>
                <DashboardIcon sx={{ color: color("/comisiones") }} />
              </ListItemIcon>
              <ListItemText primary="Comisiones" />
            </ListItemButton>
          </ListItem>

          {/* WHATSAPP */}
          <ListItem disablePadding sx={{ bgcolor: bg("/whatsapp") }}>
            <ListItemButton component={Link} to="/whatsapp" sx={{ color: color("/whatsapp") }}>
              <ListItemIcon>
                <HomeIcon sx={{ color: color("/whatsapp") }} />
              </ListItemIcon>
              <ListItemText primary="WhatsApp" />
            </ListItemButton>
          </ListItem>

        </List>

        <Divider />

        {/* LOGOUT */}
        <LogoutButton
          sx={{
            position: "absolute",
            bottom: "30px",
          }}
          onClick={onLogout}
        >
          <LogoutIcon /> Salir
        </LogoutButton>
      </Drawer>

      {/* RENDER DE VISTAS */}
      <Box
        component="main"
        sx={{
          position: "fixed",
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          height: `calc(100vh - ${appHeight}px)`,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Routes>
          <Route path="/" element={<Turnero />} />
          <Route path="/Dashboard" element={<Dashboard drawerWidth={drawerWidth} appHeight={appHeight} />} />
          <Route path="/whatsapp" element={<Whatsapp />} />

          {/* NUEVAS SECCIONES */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/comisiones" element={<CommissionsContainer />} />
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

const LogoutButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    background: ${dell[50]};
    border: none;
    color: ${dell[900]};
    transition: 0.2s;

    &:hover {
      background: ${dell[500]};
      color: ${dell[950]};
    }
  `
);
