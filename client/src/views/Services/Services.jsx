import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { createTheme } from "@mui/material/styles";
import { css, styled, ThemeProvider } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { urlApi } from "../../assets/urlApi";
import {
  getServices,
  updateService,
} from "../../redux/slices/appointments/thunks";


const Services = () => {
  const services = useSelector((state) => state.services.services);
  const dispatch = useDispatch();

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado para controlar si se muestra la alerta de eliminación
  const [serviceToDelete, setServiceToDelete] = useState(null); // Estado para almacenar el servicio que se va a eliminar

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const [allServices, setAllServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceDataToUpdate, setServiceDataToUpdate] = useState({
    service_name: "",
    cost: "",
    category: "",
  });

  useEffect(() => {
    setAllServices(services);
  }, [services]);

  const handleEdit = (service) => {
    setEditingService(service);
    setServiceDataToUpdate({
      service_name: service.service_name,
      cost: service.cost,
      category: service.category,
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setServiceDataToUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async (serviceDataToUpdate, id) => {
    const serviceData = Object.keys(serviceDataToUpdate).reduce((acc, key) => {
      if (serviceDataToUpdate[key] !== "") {
        acc[key] = serviceDataToUpdate[key];
      }
      return acc;
    }, {});

    if (Object.keys(serviceData).length > 0) {
      const resp = await dispatch(updateService(serviceData, id));
      if (resp.data.successMessage) {
        setAlertMessage(resp.data.successMessage);
        setSeverity("success");
        setOpenSnackBar(true);
      } else if (resp.error) {
        setOpenSnackBar(true);
        setAlertMessage("");
        setSeverity("error");
      }
      await dispatch(getServices());
      setEditingService(null);
    }
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleDeleteService = async (id) => {
    setEditingService(null); // Cerrar el modo de edición antes de mostrar la alerta
    setServiceToDelete(id); // Almacena el id del servicio que se va a eliminar
    setConfirmDelete(true); // Mostrar la alerta de eliminación
  };

  const handleConfirmDelete = async () => {
    try {
      // Realizar PATCH al servicio para establecer isDeleted como true
      await axios.patch(`${urlApi}service/${serviceToDelete}`, {
        isDeleted: true,
      });
      dispatch(getServices());
      setConfirmDelete(false); // Ocultar la alerta de eliminación después de confirmar
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false); // Ocultar la alerta de eliminación
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{ padding: "20px" }}>
        {allServices.length > 0 ? (
          <Grid container spacing={2}>
            {allServices.map((service) => (
              <Grid item xs={12} key={service.id}>
                <Card
                  variant="outlined"
                  sx={{
                    transition: "width 0.8s ease",
                    minWidth: "40%",
                    width: "fit-content",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "1.2 rem",
                    boxShadow:
                      editingService === service &&
                      "0px 8px 16px rgba(0, 0, 0, 0.5)",
                    "&:hover": {
                      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5)", // Cambia la sombra al hacer hover
                    },
                  }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    {editingService === service ? (
                      <>
                        <TextField
                          label="Servicio"
                          value={serviceDataToUpdate.service_name}
                          name="service_name"
                          onChange={handleFieldChange}
                        />
                        <TextField
                          label="Costo"
                          value={serviceDataToUpdate.cost}
                          name="cost"
                          onChange={handleFieldChange}
                        />
                        <TextField
                          select
                          label="Categoría"
                          value={serviceDataToUpdate.category}
                          onChange={handleFieldChange}
                          name="category">
                          <MenuItem value="Peluquería">Peluquería</MenuItem>
                          <MenuItem value="Estética">Estética</MenuItem>
                        </TextField>
                        <TriggerButton
                          variant="contained"
                          onClick={() =>
                            handleSave(serviceDataToUpdate, service.id)
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
                          {service.service_name}
                        </Typography>

                        <EditButton onClick={() => handleEdit(service)}>
                          Editar
                        </EditButton>
                        {editingService !== service && ( // Renderizar solo si no se está editando este servicio
                          <IconButton
                            sx={{
                              "&:hover": {
                                color: red[900], // Cambia el color al hacer hover
                              },
                            }}
                            onClick={() => handleDeleteService(service.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p>No hay servicios registrados</p>
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
      <Dialog open={confirmDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este servicio?
          </Typography>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleCancelDelete} className="cancel-hover" >
            Cancelar
          </CancelButton>
          <CancelButton
            onClick={handleConfirmDelete}
            color="error"
            style={{color:red[900]}}
            className="eliminar-hover">
            Eliminar
          </CancelButton>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Services;

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
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px ${red[300]}; /* Agregamos una sombra más pronunciada al hacer hover */    }
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
