import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Snackbar
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
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
import { Typography } from "@mui/material";
import EditModal from "../../components/EditModal";
import NewProfessionalForm from "../NewProfessionalForm/NewProfessionalForm";
import axios from "axios";
import ProfessionalRightPanel from '../../components/ProfessionalsRightPanel';
import LeftPanelItemContent from "../../components/LeftPanelItemContent";
import { urlApi } from "../../assets/urlApi";

const frontUrl = urlApi

console.log(frontUrl);



const Professionals = () => {
  const { professionals: professionalData } = useSelector(
    (state) => state.professionals
  );

  console.log('profesionales', professionalData);
  
  const appointments = useSelector((state) => state.appointment.appointments);

  const services = useSelector((state) => state.services.services);
  const tenantId = useSelector((state) => state.tenant.tenantId);

  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [professionalDataToUpdate, setProfessionalDataToUpdate] = useState({
    dni: "",
    name: "",
    phone: "",
    mail: "",
    services: [],
  });

  const [selectedId, setSelectedId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // NUEVO: estado del formulario de creación
  const [newProfessionalForm, setNewProfessionalForm] = useState(false);
   const [rating,setRating]= useState(null);
    const [professionalTotalAmount,setProfessionalTotalAmount]= useState(0);
  console.log(newProfessionalForm);
  console.log(rating);
  

  useEffect(() => {
    dispatch(getProfessionals(tenantId));
    dispatch(getServices(tenantId));
  }, [dispatch]);

  // Cuando cambia editingId, cargamos profesional y abrimos modal
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

  const schema = professionalSchema;

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleNewProfessionalForm = () => {
    setNewProfessionalForm(true);
  };

  const handleProfessionalSelection = async (item) => {
  const dni = item.id;
  setSelectedId(dni);


  // 1️⃣ Traer rating
  const dbRating = await axios.get(
    `${frontUrl}/rating/dataBaseRating`,
    {
      params: {
        tenantId: tenantId,
        professionalId: dni
      }
    }
  );
  setRating(dbRating.data);

  // 2️⃣ Filtrar citas pagadas del profesional luego pasar esta logica a professionals.jsx
  const professionalAppointments = appointments.filter(
    (appointment) =>
      appointment.ProfessionalDni === dni && appointment.paid === true // boolean, no string
  );

  // 3️⃣ Calcular total de depositAmount pasar esta logica a professional.jsx
  const totalAmount = professionalAppointments.reduce((total, appointment) => {
    const appointmentDeposit = appointment.Payments.reduce(
      (sum, payment) => sum + payment.depositAmount,
      0
    );
    return total + appointmentDeposit;
  }, 0);

  setProfessionalTotalAmount(totalAmount);
};

//normalizamos el objeto que se va a enviar

const items = professionalData.map(p=>({
  id: p.Professional.dni,
  name: p.Professional.name,
  ratingAverage: p.ratingAverage,
  totalAmount: professionalTotalAmount || 0,
  profileImage: p.Professional.profileImage

})) 


  return (
    <>
      {/* 🔥 Si newProfessionalForm está activo, se muestra el formulario */}
      {newProfessionalForm ? (
        <NewProfessionalForm
          tenantId={tenantId}
          setNewProfessionalForm={setNewProfessionalForm}
        />
      ) : (
        <>
          {/* DASHBOARD */}
        <DashboardBase
  title="Profesionales"
  icon={<AddIcon />}
  buttonText="Nuevo Profesional"
  data={items}
  selectedId={selectedId}
  onSelect={handleProfessionalSelection}
  onEdit={setEditingId}
  onButtonClick={handleNewProfessionalForm}
  renderLeftItem={(item) => (
    <LeftPanelItemContent
      name={item.name}
      dni={item.id}
    />
  )}
  rightPanel={
    <ProfessionalRightPanel
      selectedProfessional={items.find(i => i.id === selectedId)}
      rating={rating}
      totalAmount={professionalTotalAmount}
      tenantId={tenantId}
    />
  }
/>

          {/* MODAL EDITOR */}
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
      )}
    </>
  );
};

export default Professionals;
