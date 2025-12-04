import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { urlApi } from "../../assets/urlApi";
import { getAppointments } from "../../redux/slices/appointments/thunks";
import "./GroupTable.css";
import Badge from "../Badge/Badge";
import statusAppointmentColor from "../../assets/functions/statusAppointmentColor";
import { calcPartial } from "../../assets/functions/calcPartial";

const GroupTable = ({
  event,
  setEventSelected,
  closeModal,
  reloadTable,
  setAppointmentsToPay,
  handleAttendedChange,
}) => {
  console.log('list de eventos',event);
  
  const dispatch = useDispatch();
  const { professionals } = useSelector((state) => state.professionals);

  const [editState, setEditState] = useState(false);
  const [editCost, setEditCost] = useState(false);
  const [editProf, setEditProf] = useState(false);

  const [newProfessional, setNewProfessional] = useState({
    idAppointment: "",
    professionalDni: "",
  });
  const [newCost, setNewCost] = useState({
    idAppointment: "",
    cost: "",
  });

  const [listProfessional, setListProfessional] = useState("");
  const [eventTable, setEventTable] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
console.log('citas seleccionadas', selectedAppointments);

  useEffect(() => {
    setEventTable(event);
  }, [reloadTable, event]);

  useEffect(() => {
    setAppointmentsToPay(selectedAppointments);
  }, [selectedAppointments, setAppointmentsToPay]);

  const handleSelectAppointment = (idAppointment) => {
    console.log('id de cita seleccionada',idAppointment);
    
    setSelectedAppointments((prev) => {
      if (prev.includes(idAppointment)) {
        return prev.filter((id) => id !== idAppointment);
      } else {
        return [...prev, idAppointment];
      }
    });
  };

  const deleteAppointment = async (idAppointment) => {
    await axios.delete(`${urlApi}appointment/${idAppointment}`);
    const updateEvent = event.filter((app) => app.idAppointment !== idAppointment);

    if (updateEvent.length === 0) {
      dispatch(getAppointments());
      setEventSelected([]);
      closeModal();
    } else {
      dispatch(getAppointments());
      setEventSelected(updateEvent);
    }
  };

  const changeState = (flag) => {
    if (flag === "Prof") {
      setEditState(true);
      setEditProf(true);
      setEditCost(false);
    }
    if (flag === "Cost") {
      setEditState(true);
      setEditProf(false);
      setEditCost(true);
    }
    if (flag === "State") {
      setEditState(false);
      setEditProf(false);
      setEditCost(false);
      setNewProfessional({ idAppointment: "", professionalDni: "" });
      setNewCost({ idAppointment: "", cost: "" });
    }
  };

  const handleEditCost = (idAppointment, cost) => {
    setNewCost({ idAppointment: idAppointment, cost: cost });
    changeState("Cost");
  };

  const handleChangeCost = (e) => {
    const cost = e.target.value;
    setNewCost({ ...newCost, cost: cost });
  };

  const editAppointment = (serviceId, idAppointment) => {
    setNewProfessional({ ...newProfessional, idAppointment: idAppointment });
    changeState("Prof");

    const professionalsByServices = professionals.filter((prof) => {
      return (
        prof.services &&
        Array.isArray(prof.services) &&
        prof.services.some((service) => service.idService === Number(serviceId))
      );
    });
    setListProfessional(professionalsByServices);
  };

  const handleSelectProf = (e) => {
    const dniProf = e.target.value;
    setNewProfessional({ ...newProfessional, professionalDni: dniProf });
  };

  const handleSaveChange = async (idAppointment, proffesionalDni) => {
    if (
      Number(newProfessional.professionalDni) === 0 ||
      (idAppointment === Number(newProfessional.idAppointment) &&
        proffesionalDni === Number(newProfessional.professionalDni))
    ) {
      changeState("State");
    } else {
      const changeProfesional = await axios.patch(
        `${urlApi}appointment/${newProfessional.idAppointment}`,
        { professionalDni: newProfessional.professionalDni }
      );

      const professional = professionals.find(
        (prof) => prof.dni === Number(newProfessional.professionalDni)
      );

      if (professional) {
        const updatedEventTable = eventTable.map((app) => {
          if (app.idAppointment === idAppointment) {
            return {
              ...app,
              professionalDni: newProfessional.professionalDni,
              nameProfessional: professional.name,
            };
          }
          return app;
        });
        setEventTable(updatedEventTable);
        setEventSelected(updatedEventTable);
      }
      changeState("State");
    }
  };

  const handleSaveChangeCost = async (idAppointment, cost) => {
    if (
      cost === "" ||
      (idAppointment === newCost.idAppointment && cost === newCost.cost)
    ) {
      changeState("State");
    } else {
      const changeCost = await axios.patch(
        `${urlApi}appointment/${newCost.idAppointment}`,
        { cost: newCost.cost }
      );
      if (changeCost) {
        const updatedEventTable = eventTable.map((app) => {
          if (app.idAppointment === idAppointment) {
            return {
              ...app,
              cost: newCost.cost,
            };
          }
          return app;
        });
        setEventTable(updatedEventTable);
        setEventSelected(updatedEventTable);
      }
      changeState("State");
    }
  };

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Seleccionar</TableCell>
            <TableCell align="center">Servicio</TableCell>
            <TableCell align="center">Inicio</TableCell>
            <TableCell align="center">Fin</TableCell>
            <TableCell align="center">Profesional</TableCell>
            <TableCell align="center">Pago realizado</TableCell>
            <TableCell align="center">Valor servicio</TableCell>
            <TableCell align="center">Pago</TableCell>
            <TableCell align="center">Asistio</TableCell>
            <TableCell align="center">Confirmar asistencia</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {event && event.length > 0 ? (
            event.map((app) => (
              <TableRow key={app.idAppointment}>
                <TableCell align="center">
                  <Checkbox
                    checked={selectedAppointments.includes(app.idAppointment)}
                    onChange={() => handleSelectAppointment(app.idAppointment)}
                    disabled={app.status || app.attended !== "Sin especificar"}
                  />
                </TableCell>

                <TableCell align="center">{app.serviceName}</TableCell>
                <TableCell align="center">{dayjs(app.start).format("HH:mm")}</TableCell>
                <TableCell align="center">{dayjs(app.end).format("HH:mm")}</TableCell>

                <TableCell align="center">{app.nameProfessional}</TableCell>

                {/* Mostrar pago solo si hay citas */}
                <TableCell align="center">
                  {event.length > 0 ? `$ ${calcPartial(app.payments)}` : "-"}
                </TableCell>

                <TableCell align="center">{app.cost}</TableCell>

                <TableCell align="center">
                  <Badge
                    state={
                      calcPartial(app.payments) > 0 &&
                      calcPartial(app.payments) < app.cost
                        ? "partial"
                        : calcPartial(app.payments) === 0
                        ? "error"
                        : "success"
                    }
                    text={
                      calcPartial(app.payments) > 0 &&
                      calcPartial(app.payments) < app.cost
                        ? "Parcial"
                        : calcPartial(app.payments) === 0
                        ? "Nulo"
                        : "Completo"
                    }
                  />
                </TableCell>

                <TableCell align="center">
                  <Badge
                    state={
                      app.attended === "Si"
                        ? "success"
                        : app.attended === "No"
                        ? "error"
                        : "undefined"
                    }
                    text={app.attended !== "Sin especificar" ? app.attended : "Indefinido"}
                  />
                </TableCell>

                <TableCell align="center">
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <Button
                      disabled={app.attended !== "Sin especificar" || app.cost > calcPartial(app.payments)}
                      onClick={() => handleAttendedChange(app.idAppointment, "Si")}
                    >
                      Si
                    </Button>
                  </div>
                </TableCell>

                <TableCell align="center">
                  {!app.status && (
                    <>
                      {editProf &&
                        !editCost &&
                        newProfessional.idAppointment === app.idAppointment && (
                          <IconButton onClick={() => handleSaveChange(app.idAppointment, app.professionalDni)}>
                            <SaveIcon />
                          </IconButton>
                        )}
                      {!editProf &&
                        editCost &&
                        newCost.idAppointment === app.idAppointment && (
                          <IconButton onClick={() => handleSaveChangeCost(app.idAppointment, app.cost)}>
                            <SaveIcon />
                          </IconButton>
                        )}
                      {editState &&
                      (newProfessional.idAppointment === app.idAppointment ||
                        newCost.idAppointment === app.idAppointment) ? (
                        <IconButton onClick={() => changeState("State")}>
                          <CancelIcon />
                        </IconButton>
                      ) : app.attended === "Sin especificar" ? (
                        <IconButton onClick={() => deleteAppointment(app.idAppointment)}>
                          <DeleteIcon />
                        </IconButton>
                      ) : null}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} align="center">
                No hay citas seleccionadas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupTable;
