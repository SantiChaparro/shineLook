import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

const LandingNavBar = ({ onLogin }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BENDAHAN
          </Typography>
       
          {onLogin && (
            <Button color="inherit" onClick={onLogin}>
              Iniciar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default LandingNavBar;
