import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { createTheme } from "@mui/material/styles";
import { css, styled, ThemeProvider } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfessionals,
  getServices,
  updateProfessional,
} from "../../redux/slices/appointments/thunks";

const Professionals = () => {
  const { professionals: professionalData } = useSelector(
    (state) => state.professionals
  );
  const services = useSelector((state) => state.services.services);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [addServices, setAddServices] = useState(false);
  const [professionalDataToUpdate, setProfessionalDataToUpdate] = useState({
    dni: "",
    name: "",
    phone: "",
    mail: "",
    services: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getProfessionals());
    dispatch(getServices());
  }, [dispatch]);

  const handleEdit = (professional) => {
    setEditingProfessional(professional);
    setIsEditing(true);
    setAddServices(false); // Reiniciar el estado addServices
    // Prellenar los datos del profesional en el formulario de edición
    setProfessionalDataToUpdate({
      dni: professional.dni,
      name: professional.name,

      phone: professional.phone ? professional.phone : "" ,
      mail: professional.mail ? professional.mail : "",
      services: professional.services ?

       professional.services.map((service) => ({
        idService: service.idService,
        primary: service.primary,
        secondary: service.secondary,
        isServiceSaved: true, // Los servicios ya existentes se marcan como guardados
      })): [],
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfessionalDataToUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleServiceFieldChange = (index, fieldName, value) => {
    const updatedServices = [...professionalDataToUpdate.services];
    if (index >= 0 && index < updatedServices.length) {
      updatedServices[index][fieldName] = value;
      setProfessionalDataToUpdate((prevState) => ({
        ...prevState,
        services: updatedServices,
      }));
    }
  };

  const handleServiceSelectChange = (value) => {
    // Actualizar el servicio seleccionado con el valor del ID del servicio
    const updatedServices = [...professionalDataToUpdate.services];
    const emptyServiceIndex = updatedServices.findIndex(
      (service) => service.idService === ""
    );
    if (emptyServiceIndex !== -1) {
      updatedServices[emptyServiceIndex].idService = value;
      setProfessionalDataToUpdate((prevState) => ({
        ...prevState,
        services: updatedServices,
      }));
    }
  };

  const handleAddService = () => {
    setAddServices(true); // Cambiar el estado para mostrar los campos de agregar servicio

    // Agregar un nuevo servicio vacío al estado de professionalDataToUpdate
    setProfessionalDataToUpdate((prevState) => ({
      ...prevState,
      services: [
        ...prevState.services,
        { idService: "", primary: "", secondary: "", isServiceSaved: false },
      ],
    }));
  };

  const handleDeleteService = (index) => {
    const updatedServices = [...professionalDataToUpdate.services];
    updatedServices.splice(index, 1);
    setProfessionalDataToUpdate((prevState) => ({
      ...prevState,
      services: updatedServices,
    }));
  };

  const handleSave = async () => {
    const resp = await dispatch(
      updateProfessional(professionalDataToUpdate, professionalDataToUpdate.dni)
    );
    if (resp.successMessage) {
      setSuccessMessage(resp.successMessage);
      setOpenSnackBar(true);
    } else {
      setSuccessMessage("Error al modificar");
      setOpenSnackBar(true);
    }
    setEditingProfessional(null);
    setIsEditing(false);
    await dispatch(getProfessionals());
  };

  const handleCancel = () => {
    setEditingProfessional(null);
    setIsEditing(false);
    setAddServices(false); // Reiniciar el estado addServices
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const getServiceNameById = (id) => {
    const service = services.find((service) => service.id === id);
    return service ? service.service_name : ""; // Retorna el nombre del servicio si se encuentra, de lo contrario, una cadena vacía
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" style={{ padding: "20px" }}>
        {professionalData.length > 0 ? (
          <Grid container spacing={2}>
            {professionalData.map((professional, index) => (
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
                      editingProfessional === professional &&
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
                    {editingProfessional === professional ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "20px",
                        }}>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px",
                          }}>
                          <TextField
                            label="Nombre"
                            name="name"
                            onChange={handleFieldChange}
                            value={professionalDataToUpdate.name}
                            size="small"
                          />
                          <TextField
                            label="Dni"
                            value={professionalDataToUpdate.dni}
                            disabled
                            size="small"
                          />

                          <TextField
                            label="Teléfono"
                            name="phone"
                            onChange={handleFieldChange}
                            value={professionalDataToUpdate.phone}
                            size="small"
                          />
                          <TextField
                            label="Correo electrónico"
                            name="mail"
                            onChange={handleFieldChange}
                            value={professionalDataToUpdate.mail}
                            size="small"/>
                        </Box>

                        {professionalDataToUpdate.services.map(
                          (service, serviceIndex) => (
                            <Box
                              key={serviceIndex}
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "20px",
                                width: "100%",
                                justifyContent: "center",
                              }}>
                              <TextField
                                label="Servicio"
                                value={getServiceNameById(service.idService)}
                                disabled={true} // El nombre del servicio no se puede editar
                                size="small"
                              />
                              <TextField
                                label="Comisión primaria"
                                value={service.primary}
                                onChange={(e) =>
                                  handleServiceFieldChange(
                                    serviceIndex,
                                    "primary",
                                    e.target.value
                                  )
                                }
                                size="small"
                              />
                              <TextField
                                label="Comisión secundaria"
                                value={service.secondary || ""}
                                onChange={(e) =>
                                  handleServiceFieldChange(
                                    serviceIndex,
                                    "secondary",
                                    e.target.value
                                  )
                                }
                                size="small"
                              />

                              <IconButton
                                onClick={() =>
                                  handleDeleteService(serviceIndex)
                                }
                                sx={{
                                  "&:hover": {
                                    color: red[900], // Cambia el color al hacer hover
                                  },
                                }}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "50%",
                            gap: "20px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          {addServices && (
                            <TextField
                              select
                              label="Seleccione un servicio"
                              sx={{ width: "45%" }}
                              value="" // Valor inicial vacío, para seleccionar un servicio
                              onChange={(e) =>
                                handleServiceSelectChange(e.target.value)
                              }
                              size="small">
                              {services.map((service, index) => (
                                <MenuItem key={service.id} value={service.id}>
                                  {service.service_name}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                          <TriggerButton
                            onClick={handleAddService}
                            style={{ width: "auto" }}>
                            Agregar Servicio
                          </TriggerButton>
                        </div>
                        <div>
                          <TriggerButton
                            variant="contained"
                            onClick={() =>
                              handleSave(
                                professionalDataToUpdate,
                                professional.dni
                              )
                            }>
                            Guardar
                          </TriggerButton>
                          <CancelButton
                            variant="contained"
                            onClick={handleCancel}>
                            Cancelar
                          </CancelButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ fontSize: "1rem" }}>
                          {professional.name}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          component="div"
                          sx={{ fontSize: "1rem" }}>
                          Dni: {professional.dni}
                        </Typography>
                        <EditButton onClick={() => handleEdit(professional)}>
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
          <p>No hay profesionales registrados</p>
        )}
      </Container>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={2000}
        onClose={handleCloseSnackBar}>
        <Alert variant="filled" severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Professionals;

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
