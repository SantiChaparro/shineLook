import {
  FormControl,
  MenuItem,
  Snackbar,
  TextField
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Container, css, styled, ThemeProvider } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cleanNewService,
  postNewService,
} from "../../redux/slices/appointments/thunks";
import styles from "./NewServiceForm.module.css";

const initialValues = {
  service_name: "",
  cost: "",
  category: "",
};

const validate = (values) => {
  const errors = {};

  if (!values.service_name) {
    errors.service_name = "El campo es requerido";
  } else if (!/^[a-zA-Z\s\u00C0-\u017F]+$/.test(values.service_name)) {
    errors.service_name = "Este campo solo admite letras";
  }

  if (!values.cost) {
    errors.cost = "El campo es requerido";
  } else if (!/^\d+$/.test(values.cost)) {
    errors.cost = "Este campo solo admite números";
  }

  if (!values.category) {
    errors.category = "El campo es requerido";
  }

  return errors;
};

const NewServiceForm = () => {
  const { NewService } = useSelector((state) => state.newService);
  const tenantId = useSelector((state) => state.tenant.tenantId);
  const errorMessage = "";

  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  console.log('tenantId',tenantId);
  

  useEffect(() => {
    if ((NewService && NewService.successMessage) || errorMessage) {
      setSnackbarType(errorMessage ? "error" : "success");
      setSnackbarMessage(errorMessage || NewService.successMessage);
      setOpenSnackbar(true);
    }
    return () => {
      setOpenSnackbar(false);
      setSnackbarMessage("");
      setSnackbarType("success");
    };
  }, [NewService, errorMessage]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarType("success");
    dispatch(cleanNewService());
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(postNewService(values.service_name, values.cost, values.category,tenantId));
    resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validate,
  });

  return (
    <Container maxWidth="xl" className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
        <FormControl>
          <ThemeProvider theme={theme}>
            <TextField
              label="Servicio"
              name="service_name"
              onChange={formik.handleChange}
              value={formik.values.service_name}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            {formik.errors.service_name && (
              <span className={styles.error}>{formik.errors.service_name}</span>
            )}

            <TextField
              label="Costo"
              name="cost"
              onChange={formik.handleChange}
              value={formik.values.cost}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            {formik.errors.cost && (
              <span className={styles.error}>{formik.errors.cost}</span>
            )}

            <TextField
              select
              labelId="categoria-label"
              label="Categoría"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}>
              <MenuItem value="Peluquería">Peluquería</MenuItem>
              <MenuItem value="Estética">Estética</MenuItem>
            </TextField>

            {formik.errors.category && (
              <span className={styles.error}>{formik.errors.category}</span>
            )}
            <TriggerButton type="submit">Guardar</TriggerButton>
          </ThemeProvider>
        </FormControl>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarType === "success" ? "green" : "red" }}
      />
    </Container>
  );
};

export default NewServiceForm;

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
