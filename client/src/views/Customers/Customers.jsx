import {
  Alert,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, updateCustomer } from "../../redux/slices/appointments/thunks";

import { createTheme } from "@mui/material/styles";
import { css, styled, ThemeProvider } from "@mui/system";

const Customers = () => {
  const { customers } = useSelector((state) => state.customer);
  const tenantId = useSelector((state) => state.tenant.tenantId);
  const dispatch = useDispatch();

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [clientDataToUpdate, setClientDataToUpdate] = useState({
    name: "",
    DateOfBirth: "",
    phone: "",
    mail: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

console.log('clientes', customers);



  useEffect(() => {
  //  console.log("tenantId desde customers", tenantId);
    
    dispatch(getCustomers(tenantId));
  }, [dispatch,tenantId]);

  useEffect(() => {
    if (editingCustomer === null) {
      setClientDataToUpdate({
        name: "",
        DateOfBirth: "",
        phone: "",
        mail: "",
      });
    }
  }, [editingCustomer]);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setClientDataToUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));

   
  };

  const handleSave = async (clientDataToUpdate, dni) => {
    const clientData = Object.keys(clientDataToUpdate).reduce((acc, key) => {
      if (clientDataToUpdate[key] !== "") {
        acc[key] = clientDataToUpdate[key];
      }
      return acc;
    }, {});

    if (Object.keys(clientData).length > 0) {
      const resp = await dispatch(updateCustomer(clientData, dni));
      if (resp.data.successMessage) {
        setAlertMessage(resp.data.successMessage);
        setSeverity("success");
        setOpenSnackBar(true);
      } else {
        setAlertMessage("Error al modificar el cliente");
        setSeverity("error");
        setOpenSnackBar(true);
      }
    }

    await dispatch(getCustomers());
    setEditingCustomer(null);
  };

  const handleCloseSnackBar = () => {
    setErrorMessage("");
    setOpenSnackBar(false);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
  };

  return (
    <ThemeProvider theme={theme}>
     
       <Container maxWidth="xl" style={{padding:'20px'}}>
          {customers.length > 0 ? (
            <Grid container spacing={2}>
              {customers.map((customer, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      transition: "width 0.8s ease",
                      minWidth: "50%",
                      width: "fit-content",
                      margin: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "1.2 rem",
                      boxShadow:
                        editingCustomer === customer &&
                        "0px 8px 16px rgba(0, 0, 0, 0.5)",
                      "&:hover": {
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5)", // Cambia la sombra al hacer hover
                      },
                    }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {editingCustomer === customer ? (
                        <>
                          <TextField
                            label="Nombre"
                            defaultValue={customer.name}
                            name="name"
                            onChange={handleFieldChange}
                          />
                          <TextField
                            label="Dni"
                            defaultValue={customer.dni}
                            disabled
                          />
                          <TextField
                            label="Fecha de nacimiento"
                            defaultValue={customer.DateOfBirth}
                            name="DateOfBirth"
                            onChange={handleFieldChange}
                          />
                          <TextField
                            label="Teléfono"
                            defaultValue={customer.phone}
                            name="phone"
                            onChange={handleFieldChange}

                            // Maneja cambios en el teléfono
                          />
                          <TextField
                            label="Mail"
                            defaultValue={customer.mail}
                            name="mail"
                            onChange={handleFieldChange}

                            // Maneja cambios en el correo electrónico
                          />

                          <TriggerButton
                            variant="contained"
                            onClick={() =>
                              handleSave(clientDataToUpdate, customer.dni)
                            }>
                            Guardar
                          </TriggerButton>
                          <CancelButton
                            variant="contained"
                            onClick={handleCancel}>
                            Cancelar
                          </CancelButton>
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{ fontSize: "1rem" }}>
                            {customer.Client.name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            component="div"
                            sx={{ fontSize: "1rem" }}>
                            Dni: {customer.Client.dni}
                          </Typography>
                          {/* Agrega más detalles del cliente aquí según tu estructura de datos */}
                          <EditButton onClick={() => handleEdit(customer)}>
                            Editar
                          </EditButton>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <p>No hay clientes registrados</p>
          )}
        </Container>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={2000}
          onClose={handleCloseSnackBar}>
          <Alert variant="filled" severity={severity}>
            {alertMessage}
          </Alert>
        </Snackbar>
    
    </ThemeProvider>
  );
};

export default Customers;


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
