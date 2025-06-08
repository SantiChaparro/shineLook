import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Checkbox from "@mui/material/Checkbox"; // Importar Checkbox
import IconButton from "@mui/material/IconButton";
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
import { Icon } from "@mui/material";
import { css, styled } from "@mui/system";
import { calcPartial } from "../../assets/functions/calcPartial";
import statusAppointmentColor from "../../assets/functions/statusAppointmentColor";
import Badge from "../Badge/Badge";
import {jwtDecode} from "jwt-decode";


const GroupTable = ({
  event,
  setEventSelected,
  closeModal,
  reloadTable,
  setAppointmentsToPay,
  handleAttendedChange,
}) => {
  const dispatch = useDispatch();

  const { services } = useSelector((state) => state.services);
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

  const rol = JSON.parse(localStorage.getItem("loggedUser"));
  if (rol && rol.tokken) {
    const decodedToken = jwtDecode(rol.tokken);
    console.log('role',rol);
    
    console.log("Decoded Token:", decodedToken);
  }
  

  useEffect(() => {
    setEventTable(event);
  }, [reloadTable, event]);

  useEffect(() => {
    setAppointmentsToPay(selectedAppointments);
  }, [selectedAppointments, setAppointmentsToPay]);

  const handleSelectAppointment = (idAppointment) => {
    setSelectedAppointments((prev) => {
      if (prev.includes(idAppointment)) {
        return prev.filter((id) => id !== idAppointment);
      } else {
        return [...prev, idAppointment];
      }
    });
  };

  const deleteAppointment = async (idAppointment) => {
    const response = await axios.delete(
      `${urlApi}appointment/${idAppointment}`
    );

    const updateEvent = event.filter(
      (app) => app.idAppointment !== idAppointment
    );

    if (updateEvent.length === 0) {
      dispatch(getAppointments());
      setEventSelected([]);
      closeModal();
    } else {
      dispatch(getAppointments());
      setEventSelected(updateEvent);
    }
  };

  /**
   *
   * @description: Permite controlar el renderizado condicional de los botones de edit, cancel, save, delete.
   * State: cancela la edicion y ademas limpia los objetos de los estados de edicion
   *
   * @param {string} flag:  "Prof","Cost","State"
   *
   *
   */
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
    } else if (
      idAppointment === Number(newProfessional.idAppointment) &&
      proffesionalDni !== Number(newProfessional.professionalDni)
    ) {
      const changeProfesional = await axios.patch(
        `${urlApi}appointment/${newProfessional.idAppointment}`,
        { professionalDni: newProfessional.professionalDni }
      );
      // Actualizar localmente eventTable después de la actualización exitosa
      const professional = await professionals.find(
        (prof) => prof.dni === Number(newProfessional.professionalDni)
      );

      if (professional) {
        const updatedEventTable = eventTable.map((app) => {
          if (app.idAppointment === idAppointment) {
            // Actualizar el professionalDni en el evento correspondiente
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
      if (idAppointment === newCost.idAppointment && cost !== newCost.cost) {
        const changeCost = await axios.patch(
          `${urlApi}appointment/${newCost.idAppointment}`,
          { cost: newCost.cost }
        );
        if (changeCost) {
          const updatedEventTable = eventTable.map((app) => {
            if (app.idAppointment === idAppointment) {
              // Actualizar el professionalDni en el evento correspondiente
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
    }
  };

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell className="cell" align="center">
              Seleccionar
            </TableCell>
            <TableCell className="cell" align="center">
              Servicio
            </TableCell>
            <TableCell className="cell" align="center">
              Inicio
            </TableCell>
            <TableCell className="cell" align="center">
              Fin
            </TableCell>
            <TableCell className="cell" align="center">
              Profesional
            </TableCell>
            <TableCell className="cell" align="center">
              Pago realizado
            </TableCell>
            <TableCell className="cell" align="center">
              Valor servicio
            </TableCell>
            <TableCell className="cell" align="center">
              Pago
            </TableCell>
            <TableCell className="cell" align="center">
              Asistio
            </TableCell>
            <TableCell className="cell" align="center">
              Confirmar asistencia
            </TableCell>
            <TableCell className="cell" align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflow: "hidden" }}>
          {eventTable &&
            eventTable.map((app) => (
              <TableRow key={app.idAppointment}>
                <TableCell
                  align="center"
                  sx={{
                    borderLeft: `5px solid ${statusAppointmentColor(
                      app.cost,
                      calcPartial(app.payments),
                      app.attended
                    )} !important`,
                  }}>
                  <Checkbox
                    checked={selectedAppointments.includes(app.idAppointment)}
                    onChange={() => handleSelectAppointment(app.idAppointment)}
                    disabled={
                      app.status
                        ? true
                        : false || app.attended !== "Sin especificar"
                        ? true
                        : false || editState
                        ? true
                        : false
                    }
                  />
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {app.serviceName}
                </TableCell>
                <TableCell align="center">
                  {dayjs(app.start).format("HH:mm")}
                </TableCell>
                <TableCell align="center">
                  {dayjs(app.end).format("HH:mm")}
                </TableCell>
                <TableCell align="center">
                  {editProf &&
                  newProfessional.idAppointment === app.idAppointment ? (
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="listProfessionals"
                        select
                        label="Profesional"
                        defaultValue={newProfessional.professionalDni}
                        style={{ width: "100%" }}
                        onChange={handleSelectProf}
                        size="small">
                        {listProfessional.map((prof) => (
                          <MenuItem
                            key={prof.dni}
                            value={prof.dni}
                            id={prof.dni}>
                            {prof.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </ThemeProvider>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                      }}>
                      {app.nameProfessional}
                      {!app.status && !editCost && app.attended === "Sin especificar" && (
                        <IconButton
                          onClick={() =>
                            editAppointment(
                              app.serviceId,
                              app.idAppointment,
                              app.start,
                              app.end
                            )
                          }>
                          <EditIcon sx={{ width: "20px" }} />
                        </IconButton>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell align="center">
                  $ {calcPartial(app.payments)}
                </TableCell>

                <TableCell align="center">
                  {editCost &&
                  Number(app.idAppointment) ===
                    Number(newCost.idAppointment) ? (
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="editCost"
                        label={`Ref: $${app.cost}`}
                        placeholder="$"
                        value={newCost.cost}
                        style={{ width: "50%" }}
                        onChange={handleChangeCost}
                        size="small"></TextField>
                    </ThemeProvider>
                  ) : (
                    <div>
                      $ {app.cost}
                      {!app.status && !editProf && app.attended === "Sin especificar" && (
                        <IconButton
                          onClick={() =>
                            handleEditCost(app.idAppointment, app.cost)
                          }>
                          <EditIcon sx={{ width: "20px" }} />
                        </IconButton>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell align="center">
                  
                    {/* <div
                      className={
                        calcPartial(app.payments) > 0 &&
                        calcPartial(app.payments) < app.cost
                          ? "statePaidPartial"
                          : calcPartial(app.payments) === 0
                          ? "statePaidFalse"
                          : "statePaidTrue"
                      }></div> */}
                  

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
                  {/* <TableCell align="center"> */}
                  {/* <div
                      className={
                        app.attended === "Sin especificar"
                          ? "statePaidGray"
                          : app.attended === "Si"
                            ? "statePaidTrue"
                            : app.attended === "No"
                              ? "statePaidFalse"
                              : null
                      }></div> */}
                  {/* </TableCell> */}

                  <Badge
                    state={
                      app.attended === "Si"
                        ? "success"
                        : app.attended === "No"
                        ? "error"
                        : "undefined"
                    }
                    text={
                      app.attended !== "Sin especificar"
                        ? app.attended
                        : "Indefinido"
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}>
                    <OkButton
                      disabled={
                        app.attended !== "Sin especificar" ||
                        editState ||
                        app.cost > calcPartial(app.payments)
                          ? true
                          : false
                      }
                      onClick={() =>
                        handleAttendedChange(app.idAppointment, "Si")
                      }>
                      Si
                    </OkButton>
                    {/* <NoButton
                      disabled={
                        app.attended !== "Sin especificar" || editState
                          ? true
                          : false
                      }
                      onClick={() =>
                        handleAttendedChange(app.idAppointment, "No")
                      }>
                      No
                    </NoButton> */}
                  </div>
                </TableCell>

                <TableCell align="center">
                  {!app.status && (
                    <>
                      {editProf &&
                        !editCost &&
                        newProfessional.idAppointment === app.idAppointment && (
                          <IconButton
                            onClick={() =>
                              handleSaveChange(
                                app.idAppointment,
                                app.professionalDni
                              )
                            }>
                            <SaveIcon />
                          </IconButton>
                        )}
                      {!editProf &&
                        editCost &&
                        newCost.idAppointment === app.idAppointment && (
                          <IconButton
                            onClick={() =>
                              handleSaveChangeCost(app.idAppointment, app.cost)
                            }>
                            <SaveIcon />
                          </IconButton>
                        )}

                      {editState &&
                      (newProfessional.idAppointment === app.idAppointment ||
                        newCost.idAppointment === app.idAppointment) ? (
                        <IconButton onClick={() => changeState("State")}>
                          <CancelIcon />
                        </IconButton>
                      ) : app.attended == "Sin especificar" ? (
                        <IconButton
                          disabled={
                            rol.tokken.role !== "Master" &&
                            calcPartial(app.payments) > 0
                          }
                          onClick={() => deleteAppointment(app.idAppointment)}>
                          <DeleteIcon />
                        </IconButton>
                      ) : null}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupTable;

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
  red: {
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
    950: "#5F0707",
  },
  orange: {
    50: "#FFF3E0",
    100: "#FFE0B2",
    200: "#FFCC80",
    300: "#FFB74D",
    400: "#FFA726",
    500: "#FF9800",
    600: "#FB8C00",
    700: "#F57C00",
    800: "#EF6C00",
    900: "#E65100",
    950: "#BF360C",
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
  950: "#5F0707",
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

const OkButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 5px 10px;
    border-radius: 5px;
    transition: all 150ms ease;
    cursor: pointer;
    background: linear-gradient(to bottom, var(--dell-500), var(--dell-600));
    color: ${theme.palette.mode === "dark"
      ? "var(--dell-50)"
      : "var(--dell-950)"};
    border: none;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover:not(:disabled) {
      background: linear-gradient(to bottom, var(--dell-600), var(--dell-700));
      color: ${theme.palette.mode === "dark"
        ? "var(--dell-50)"
        : "var(--dell-950)"};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    &:active:not(:disabled) {
      background: ${theme.palette.mode === "dark"
        ? "var(--dell-700)"
        : "var(--dell-300)"};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? "var(--dell-300)" : "var(--dell-200)"};
      outline: none;
    }

    &:disabled {
      background: #ccc;
      color: #666;
      cursor: not-allowed;
    }
  `
);

const NoButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 5px 10px;
    border-radius: 5px;
    transition: all 150ms ease;
    cursor: pointer;
    background: linear-gradient(to bottom, ${red[600]}, ${red[700]});
    color: ${red[50]};
    border: none;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover:not(:disabled) {
      background: linear-gradient(to bottom, ${red[700]}, ${red[800]});
      border-color: ${theme.palette.mode === "dark" ? red[600] : red[300]};
      color: ${theme.palette.mode === "dark" ? red[100] : red[50]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    &:active:not(:disabled) {
      background: ${theme.palette.mode === "dark" ? red[800] : red[400]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? red[300] : red[200]};
      outline: none;
    }

    &:disabled {
      background: #ccc;
      color: #666;
      cursor: not-allowed;
    }
  `
);
