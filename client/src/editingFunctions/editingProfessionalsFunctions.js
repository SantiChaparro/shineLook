export const initializeProfessionalData = (professional) => ({
  dni: professional.dni,
  name: professional.name,
  phone: professional.phone ?? "",
  mail: professional.mail ?? "",
  services: (professional.services || []).map(s => ({
    idService: s.idService,
    primary: s.primary,
    secondary: s.secondary,
    isServiceSaved: true,
  })),
});

export const handleEdit = (
  professional,
  setEditingProfessional,
  setIsEditing,
  setAddServices,
  setProfessionalDataToUpdate
) => {
  
  setEditingProfessional(professional);
  setIsEditing(true);
  setAddServices(false);

  setProfessionalDataToUpdate({
    dni: professional.dni,
    name: professional.name,
    phone: professional.phone || "",
    mail: professional.mail || "",
    services: professional.services
      ? professional.services.map((s) => ({
          idService: s.idService,
          primary: s.primary,
          secondary: s.secondary,
          isServiceSaved: true,
        }))
      : [],
  });
};

 export const handleFieldChange = (e,setProfessionalDataToUpdate) => {
    const { name, value } = e.target;
    setProfessionalDataToUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  export const handleServiceFieldChange = (index, fieldName, value,professionalDataToUpdate,setProfessionalDataToUpdate) => {
    const updatedServices = [...professionalDataToUpdate.services];
    if (index >= 0 && index < updatedServices.length) {
      updatedServices[index][fieldName] = value;
      setProfessionalDataToUpdate((prevState) => ({
        ...prevState,
        services: updatedServices,
      }));
    }
  };

    export const handleServiceSelectChange = (value,professionalDataToUpdate,setProfessionalDataToUpdate) => {
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

  export  const handleAddService = (setAddServices,setProfessionalDataToUpdate) => {
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

  export   const handleDeleteService = (index,professionalDataToUpdate,setProfessionalDataToUpdate) => {
    const updatedServices = [...professionalDataToUpdate.services];
    updatedServices.splice(index, 1);
    setProfessionalDataToUpdate((prevState) => ({
      ...prevState,
      services: updatedServices,
    }));
  };


  export  const handleSave = async (
    professionalDataToUpdate,
    updateProfessional,
    dispatch,
    setSuccessMessage,
    setOpenSnackBar,
    setEditingProfessional,
    setIsEditing,
    getProfessionals,
    tenantId) => {
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
      await dispatch(getProfessionals(tenantId));
    };

    export const handleCancel = (setEditingProfessional,setIsEditing,setAddServices) => {
    setEditingProfessional(null);
    setIsEditing(false);
    setAddServices(false); // Reiniciar el estado addServices
  };

   export const handleCloseSnackBar = (setOpenSnackBar) => {
    setOpenSnackBar(false);
  };

  export const getServiceNameById = (id,services) => {
    const service = services.find((service) => service.id === id);
    return service ? service.service_name : ""; // Retorna el nombre del servicio si se encuentra, de lo contrario, una cadena vacía
  };