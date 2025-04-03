import { Modal as BaseModal } from "@mui/base/Modal";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { createTheme } from "@mui/material/styles";
import { css, styled, ThemeProvider } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { urlApi } from "../../assets/urlApi";
import { getAppointments } from "../../redux/slices/appointments/thunks";
import NewCustomerForm from "../../views/NewCustomerForm/NewCustomerForm";
import BasicDatePicker from "../calendar/DatePicker";
import "./NewBooking.css";
import Loader from "../Loader/Loader";

const NewBooking = ({ openBooking, setOpenBooking, events, dateView }) => {
  const dispatch = useDispatch();

  const { professionals } = useSelector((state) => state.professionals);
  const { services } = useSelector((state) => state.services);
 

  const hoursWork = { start: "08:00", end: "21:00" };

  const [date, setDate] = useState(dayjs());

  const [newAppointment, setNewAppointment] = useState({
    date: dateView,
    time: "",
    duration: 30,
    dni: "",
    professionalDni: "0",
    serviceId: "0",
    deprived: false,
  });

  const [paid, setPaid] = useState({
    payment_day: dayjs().format("YYYY-MM-DD"),
    depositAmount: 0,
    payment_mode: "Efectivo",
    appointmentsId: [],
    amount: 0,
    isDeposit: true,
  });

  const [error, setError] = useState({
    dni: "",
    professional: "",
    service: "",
    time: "",
    enable: false,
  });
  const [clientStatus, setClientStatus] = useState({
    state: false,
    message: "",
  });
  const [showNewClient, setShowNewClient] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [hourProfessional, setHourProfessional] = useState([]);
  const [statusCheck, setStatusCheck] = useState(false);
  const [statusTime, setStatusTime] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDate(dateView);
    setNewAppointment({ ...newAppointment, date: dateView });
  }, [dateView]);

  const searchAppoinmentByProfessional = async (
    date,
    idProfessional,
    events
  ) => {
    const searchAppointments = events.filter(
      (app) =>
        app.professionalDni === Number(idProfessional) &&
        dayjs(app.start).isSame(dayjs(date), "day")
    );

    const filterHours = searchAppointments.map((app) => {
      return {
        start: app.start,
        end: app.end,
        disable: true,
      };
    });

    setHourProfessional(filterHours);
    return filterHours;
  };

  const handleChangeCheck = () => {
    setNewAppointment({
      ...newAppointment,
      deprived: !newAppointment.deprived,
    }); //esto lo usamos para marcar si el cliente es privado o no
  };

  const handleDepositCheck = () => {
    setDeposit(!deposit); //esto lo usamos para marcar si el cliente es privado o no
  };

  const shouldDisableTime = (value) => {
    if (!value || !value.hour) {
      return true;
    }

    const currentHour = value.toDate();
    const startHour = dayjs(hoursWork.start, "HH:mm");
    const endHour = dayjs(hoursWork.end, "HH:mm");

    return currentHour < startHour || currentHour >= endHour;
  };

  const availableSchedule = () => {
    const timeStart = newAppointment.time;
    const duration = dayjs(`${newAppointment.date}T${newAppointment.time}`)
      .add(`${newAppointment.duration}`, "minute")
      .toDate();
    const timeEnd = dayjs(duration, "HH:mm").format("HH:mm");

    const service = newAppointment.serviceId;
    const professional = newAppointment.professionalDni;

    if (
      timeStart &&
      Number(service) !== 0 &&
      Number(professional) !== 0 &&
      service &&
      professional
    ) {
      const isAvailable = !hourProfessional.some((slot) => {
        const start = dayjs(slot.start).format("HH:mm");
        const end = dayjs(slot.end).format("HH:mm");

        return (
          (timeStart >= start && timeStart < end) ||
          (timeEnd >= start && timeEnd < end)
        );
      });

      setStatusTime({
        status: isAvailable,
        message: isAvailable ? "Disponible" : "No disponible",
      });
    } else {
      setStatusTime({ status: false, message: "No disponible" });
    }
  };

  const validateEnableButton = () => {
    const { date, time, dni, professionalDni, serviceId } = newAppointment;

    if (
      !date ||
      !time ||
      !dni ||
      professionalDni === "0" ||
      serviceId === "0" ||
      !error.enable ||
      clientStatus.state === false
      // || statusTime.status === false  esta linea se comento para poder cumplir con el requerimiento de poder superponer los turnos
    ) {
      setEnableButton(false);
    } else {
      setEnableButton(true);
    }
  };

  const validateInput = (prop, state) => {
    const regexNum = /^\d+$/;
    switch (prop) {
      case "professional":
        if (!state.professionalDni || state.professionalDni === "0") {
          setError({
            ...error,
            professional: "Debe seleccionar profesional",
            enable: false,
          });
        } else {
          if (regexNum.test(state.professionalDni)) {
            setError({ ...error, professional: "", enable: true });
          } else {
            setError({
              ...error,
              professional: "El profesional no existe",
              enable: false,
            });
          }
        }
        break;
      case "service":
        if (!state.serviceId || state.serviceId === "0") {
          setError({
            ...error,
            service: "Debe seleccionar servicio",
            enable: false,
          });
        } else {
          if (regexNum.test(state.serviceId)) {
            setError({ ...error, service: "", enable: true });
          } else {
            setError({
              ...error,
              professionals: "El servicio no existe",
              enable: false,
            });
          }
        }
        break;
      case "time":
        if (!state.time) {
          setError({
            ...error,
            time: "Debe seleccionar una hora",
            enable: false,
          });
        } else if (state.time.isValid()) {
          setError({ ...error, time: "", enable: true });
        } else {
          if (state.time === "Invalid Date") {
            setError({ ...error, time: "Hora inválida", enable: false });
          }
        }
        break;

      case "dni":
        validateDni(state.dni);
        break;
      default:
        break;
    }
  };

  const handleOpen = () => {
    setOpenBooking(true);
  };

  const handleClose = () => {
    setOpenBooking(false);
    setNewAppointment({
      date: dateView,
      time: "",
      dni: "",
      duration: 30,
      professionalDni: "0",
      deprived: false,
      serviceId: "0",
    });

    setError({
      dni: "",
      professional: "",
      service: "",
      time: "",
      enable: false,
    });

    setClientStatus({
      state: false,
      message: "",
    });

    setShowNewClient(false);
    setEnableButton(false);
    setHourProfessional([]);
    setStatusTime({
      status: false,
      message: "",
    });
    setStatusCheck(false);

    setDeposit(false);

    setPaid({
      payment_day: dayjs().format("YYYY-MM-DD"),
      depositAmount: 0,
      payment_mode: "Efectivo",
      appointmentsId: [],
      amount: 0,
      isDeposit: true,
    })

    setLoading(false);
  };

  const [serviceFilter, setServiceFilter] = useState([]);

  

  const validateDni = async (dni) => {
    const regexDni = /^\d{8}$/;
    if (dni) {
      const trimmedDni = dni.trim();
      if (regexDni.test(trimmedDni)) {
        try {
          const response = await axios.get(`${urlApi}client/${trimmedDni}`);
          const existClient = response.data;

          if (existClient) {
            setClientStatus({ state: true, message: existClient.name });
            setError({ ...error, dni: "", enable: true });
            return true;
          } else {
            setClientStatus({ state: false, message: "Registre el cliente" });
            setError({ ...error, dni: "Registre el cliente", enable: false });
            return false;
          }
        } catch (error) {
          setClientStatus({
            state: false,
            message: "Error al obtener el cliente",
          });
          setError({
            ...error,
            dni: "Error al obtener el cliente",
            enable: false,
          });
          return false;
        }
      } else {
        setClientStatus({
          state: false,
          message: "Solo debe ingresar 8 numeros",
        });
        setError({
          ...error,
          dni: "Solo debe ingresar 8 numeros",
          enable: false,
        });
        return false;
      }
    } else {
      setClientStatus({ state: false, message: "" });
      setError({ ...error, dni: "No puede estar vacio", enable: false });
      return false;
    }
  };

  const handleChangeDate = (newDate) => {
    setDate(newDate);
    setNewAppointment({
      ...newAppointment,
      date: dayjs(newDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
      time: "",
    });
  };
  useEffect(() => {
    setNewAppointment({ ...newAppointment, time: "" });
    availableSchedule();
  }, [newAppointment.date, date]);

  const filterProfessionalByService = (idService) => {
    if (professionals && professionals.length > 0) {
      const filter = professionals.filter((prof) => {
        if (prof.services && prof.services.length > 0) {
          return prof.services.some(
            (service) => service.idService === Number(idService)
          );
        }
      });

      setServiceFilter(filter);
    } else {
      setServiceFilter([]);
    }
  };

  const handlePaidMethod = async (e) => {
    const modePaid = e.target.value;

    setPaid({ ...paid, payment_mode: modePaid });
  };

  const handleSelectService = async (e) => {
    const idService = e.target.value;
    // Encuentra el servicio con el id seleccionado
    const selectedService = services.find(
      (service) => service.id === Number(idService)
    );

    if (selectedService) {
      // Actualiza el estado con el valor del servicio encontrado
      setPaid({
        ...paid,
        amount: selectedService.cost,
      });
    }

    if (Number(idService) !== 0) {
      filterProfessionalByService(idService);
      validateInput("service", {
        ...newAppointment,
        serviceId: idService,
      });
      setNewAppointment({
        ...newAppointment,
        serviceId: idService,
        professionalDni: "0",
      });
      setStatusCheck(false);
    } else {
      validateInput("service", {
        ...newAppointment,
        serviceId: idService,
      });
      setNewAppointment({
        ...newAppointment,
        serviceId: "0",
        professionalDni: "0",
      });
      setStatusCheck(false);
    }
  };

  const handleSetTime = (newTime) => {
    const timeSelected = newTime;
    const valueTime = dayjs(timeSelected, "HH:mm");
    const time = dayjs(newTime).format("HH:mm");
    setNewAppointment({ ...newAppointment, time: time });

    if (valueTime.isValid()) {
      validateInput("time", { ...newAppointment, time: valueTime });
    } else {
      setError({ ...error, time: "Hora inválida", enable: false });
    }
    // availableSchedule(valueTime);  ya no ejecutamos esta funcion para poder superponer los turnos
  };

  const handleSetDuration = (e) => {
    const duration = e.target.value;

    setNewAppointment({ ...newAppointment, duration: duration });
  };

  const handleSelectProfessional = async (e) => {
    const dniProf = e.target.value;

    if (Number(dniProf) !== 0) {
      const findProfessional = await professionals.filter(
        (prof) => prof.dni === Number(dniProf)
      );

      const containSecondary = findProfessional[0].services.some(
        (service) =>
          service.idService == newAppointment.serviceId && service.secondary > 0
      );

      if (containSecondary) {
        setStatusCheck(true);
      } else {
        setStatusCheck(false);
      }
      setNewAppointment({ ...newAppointment, professionalDni: dniProf });
      validateInput(
        "professional",
        { ...newAppointment, professionalDni: dniProf },
        error,
        clientStatus
      );
      const search = await searchAppoinmentByProfessional(
        newAppointment.date,
        dniProf,
        events
      );
    } else {
      setNewAppointment({ ...newAppointment, professionalDni: dniProf });
      validateInput("professional", {
        ...newAppointment,
        professionalDni: "0",
      });
      setStatusCheck(false);
    }
  };

  const handleChangeDni = async (e) => {
    const dni = e.target.value;
    setNewAppointment({ ...newAppointment, dni: dni });
    validateInput("dni", { ...newAppointment, dni: dni });
  };

  const handleChangeDeposit = async (e) => {
    const seña = e.target.value;

    setPaid({ ...paid, depositAmount: seña });
  };

  useEffect(() => {
    validateEnableButton();
    availableSchedule();
  }, [
    newAppointment,
    error,
    clientStatus,
    // statusTime, ya no se utiliza por requerimiento de superposicion de turnos
    hourProfessional,
    newAppointment.date,
  ]);

  useEffect(() => {
    shouldDisableTime();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const response = await axios.post(`${urlApi}appointment`, newAppointment);

    setPaid({ ...paid, appointmentsId: [response.data.newAppointment.id] });
    const result = response.data;
    const response2 = await axios.post(`${urlApi}payment`, {
      ...paid,
      appointmentsId: [response.data.newAppointment.id],
    });
    if(response2) {
      setLoading(false);
    }
    setNewAppointment({
      date: dayjs().format("YYYY-MM-DD"),
      time: "",
      dni: "",
      duration: 30,
      professionalDni: "",
      serviceId: "",
      deprived: false,
    });
    setError({
      dni: "Required",
      professional: "Required",
      service: "Required",
      time: "Required",
      enable: false,
    });
    setClientStatus({
      state: false,
      message: "",
    });
    setStatusCheck(false);
    dispatch(getAppointments());
    handleClose();
    return result;
  };

  const handleShowForm = () => {
    setShowNewClient(!showNewClient);
  };

  return (
    <div>
      <TriggerButton type="button" onClick={handleOpen}>
        Reservar turno
      </TriggerButton>
      <Modal
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        open={openBooking}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}>
        <ModalContent sx={{ width: 600, height: "fit-content" }}>
          <div
            className="max-w-md p-6"
            style={{
              // border: "2px solid green",
              padding: "5px",
            }}>
            <div className="flex flex-col items-start gap-1">
              <div
                className="font-bold"
                style={{
                  fontWeight: "bold",
                  padding: "10px",
                  color: `${colors.dell[950]}`,
                  fontSize: "1.2rem",
                }}>
                Reservar turno
              </div>
            </div>
            <div className="space-y-4">
              <div
                className="grid gap-1.5"
                style={{
                  // border: "2px solid orange",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
               
                  gap: "10px",
                  width: "100%",
                }}>
                <div
                  style={{
                    //  border: "2px solid red",
                    width: "50%",
                  }}>
                  <BasicDatePicker
                    date={date}
                    handleChangeDate={handleChangeDate}
                    sizeField="small"
                    widthField="100%"
                  />
                </div>

                <div
                  className="grid gap-1.5"
                  style={{
                    // border: "2px solid purple",
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                  }}>
                  <ThemeProvider theme={theme}>
                    <TextField
                      id="dni"
                      label="Dni cliente"
                      type="text"
                      variant="outlined"
                      size="small"
                      value={newAppointment.dni}
                      onChange={handleChangeDni}
                      style={{ width: "100%" }} // Ajusta el ancho según sea necesario
                    />
                  </ThemeProvider>
                  {clientStatus.message === "Registre el cliente" && (
                    <RegisterButton onClick={handleShowForm}>
                      Registrar cliente
                    </RegisterButton>
                  )}
                  {showNewClient && (
                    <Modal
                      aria-labelledby="keep-mounted-modal-title"
                      aria-describedby="keep-mounted-modal-description"
                      open={openBooking}
                      onClose={handleClose}
                      slots={{ backdrop: StyledBackdrop }}>
                      <ModalContentForm>
                        <NewCustomerForm />
                        <CancelButton
                          onClick={handleShowForm}
                          style={{ backgroundColor: "aliceblue" }}>
                          Cancelar
                        </CancelButton>
                      </ModalContentForm>
                    </Modal>
                  )}
                  {clientStatus.message &&
                    clientStatus.message !== "Registre el cliente" && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          marginRight: "5%",
                          width: "calc(100% - 5%)",
                        }}>
                        <span
                          style={{
                            fontSize: "12px",
                            color: clientStatus.state ? "green" : "red",
                          }}>
                          {clientStatus.message}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div
                className="grid gap-1.5"
                style={{
                  // border: "2px solid cyan",
                  padding: "10px",
                  gap: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <div
                  style={{
                    // border: "2px solid red",
                    width: "50%",
                    display: "flex",
                  }}>
                  <ThemeProvider theme={theme}>
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Servicio"
                      defaultValue="0"
                      style={{ width: "100%" }}
                      onChange={handleSelectService}
                      size="small"
                      helperText={error.service}>
                      {services.map((service) => (
                        <MenuItem
                          key={service.id}
                          value={service.id}
                          id={service.id}
                          name={service.service_name}>
                          {service.service_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </ThemeProvider>
                </div>
                <div
                  style={{
                    // border: "2px solid red",
                    width: "50%",
                    display: "flex",
                  }}>
                  <ThemeProvider theme={theme}>
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Profesional"
                      defaultValue="0"
                      style={{ width: "100%" }}
                      onChange={handleSelectProfessional}
                      size="small"
                      disabled={
                        Number(newAppointment.serviceId) !== 0 ? false : true
                      }
                      helperText={error.professional}>
                      {serviceFilter.map((prof) => (
                        <MenuItem key={prof.dni} value={prof.dni} id={prof.dni}>
                          {prof.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </ThemeProvider>
                </div>
              </div>
              <div
                className="flex items-center gap-2"
                style={{
                  // border: "2px solid teal",
                  padding: "5px",
                  marginTop:"5px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    width: "50%",
                    // border: "2px solid green",
                    gap: "20px",
                    marginLeft:"5px"
                  }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ThemeProvider theme={theme}>
                      <TimePicker
                        id="time"
                        label="Hora de reserva"
                        value={ dayjs(newAppointment.time)}
                        onChange={handleSetTime}
                        ampm={false}
                        shouldDisableTime={shouldDisableTime}
                        sx={{ width: "60%"}}
                        slotProps={{ textField: { size: "small" } }}
                      />
                    </ThemeProvider>
                  </LocalizationProvider>
                  {/* {newAppointment.time && error.time !== "Hora inválida" && (
                      <span
                        class={statusTime.status ? "stateTrue" : "stateFalse"}>
                        {statusTime.message}
                      </span>
                    )} ya no es necesario mostrar la disponibilidad del rango horario */}
                  {error.time && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "red",
                      }}>
                      {error.time}
                    </span>
                  )}

                  <ThemeProvider theme={theme}>
                    <TextField
                      id="duration"
                      label="Duración (min)"
                      type="number"
                      variant="outlined"
                      size="small"
                      inputProps={{
                        min: 15,
                        max: 240,
                        step: 15,
                      }}
                      value={newAppointment.duration}
                      onChange={handleSetDuration}
                      style={{ width: "60%",marginBottom:"0px"  }} // Ajusta el ancho según sea necesario
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </ThemeProvider>
                </div>
                <div
                  className="checkboxContainer"
                  style={{
                    // border: "2px solid red",
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "start",
                  }}>
                  <div
                    style={{
                      // border: "solid orange 2px",
                      display: "flex",
                      flexDirection:"column",
                      justifyContent: "center",
                      alignItems: "start",
                      width: "100%",
                      height: "55%",
                    
                    }}>
                    <ThemeProvider theme={theme}>
                      <CustomCheckboxLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={newAppointment.deprived}
                            onChange={handleChangeCheck}
                            style={{ padding: "2px", marginRight: "2px" }}
                            disabled={!statusCheck}
                          />
                        }
                        label="Cliente privado"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontWeight: "bold", // Establece el peso de la fuente
                            fontSize: "12px",
                          },
                        }}
                      />
                    </ThemeProvider>
                    <ThemeProvider theme={theme}>
                      <CustomCheckboxLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={deposit}
                            onChange={handleDepositCheck}
                            style={{ padding: "2px", marginRight: "2px" }}
                          />
                        }
                        label="Seña"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontWeight: "bold", // Establece el peso de la fuente
                            fontSize: "12px",
                          },
                        }}
                      />
                    </ThemeProvider>
                  </div>
                  
                  {deposit ? (
                    <div
                      style={{
                        // border: "solid pink 2px",
                        // padding: "2px",
                        gap: "5px",
                        display: "flex",
                        alignItems:"flex-end",
                        height:"100%"
                      }}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Método de pago"
                          defaultValue=""
                          style={{ width: "65%" }}
                          onChange={handlePaidMethod}
                          size="small">
                          <MenuItem value="Efectivo">Efectivo</MenuItem>
                          <MenuItem value="Transferencia">
                            Transferencia
                          </MenuItem>
                          <MenuItem value="Débito">Débito</MenuItem>
                          <MenuItem value="Crédito">Crédito</MenuItem>
                        </TextField>
                      </ThemeProvider>
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="seña"
                          label={`$ ${paid.amount}`}
                          type="text"
                          variant="outlined"
                          size="small"
                          value={paid.depositAmount}
                          onChange={handleChangeDeposit}
                          style={{ width: "35%" }} // Ajusta el ancho según sea necesario
                        />
                      </ThemeProvider>
                    </div>
                  ) : null}
                  {/* </div> */}
                </div>
              </div>
            

            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                flexDirection: "row",
                // border:'2px solid blue'
                marginTop:"5px"
              }}>

             {loading === true ? <Loader/> :(<><CancelButton onClick={handleClose}>Cancelar</CancelButton>
              <TriggerButton onClick={handleSubmit} disabled={!enableButton}>
                {" "}
                Reservar
              </TriggerButton></>)}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NewBooking;

const CustomCheckboxLabel = styled(FormControlLabel)(
  ({ theme }) => css`
    font-family: "Roboto", sans-serif;
    font-size: 8px;
    color: ${theme.palette.mode === "dark"
      ? "#fff"
      : "#333"}; /* Example color based on theme mode */
    margin-left: 8px; /* Adjust margin as needed */
  `
);

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
  },
});

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled("div")(
  ({ theme }) => css`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
  `
);

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    // box-shadow: 0 4px 12px
    // ${theme.palette.mode === "dark"
      ? "rgb(0 0 0 / 0.5)"
      : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

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

const RegisterButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.8rem;
    border-radius: 4px;
    transition: all 150ms ease;
    width: fit-content;
    cursor: pointer;
    padding: 5px;
    margin: 3px;
    background: ${theme.palette.mode === "dark" ? blue[900] : blue[700]};
    border: 1px solid ${theme.palette.mode === "dark" ? blue[700] : blue[700]};
    color: ${theme.palette.mode === "dark" ? blue[200] : "#fff"};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? blue[800] : blue[900]};
      // border-color: ${theme.palette.mode === "dark" ? blue[600] : blue[300]};
      color: ${theme.palette.mode === "dark" ? blue[600] : "#fff"};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? blue[700] : blue[900]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? blue[300] : blue[200]};
      outline: none;
    }
    &:disabled {
      opacity: 0.5; /* Reducir la opacidad del botón */
      background-color: #ccc; /* Cambiar el color de fondo */
      color: #666; /* Cambiar el color del texto */
      cursor: not-allowed; /* Cambiar el cursor del ratón */
    }
  `
);

const ModalContentForm = styled("div")(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: transparent;
    gap: 10px;
    // background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    // border-radius: 8px;
    // border: 1px solid ${theme.palette.mode === "dark"
      ? grey[700]
      : grey[200]};
    // box-shadow: 0 4px 12px
    ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
    margin: 0;
    width: fit-content;
    height: fit-content;
    position: relative;
  `
);
