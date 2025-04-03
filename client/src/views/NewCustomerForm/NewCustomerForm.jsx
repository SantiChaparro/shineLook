import { FormControl, Snackbar, TextField } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { css, styled, ThemeProvider } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanMessages, postNewClient, } from "../../redux/slices/appointments/thunks";
import styles from "./NewCustomerForm.module.css";


const initialValues = {
  name: "",
  dni: "",
  DateOfBirth: null,
  phone: "",
  mail: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = "Este campo es requerido";
  } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
    errors.name = "Este campo solo admite letras";
  }

  if (!values.dni) {
    errors.dni = "Este campo es requerido";
  } else if (!/^\d{8}$/.test(values.dni)) {
    errors.dni = "Este campo admite 8 dígitos numéricos";
  }

  // if (!values.DateOfBirth) {
  //   errors.DateOfBirth = "Este campo es requerido";
  // } else 
  
  if (values.DateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(values.DateOfBirth)) {
    errors.DateOfBirth = 'El formato de la fecha debe ser "AAAA-MM-DD"';
  }

  // if (!values.phone) {
  //   errors.phone = "Este campo es requerido";
  // } else 
  
  if ( values.phone && !/^\d{10}$/.test(values.phone)) {
    errors.phone = "Característica sin 0, celular sin 15";
  }

  // if (!values.mail) {
  //   errors.email = "Este campo es requerido";
  // } else
   if (values.mail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.mail)){
     errors.mail = "Formato de correo incorrecto";
   }

  return errors;
};

const NewCustomerForm = () => {
  const newClient = useSelector((state) => state.newClient);
  const errorMessage = useSelector((state) => state.newClient.errorMessage);
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  useEffect(() => {
    if ((newClient && newClient.newClient.successMessage) || errorMessage) {
      setSnackbarType(errorMessage ? "error" : "success");
      setSnackbarMessage(errorMessage || newClient.newClient.successMessage);
      setOpenSnackbar(true);
    }
    return () => {
      setOpenSnackbar(false);
      setSnackbarMessage("");
      setSnackbarType("success");
    };
  }, [newClient, errorMessage]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarType("success");
    dispatch(cleanMessages());
  };

  const handleSubmit = (values, { resetForm }) => {
    
    if(values.DateOfBirth===''){
      values.DateOfBirth=null
    }
    dispatch(
      postNewClient(
        values.dni,
        values.name,
        values.DateOfBirth,
        values.phone,
        values.mail
      )
    );
    resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validate,
  });

  return (
    <div style={{marginTop:'20px'}}>
      <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
        <FormControl>
          <ThemeProvider theme={theme}>
            <TextField
              label="Nombre"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            {formik.errors.name ? (
              <span className={styles.error}>{formik.errors.name}</span>
            ) : null}
            <TextField
              label="Dni"
              name="dni"
              onChange={formik.handleChange}
              value={formik.values.dni}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            {formik.errors.dni ? (
              <span className={styles.error}>{formik.errors.dni}</span>
            ) : null}
            <TextField
              label="Fecha Nacimiento"
              name="DateOfBirth"
              onChange={formik.handleChange}
              value={formik.values.DateOfBirth}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            {formik.errors.DateOfBirth ? (
              <span className={styles.error}>{formik.errors.DateOfBirth}</span>
            ) : null}
            <TextField
              label="Telefono"
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            {formik.errors.phone ? (
              <span className={styles.error}>{formik.errors.phone}</span>
            ) : null}
            <TextField
              label="Mail"
              name="mail"
              onChange={formik.handleChange}
              value={formik.values.mail}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            {formik.errors.mail ? (
              <span className={styles.error}>{formik.errors.mail}</span>
            ) : null}
          </ThemeProvider>
          <TriggerButton type="submit" variant="contained">
            Registrar
          </TriggerButton>
        </FormControl>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        // Agregar el color del Snackbar dependiendo del tipo
        sx={{ backgroundColor: snackbarType === "success" ? "green" : "red" }}
      />
    </div>
  );
};

export default NewCustomerForm;

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