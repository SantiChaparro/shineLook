import Reac, { useState } from "react";
import axios from "axios";
import { Formik, useFormik } from "formik";
import { Grid, Paper, Typography, Button, Box, TextField } from "@mui/material";
import "./Landing.css";
import LogoNegro from "../../assets/LogoNegro.PNG";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { styled, css } from "@mui/system";

import { urlApi } from "../../assets/urlApi.js";



const Landing = ({ onLogin, HandleVerifyUser }) => {
  const [errorState, setErrorState] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const resp = await axios.post(`${urlApi}login`, values);

      if (resp.data.tokken) {
        onLogin();
        HandleVerifyUser();
      }

      localStorage.setItem("loggedUser", JSON.stringify(resp.data));
    } catch (error) {
      const errorMessage = error.response.data.error;
      setErrorState(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      dni: "",
      password: "",
    },
    validate: (values) => {
      let errors = {};

      if (!values.dni) {
        errors.dni = "Este campo es requerido";
      } else if (!/^\d{8}$/.test(values.dni)) {
        errors.dni = "Este campo solo admite números";
      }

      if (!values.password) {
        errors.password = "Este campo es requerido";
      }

      return errors;
    },
    onSubmit: handleSubmit,
  });

  return (
    <div
    class='container'
      style={{
        width: "100%",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        overflow: "hidden",
        gap: "40px",
              }}>
      <Box>
        <img src={LogoNegro} alt="Logo bendahan" style={{ width: "600px" }} />
      </Box>

      <Box>
        <form onSubmit={formik.handleSubmit}>
          <ThemeProvider theme={theme}>
            <StyledBox>
              <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                <TextField
                  label="Dni"
                  name="dni"
                  onChange={formik.handleChange}
                  value={formik.values.dni}
                  variant="outlined"
                />
                {formik.errors.dni ? (
                  <StyledInputLabel sx={{color:"red"}}>{formik.errors.dni}</StyledInputLabel>
                ) : null}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  variant="outlined"
                />
                {formik.errors.password ? (
                  <StyledInputLabel sx={{color:"red"}}>{formik.errors.password}</StyledInputLabel>
                ) : null}
              </Box>
              <Box>
                <TriggerButton type="submit">Iniciar sesión</TriggerButton>
              </Box>
            </StyledBox>
          </ThemeProvider>
        </form>
      </Box>
    </div>
  );
};

export default Landing;

const blue = {
  100: "#CCE6FF",
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
  800: "#005AB2",
  900: "#004D99",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
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
const colors = {
  dell: {
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
  },
  codGray: {
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
  },
};

const red = {
  50: "#FFEBEE",
  100: "#FFCDD2",
  200: "#EF9A9A",
  300: "#E57373",
  400: "#EF5350",
  500: "#F44336",
  600: "#E53935",
  700: "#D32F2F",
  800: "#C62828",
  900: "#B71C1C",
};

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

const theme = createTheme({
  palette: {
    success: {
      main: colors.dell[600], // Cambia el color principal de éxito (success)
    },
    primary: {
      main: colors.dell[600],
    },
  },
});


// const themeLogin = createTheme({
//   palette: {
//     success: {
//       main: colors.dell[950],
//     },
//     primary: {
//       main: "#fff9", // Corregido el formato del valor
//     },
//     text: {
//       primary: colors.dell[50],
//     },
//   },
  // components: {
  //   MuiOutlinedInput: {
  //     styleOverrides: {
  //       root: {
  //         "& fieldset": {
  //           borderColor: "#ffffff4d", // Color del borde igual al del botón LoginButton
  //           borderRadius: "9px", // Misma cantidad de borde que el botón LoginButton
  //           border: "solid 3px #ffffff4d",
  //           transition: "all 0.3s ease-in-out", // Agregamos transición
  //         },
  //         "&:hover fieldset": {
  //           borderColor: "#fff9", // Cambia el color del borde al pasar el cursor
  //           transform: "scale(1.05)", // Agranda el TextField al hacer hover
  //         },
  //         "&.Mui-focused fieldset": {
  //           borderColor: "#ffffff4d", // Cambia el color del borde cuando está enfocado
  //         },
  //         "& label": {
  //           color: colors.dell[50], // Color del label
  //         },
  //       },
  //     },
  //   },
  // },
// });

const LoginButton = styled("button")(
  ({ theme }) => css`
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    background-color: linear-gradient(
      to bottom,
      var(--codGray-700),
      var(--codGray-950)
    );
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dell-50);
    gap: 10px;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 15px;

    &:hover {
      transform: scale(1.05);
      border-color: #fff9;
    }

    &:hover .icon {
      transform: translate(4px);
    }

    /* Pseudo-elemento para el efecto de brillo */
    &::before {
      content: "";
      position: absolute;
      width: 100px;
      height: 100%;
      background-image: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0) 70%
      );
      top: 0;
      left: -100px;
      opacity: 0.6;
      transition: left 0.8s ease-out;
    }

    &:hover::before {
      left: 100%;
    }
  `
);

const CancelButton = styled("button")(
  ({ theme }) => css`
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 5px;
      transition: all 150ms ease;
      cursor: pointer;
      border: 1px solid transparent; /* Borde transparente */
      background-color: transparent; /* Fondo transparente */
      color: var(--color-codGray-950); /* Color de texto */
     
  
      &:hover:not(:disabled) {
        color: ${red[900]}; /* Cambia el color al hacer hover */
      }
  
      &:active:not(:disabled) {
        color: ${red[900]}; /* Cambia el color al activar (click) */
      }
     
      &:focus-visible {
        color: ${red[900]};
        box-shadow: 0 0 0 4px
          ${theme.palette.mode === "dark" ? green[300] : red[900]};
        outline: none;
      }
  
      &:disabled {
        opacity: 0.5; /* Reducir la opacidad del botón */
        cursor: not-allowed; /* Cambiar el cursor del ratón */
      }
      &:hover.cancel-hover {
        color: var(--color-codGray-950);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.1); /* Agregamos una sombra más pronunciada al hacer hover */    }
      }
        &:hover.eliminar-hover{
       
            color: red[900];
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px ${
              red[300]
            }; /* Agregamos una sombra más pronunciada al hacer hover */    }
        }
        
        `
);

const EditButton = styled("button")(
  ({ theme }) => css`
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 5px;
      transition: all 150ms ease;
      cursor: pointer;
      border: 1px solid transparent; /* Borde transparente */
      background-color: transparent; /* Fondo transparente */
      color: var(--dell-950); /* Color de texto */
    
      &:hover:not(:disabled) {
        color:var(--dell-600); /* Cambia el color al hacer hover */
      }
    
      &:active:not(:disabled) {
        color: ${red[900]}; /* Cambia el color al activar (click) */
      }
    
      &:focus-visible {
        box-shadow: 0 0 0 4px ${
          theme.palette.mode === "dark" ? green[300] : green[200]
        };
        outline: none;
      }
    
      &:disabled {
        opacity: 0.5; /* Reducir la opacidad del botón */
        cursor: not-allowed; /* Cambiar el cursor del ratón */
      } not-allowed; /* Cambiar el cursor del ratón */
        }
      `
);

const StyledBox = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  borderRadius: "20px",
  background: "var(--codGray-50)",
  boxShadow: "0 4px 24px 0 #112b09", // Cambié el color del sombreado
  height: "fit-content",
  width: "300px",
  padding: "30px",
});

const StyledInputLabel = styled("span")({
  color: "rgba(0, 0, 0, 0.9)", // Color de texto del label de MUI
  fontFamily: "Roboto, Helvetica, Arial, sans-serif", // Fuente del label de MUI
  fontSize: "0.8rem", // Tamaño de fuente del label de MUI
  fontWeight: 400, // Peso de fuente del label de MUI
  lineHeight: 1, // Altura de línea del label de MUI
  letterSpacing: "0.00938em", // Espaciado de letras del label de MUI
  marginTop: "8px", // Espaciado superior del label de MUI
});

const TriggerButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 5px;
    transition: all 150ms ease;
    cursor: pointer;
    background: linear-gradient(to bottom, var(--dell-500), var(--dell-600));
    color: var(--dell-950);
    border: none;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover:not(:disabled) {
      background: linear-gradient(to bottom, var(--dell-600), var(--dell-700));
      border-color: ${theme.palette.mode === "dark" ? green[600] : green[300]};
      color: ${theme.palette.mode === "dark" ? green[600] : dell[950]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    &:active:not(:disabled) {
      background: ${theme.palette.mode === "dark" ? green[700] : green[300]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? green[300] : green[200]};
      outline: none;
    }

    &:disabled {
      // opacity: 0.5;
      background: #ccc;
      color: #666;
      cursor: not-allowed;
      // pointer-events: none; /* Desactivar eventos de puntero */
    }
  `
);
