import {
  Alert,
  Box,
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
  emptyFormMessages,
  getServices,
  postNewProfessional,
} from "../../redux/slices/appointments/thunks";

const initialValues = {
  name: "",
  dni: "",
  phone: "",
  mail: "",
  role: "",
  password: "",
  services: [],
};

const validate = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = "El campo es requerido";
  } else if (!/^[a-zA-ZñÑ\s]+$/.test(values.name)) {
    errors.name = "El campo debe contener solo letras";
  }

  if (!values.dni) {
    errors.dni = "El campo es requerido";
  } else if (!/^[0-9]+$/.test(values.dni)) {
    errors.dni = "El campo debe contener solo números";
  }

  // if (!values.phone)
  //    {
  //   errors.phone = "El campo es requerido";
  // } else
   if (values.phone && !/^[0-9]+$/.test(values.phone)) {
    errors.phone = "El campo debe contener solo números";
  }

  // if (!values.mail) {
  //   errors.mail = "El campo es requerido";
  // } else 
  if ( values.mail && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(values.mail)
  ) {
    errors.mail = "El formato del correo electrónico no es válido";
  }

  if (!values.role) {
    errors.role = "El campo es requerido";
  }

  if (!values.password) {
    errors.password = "El campo es requerido";
  }

  values.services.forEach((service, index) => {
    if (!service.primary) {
      errors[`services[${index}].primary`] = "El campo es requerido";
    }

    if (!service.secondary) {
      errors[`services[${index}].secondary`] = "El campo es requerido";
    }
  });

  return errors;
};

const NewProfessionalForm = () => {
  const newProfessional = useSelector(
    (state) => state.newProfessional.newProfessional
  );
  const errorMessage = useSelector(
    (state) => state.newProfessional.errorMessage
  );
  const allServices = useSelector((state) => state.services.services);
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(getServices());
   

    if (newProfessional.successMessage) {
      setAlertMessage(newProfessional.successMessage);
      setOpenSnackBar(true);
      setSeverity("success");
      dispatch(emptyFormMessages());
    }

    if (errorMessage) {
      setAlertMessage(errorMessage);
      setSeverity("error");
      setOpenSnackBar(true);
      dispatch(emptyFormMessages());
    }
  }, [alertMessage, newProfessional, errorMessage, dispatch]);

  const handleSnackbarClose = () => {
    setAlertMessage("");
    setOpenSnackBar(false);

    dispatch(emptyFormMessages());
  };

  const handleServiceSelect = (event) => {
    const { value } = event.target;

    // Verificar si el servicio ya está presente en la lista
    const isServiceSelected = formik.values.services.some(
      (service) => service.idService === value
    );

    // Si el servicio ya está seleccionado, deseleccionarlo
    if (isServiceSelected) {
      const updatedServices = formik.values.services.filter(
        (service) => service.idService !== value
      );
      formik.setValues({
        ...formik.values,
        services: updatedServices,
      });
    } else {
      // Si el servicio no está seleccionado, agregarlo
      const selectedService = allServices.find(
        (service) => service.id === value
      );
      formik.setValues({
        ...formik.values,
        services: [
          ...formik.values.services,
          {
            idService: value,
            primary: "",
            secondary: "0",
          },
        ],
      });
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    const { name, dni, phone, mail, role, password, services } = values;
    dispatch(
      postNewProfessional(dni, name, phone, mail, role, password, services)
    );
    resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validate,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          height: "100%",
          overflow: "hidden",
        }}>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: "100%",
            height: "100%",
            padding: "5px 0",
            gap: "10px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "90%",
              overflow: "hidden",
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                padding: "5px",
                alignItems: "start",
                justifyContent: "space-around",
              }}>
              <div
                style={{
                  width: "30%",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  gap: "10px",
                }}>
                <TextField
                  label="Nombre"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  variant="outlined"
                  //   sx={{ mb: 2 }}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  size="small"
                />

                <TextField
                  label="Dni"
                  name="dni"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dni}
                  variant="outlined"
                  //   sx={{ mb: 2 }}
                  error={formik.touched.dni && Boolean(formik.errors.dni)}
                  helperText={formik.touched.dni && formik.errors.dni}
                  size="small"
                />
                <TextField
                  label="Telefono"
                  name="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  variant="outlined"
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  size="small"
                />
                <TextField
                  label="Mail"
                  name="mail"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mail}
                  variant="outlined"
                  //   sx={{ mb: 2 }}
                  error={formik.touched.mail && Boolean(formik.errors.mail)}
                  helperText={formik.touched.mail && formik.errors.mail}
                  size="small"
                />
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  variant="outlined"
                  //   sx={{ mb: 2 }}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  size="small"
                />
                <FormControl>
                  <TextField
                    select
                    label="Rol"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="role"
                    variant="outlined"
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                    size="small">
                    <MenuItem value={"Master"}>Master</MenuItem>
                    <MenuItem value={"Profesional"}>Profesional</MenuItem>
                  </TextField>
                </FormControl>
              </div>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",

                  height: "100%",
                }}>
                <FormControl>
                  <TextField
                    select
                    label="Servicios"
                    value=""
                    onChange={handleServiceSelect}
                    variant="outlined"
                    size="small">
                    {allServices.map((service) => (
                      <MenuItem
                        key={service.id}
                        value={service.id}
                        sx={{
                          backgroundColor: formik.values.services.some(
                            (serv) => serv.idService === service.id
                          )
                            ? theme.palette.primary.main
                            : "inherit",
                          color: formik.values.services.some(
                            (serv) => serv.idService === service.id
                          )
                            ? theme.palette.text.main
                            : "inherit",
                          "&:hover": {
                            color: theme.palette.text.main,
                            backgroundColor: theme.palette.secondary.main
                          },
                        }}
                        >
                        {service.service_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>

                <Box
                  label="Servicios elegidos"
                  sx={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    //   marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "start",
                    overflowY: "auto",
                    gap: "20px",
                    maxHeight: "100%",
                    borderRadius: "4px",
                  }}>
                  {formik.values.services.length > 0 ? (
                    formik.values.services.map((service, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}>
                        <TextField
                          label={`Comisión Primaria -${
                            allServices.find((s) => s.id === service.idService)
                              ?.service_name
                          }`}
                          name={`services[${index}].primary`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={service.primary}
                          variant="outlined"
                          error={
                            formik.errors.services &&
                            formik.errors.services[index] &&
                            formik.errors.services[index].primary
                          }
                          helperText={
                            formik.errors.services &&
                            formik.errors.services[index] &&
                            formik.errors.services[index].primary
                          }
                          size="small"
                        />

                        <TextField
                          label={`Comisión Secundaria -${
                            allServices.find((s) => s.id === service.idService)
                              ?.service_name
                          }`}
                          name={`services[${index}].secondary`}
                          onChange={formik.handleChange}
                          value={service.secondary}
                          variant="outlined"
                          size="small"
                        />
                      </div>
                    ))
                  ) : (
                    <StyledInputLabel>
                      Asigne servicios para el profesional
                    </StyledInputLabel>
                  )}
                </Box>
              </div>
            </div>
          </FormControl>
          <div
            style={{
              display: "flex",
              height: "fit-content",
              padding: "10px",
              background: "transparent",
              borderSizing: "border-box",
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}>
            <TriggerButton type="submit">Guardar</TriggerButton>
          </div>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}>
          <Alert variant="filled" severity={severity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default NewProfessionalForm;

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
    secondary:{
      main: colors.dell[900]
    },
    text:{
      main: colors.dell[50]
    },
    guia:{
      main: red[900]
    }
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
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? green[300] : green[200]};
      outline: none;
    }

    &:disabled {
      opacity: 0.5; /* Reducir la opacidad del botón */
      cursor: not-allowed; /* Cambiar el cursor del ratón */
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

const StyledInputLabel = styled("span")({
  color: "rgba(0, 0, 0, 0.54)", // Color de texto del label de MUI
  fontFamily: "Roboto, Helvetica, Arial, sans-serif", // Fuente del label de MUI
  fontSize: "1rem", // Tamaño de fuente del label de MUI
  fontWeight: 400, // Peso de fuente del label de MUI
  lineHeight: 1, // Altura de línea del label de MUI
  letterSpacing: "0.00938em", // Espaciado de letras del label de MUI
  marginTop: "8px", // Espaciado superior del label de MUI
});
