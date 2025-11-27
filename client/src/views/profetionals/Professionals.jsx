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
import DashboardBase from "../../components/DashboardBase";
import AddIcon from '@mui/icons-material/Add';
import { professionalSchema } from "../../schemas/professional.schema";
import {
  initializeProfessionalData,
  handleEdit,
  handleFieldChange,
  handleServiceFieldChange,
  handleServiceSelectChange,
  handleAddService,
  handleDeleteService,
  handleSave,
  handleCancel,
  handleCloseSnackBar,
  getServiceNameById
} from "../../editingFunctions/editingProfessionalsFunctions";

import EditModal from "../../components/EditModal";

const Professionals = () => {
  const { professionals: professionalData } = useSelector(
    (state) => state.professionals
  );

  const services = useSelector((state) => state.services.services);
  const tenantId = useSelector((state) => state.tenant.tenantId);
  console.log("tenantId", tenantId);
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
  const [selectedId, setSelectedId] = useState(null);
  const [openEditModal,setOpenEditModal]= useState(false);
  const [editingId, setEditingId] = useState(null);

  console.log('profesiionales',professionalData);
  console.log(professionalDataToUpdate);
  console.log(editingProfessional);
  console.log(selectedId);
  console.log('editingid desde prof',editingId);
  
  
  console.log('servicios desde professional.jsx',services);
  
   

  useEffect(() => {
    dispatch(getProfessionals(tenantId));
    dispatch(getServices(tenantId));
  }, [dispatch]);

    // Cuando cambia selectedId, abrimos modal y cargamos profesional
  useEffect(() => {
    if (!editingId) return;

    const prof = professionalData.find(
      (p) => p.Professional.dni === editingId
    );

    if (prof) {
      setProfessionalDataToUpdate({
        dni: prof.Professional.dni,
        name: prof.Professional.name,
        phone: prof.Professional.phone || "",
        mail: prof.Professional.mail || "",
        services: prof.Professional.services || [],
      });

      setOpenEditModal(true);
    }
  }, [editingId, professionalData]);

  // Guardar desde modal
  const onSaveModal = async () => {
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

    setOpenEditModal(false);
    setSelectedId(null);
    setEditingId(null);

    await dispatch(getProfessionals(tenantId));
  };

  const onCancelModal = () => {
    setOpenEditModal(false);
    setSelectedId(null);
    setEditingId(null);
  };

  const onChangeModal = (updatedData) => {
    setProfessionalDataToUpdate(updatedData);
  };

  const schema = professionalSchema; // ya lo estás importando

   
  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

 
  return (

        <>
      <DashboardBase
        title="Profesionales"
        icon={<AddIcon />}
        buttonText="Nuevo Profesional"
        leftPanelData={professionalData}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setEditingId={setEditingId}
        tenantId={tenantId}
      />

      {/* 🔽 MODAL GENÉRICO EDITOR 🔽 */}
      <EditModal
        open={openEditModal}
        schema={schema}
        formData={professionalDataToUpdate}
        onChange={onChangeModal}
        onSave={onSaveModal}
        onCancel={onCancelModal}
        services={services}
      />

      <Snackbar
        open={openSnackBar}
        autoHideDuration={2000}
        onClose={handleCloseSnackBar}
      >
        <Alert variant="filled" severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
    
   
  );
};

export default Professionals;

