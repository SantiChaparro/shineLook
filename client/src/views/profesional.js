//este aechivo contiene el codigo original de Professional en caso que no ande el que estoy haciendo
// const handleEdit = (professional) => {
  //   setEditingProfessional(professional);
  //   setIsEditing(true);
  //   setAddServices(false); // Reiniciar el estado addServices
  //   // Prellenar los datos del profesional en el formulario de edición
  //   setProfessionalDataToUpdate({
  //     dni: professional.dni,
  //     name: professional.name,

  //     phone: professional.phone ? professional.phone : "" ,
  //     mail: professional.mail ? professional.mail : "",
  //     services: professional.services ?

  //      professional.services.map((service) => ({
  //       idService: service.idService,
  //       primary: service.primary,
  //       secondary: service.secondary,
  //       isServiceSaved: true, // Los servicios ya existentes se marcan como guardados
  //     })): [],
  //   });
  // };

  // const handleFieldChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfessionalDataToUpdate((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  // const handleServiceFieldChange = (index, fieldName, value) => {
  //   const updatedServices = [...professionalDataToUpdate.services];
  //   if (index >= 0 && index < updatedServices.length) {
  //     updatedServices[index][fieldName] = value;
  //     setProfessionalDataToUpdate((prevState) => ({
  //       ...prevState,
  //       services: updatedServices,
  //     }));
  //   }
  // };

  // const handleServiceSelectChange = (value) => {
  //   // Actualizar el servicio seleccionado con el valor del ID del servicio
  //   const updatedServices = [...professionalDataToUpdate.services];
  //   const emptyServiceIndex = updatedServices.findIndex(
  //     (service) => service.idService === ""
  //   );
  //   if (emptyServiceIndex !== -1) {
  //     updatedServices[emptyServiceIndex].idService = value;
  //     setProfessionalDataToUpdate((prevState) => ({
  //       ...prevState,
  //       services: updatedServices,
  //     }));
  //   }
  // };

  // const handleAddService = () => {
  //   setAddServices(true); // Cambiar el estado para mostrar los campos de agregar servicio

  //   // Agregar un nuevo servicio vacío al estado de professionalDataToUpdate
  //   setProfessionalDataToUpdate((prevState) => ({
  //     ...prevState,
  //     services: [
  //       ...prevState.services,
  //       { idService: "", primary: "", secondary: "", isServiceSaved: false },
  //     ],
  //   }));
  // };

  // const handleDeleteService = (index) => {
  //   const updatedServices = [...professionalDataToUpdate.services];
  //   updatedServices.splice(index, 1);
  //   setProfessionalDataToUpdate((prevState) => ({
  //     ...prevState,
  //     services: updatedServices,
  //   }));
  // };

  // const handleSave = async () => {
  //   const resp = await dispatch(
  //     updateProfessional(professionalDataToUpdate, professionalDataToUpdate.dni)
  //   );
  //   if (resp.successMessage) {
  //     setSuccessMessage(resp.successMessage);
  //     setOpenSnackBar(true);
  //   } else {
  //     setSuccessMessage("Error al modificar");
  //     setOpenSnackBar(true);
  //   }
  //   setEditingProfessional(null);
  //   setIsEditing(false);
  //   await dispatch(getProfessionals(tenantId));
  // };

  // const handleCancel = () => {
  //   setEditingProfessional(null);
  //   setIsEditing(false);
  //   setAddServices(false); // Reiniciar el estado addServices
  // };
// 
// const getServiceNameById = (id) => {
  //   const service = services.find((service) => service.id === id);
  //   return service ? service.service_name : ""; // Retorna el nombre del servicio si se encuentra, de lo contrario, una cadena vacía
  // };

   // <ThemeProvider theme={theme}>
    //   <Container maxWidth="xl" style={{ padding: "20px" }}>
    //     {professionalData.length > 0 ? (
    //       <Grid container spacing={2}>
    //         {professionalData.map((professional, index) => (
    //           <Grid item xs={12} key={index}>
    //             <Card
    //               variant="outlined"
    //               sx={{
    //                 transition: "width 0.8s ease",
    //                 minWidth: "50%",
    //                 width: "fit-content",
    //                 margin: "auto",
    //                 display: "flex",
    //                 flexDirection: "column",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 borderRadius: "1.2 rem",
    //                 boxShadow:
    //                   editingProfessional === professional &&
    //                   "0px 8px 16px rgba(0, 0, 0, 0.5)",
    //                 "&:hover": {
    //                   boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5)", // Cambia la sombra al hacer hover
    //                 },
    //               }}>
    //               <CardContent
    //                 sx={{
    //                   display: "flex",
    //                   flexDirection: "row",
    //                   gap: "10px",
    //                   justifyContent: "center",
    //                   alignItems: "center",
    //                 }}>
    //                 {editingProfessional === professional.Professional ? (
    //                   <div
    //                     style={{
    //                       width: "100%",
    //                       display: "flex",
    //                       flexDirection: "column",
    //                       alignItems: "center",
    //                       justifyContent: "center",
    //                       gap: "20px",
    //                     }}>
    //                     <Box
    //                       sx={{
    //                         width: "100%",
    //                         display: "flex",
    //                         flexDirection: "row",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                         gap: "20px",
    //                       }}>
    //                       <TextField
    //                         label="Nombre"
    //                         name="name"
    //                         onChange={handleFieldChange}
    //                         value={professionalDataToUpdate.name}
    //                         size="small"
    //                       />
    //                       <TextField
    //                         label="Dni"
    //                         value={professionalDataToUpdate.dni}
    //                         disabled
    //                         size="small"
    //                       />

    //                       <TextField
    //                         label="Teléfono"
    //                         name="phone"
    //                         onChange={handleFieldChange}
    //                         value={professionalDataToUpdate.phone}
    //                         size="small"
    //                       />
    //                       <TextField
    //                         label="Correo electrónico"
    //                         name="mail"
    //                         onChange={handleFieldChange}
    //                         value={professionalDataToUpdate.mail}
    //                         size="small"/>
    //                     </Box>

    //                     {professionalDataToUpdate.services.map(
    //                       (service, serviceIndex) => (
    //                         <Box
    //                           key={serviceIndex}
    //                           sx={{
    //                             display: "flex",
    //                             flexDirection: "row",
    //                             gap: "20px",
    //                             width: "100%",
    //                             justifyContent: "center",
    //                           }}>
    //                           <TextField
    //                             label="Servicio"
    //                             value={getServiceNameById(service.idService)}
    //                             disabled={true} // El nombre del servicio no se puede editar
    //                             size="small"
    //                           />
    //                           <TextField
    //                             label="Comisión primaria"
    //                             value={service.primary}
    //                             onChange={(e) =>
    //                               handleServiceFieldChange(
    //                                 serviceIndex,
    //                                 "primary",
    //                                 e.target.value
    //                               )
    //                             }
    //                             size="small"
    //                           />
    //                           <TextField
    //                             label="Comisión secundaria"
    //                             value={service.secondary || ""}
    //                             onChange={(e) =>
    //                               handleServiceFieldChange(
    //                                 serviceIndex,
    //                                 "secondary",
    //                                 e.target.value
    //                               )
    //                             }
    //                             size="small"
    //                           />

    //                           <IconButton
    //                             onClick={() =>
    //                               handleDeleteService(serviceIndex)
    //                             }
    //                             sx={{
    //                               "&:hover": {
    //                                 color: red[900], // Cambia el color al hacer hover
    //                               },
    //                             }}>
    //                             <DeleteIcon />
    //                           </IconButton>
    //                         </Box>
    //                       )
    //                     )}
    //                     <div
    //                       style={{
    //                         display: "flex",
    //                         flexDirection: "row",
    //                         width: "50%",
    //                         gap: "20px",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                       }}>
    //                       {addServices && (
    //                         <TextField
    //                           select
    //                           label="Seleccione un servicio"
    //                           sx={{ width: "45%" }}
    //                           value="" // Valor inicial vacío, para seleccionar un servicio
    //                           onChange={(e) =>
    //                             handleServiceSelectChange(e.target.value)
    //                           }
    //                           size="small">
    //                           {services.map((service, index) => (
    //                             <MenuItem key={service.id} value={service.id}>
    //                               {service.service_name}
    //                             </MenuItem>
    //                           ))}
    //                         </TextField>
    //                       )}
    //                       <TriggerButton
    //                         onClick={handleAddService}
    //                         style={{ width: "auto" }}>
    //                         Agregar Servicio
    //                       </TriggerButton>
    //                     </div>
    //                     <div>
    //                       <TriggerButton
    //                         variant="contained"
    //                         onClick={() =>
    //                           handleSave(
    //                             professionalDataToUpdate,
    //                             professional.dni
    //                           )
    //                         }>
    //                         Guardar
    //                       </TriggerButton>
    //                       <CancelButton
    //                         variant="contained"
    //                         onClick={handleCancel}>
    //                         Cancelar
    //                       </CancelButton>
    //                     </div>
    //                   </div>
    //                 ) : (
    //                   <>
    //                     <Typography
    //                       variant="h5"
    //                       component="div"
    //                       sx={{ fontSize: "1rem" }}>
    //                       {professional.Professional.name}
    //                     </Typography>
    //                     <Typography
    //                       color="text.secondary"
    //                       component="div"
    //                       sx={{ fontSize: "1rem" }}>
    //                       Dni: {professional.Professional.dni}
    //                     </Typography>
    //                     <EditButton onClick={() => handleEdit(professional.Professional)}>
    //                       Editar
    //                     </EditButton>
    //                   </>
    //                 )}
    //               </CardContent>
    //             </Card>
    //           </Grid>
    //         ))}
    //       </Grid>
    //     ) : (
    //       <p>No hay profesionales registrados</p>
    //     )}
    //   </Container>
    //   <Snackbar
    //     open={openSnackBar}
    //     autoHideDuration={2000}
    //     onClose={handleCloseSnackBar}>
    //     <Alert variant="filled" severity="success">
    //       {successMessage}
    //     </Alert>
    //   </Snackbar>
    // </ThemeProvider>