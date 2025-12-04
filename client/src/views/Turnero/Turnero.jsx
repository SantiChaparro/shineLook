import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointments, getProfessionals, getServices } from "../../redux/slices/appointments/thunks";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ApointmentheaderContainer from "../../components/ApointmentheaderContainer/ApointmentheaderContainer";
import CalendarView from "../../components/CalendarView/CalendarView";
import NewBooking from "../../components/reserve/NewBooking";
import DetailAppointment from "../../components/detail/DetailAppointment";
import { calcPartial } from "../../assets/functions/calcPartial";
import Reference from "../../components/reference/Reference";

dayjs.locale("es");

function Turnero() {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointment);
  const { professionals } = useSelector((state) => state.professionals);
  const { tenantId } = useSelector((state) => state.tenant);

  // --- Estados principales ---
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [openBooking, setOpenBooking] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState([]);
  const [eventSearch, setEventSearch] = useState({});
  const [reloadTable, setReloadTable] = useState(false);


  console.log('profesionales', professionals);
  console.log('citas desde turnero',appointments);
  
  
  // --- Navegación de fechas ---
  const handlePrev = () => setCurrentDate(currentDate.subtract(1, "day"));
  const handleNext = () => setCurrentDate(currentDate.add(1, "day"));
  const handleToday = () => setCurrentDate(dayjs());
  const addApointmentHandler = () => setOpenBooking(true);

  // --- Llamadas iniciales ---
  useEffect(() => {
    if (tenantId) {
      dispatch(getAppointments(tenantId));
      dispatch(getProfessionals(tenantId));
      dispatch(getServices(tenantId));
    }
  }, [dispatch, tenantId]);

  useEffect(() => {
  if (tenantId) {
    dispatch(getAppointments(tenantId));
  }
}, [reloadTable]);

  // --- Adaptar citas del backend a eventos del calendario ---
  useEffect(() => {
    if (appointments?.length) {
      const adaptEvents = appointments.map((appointment) => {
        const length = appointment.Payments.length;
        const lastPayment = appointment.Payments[length - 1] || {};

        return {
          idAppointment: appointment.id,
          title: appointment.Client?.name || "Sin nombre",
          serviceName: appointment.Service?.service_name || "",
          serviceId: appointment.ServiceId,
          start: dayjs(`${appointment.date}T${appointment.time}`).toDate(),
          end: dayjs(`${appointment.date}T${appointment.time}`)
            .add(appointment.duration || 30, "minute")
            .toDate(),
          professionalDni: appointment.ProfessionalDni,
          nameClient: appointment.Client?.name,
          dniClient: appointment.ClientDni,
          nameProfessional: appointment.Professional?.name,
          cost: lastPayment.amount,
          payments: appointment.Payments,
          status: appointment.paid,
          private: appointment.deprived,
          deposit: lastPayment,
          attended: lastPayment.attended,
        };
      });
      setEvents(adaptEvents);
    } else {
      setEvents([]);
    }
  }, [appointments]);

  // --- Manejo de modales ---
  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setEventSelected([]);
  };

  // --- Al hacer click en un evento ---
  const loadEventSearch = (event) => {
    setEventSearch(event);
    searchEvents(event);
  };

  const searchEvents = (event) => {
    const dni = event.dniClient;
    const date = dayjs(event.start).format("DD/MM/YYYY");

    const renderEvents = events.filter((ev) => {
      const date2 = dayjs(ev.start).format("DD/MM/YYYY");
      return date2 === date && ev.dniClient === dni;
    });

    setEventSelected(renderEvents);
    if (!open) openModal();
  };

  // --- Recargar después de un pago ---
  const paymentSuccess = async (event) => {
    try {
      await dispatch(getAppointments(tenantId));
      await searchEvents(event);
    } catch (error) {
      console.error("Error actualizando citas:", error);
    }
  };

  const handleReloadTable = () => {
  setReloadTable(!reloadTable);
}

  // --- Colores dinámicos según estado del pago ---
  const eventStyleGetter = (event) => {
    const colorStatus =
      calcPartial(event.payments) >= 0 && event.attended === "No"
        ? "blue"
        : calcPartial(event.payments) === event.cost && event.attended === "Si"
        ? "green"
        : calcPartial(event.payments) === event.cost && event.attended !== "Si"
        ? "orange"
        : "red";

    return {
      backgroundColor: colorStatus,
      color: colorStatus === "orange" ? "black" : "white",
      borderRadius: "5px",
      border: "solid 1px black",
      fontWeight: colorStatus === "orange" ? "600" : null,
    };
  };

  console.log("EVENTS EN TURNERO =>", events);


  return (
    <Container>
      <UpperContainer>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "32px",
            fontWeight: "600",
          }}
        >
          Agenda de citas
        </Typography>

        <StyledButton onClick={addApointmentHandler}>
          <AddIcon />
          Agendar cita
        </StyledButton>
      </UpperContainer>

      <AppointmentsContainer>
        <ApointmentheaderContainer
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />

        <Reference />

        <CalendarView
          professionals={professionals}
          events={events}
          setEvents={setEvents}
          setOpenBooking={setOpenBooking}
          setSelectedDate={setSelectedDate}
          currentDate={currentDate}
          onEventClick={loadEventSearch}
          eventStyleGetter={eventStyleGetter}
        />
      </AppointmentsContainer>

      {/* Modal de nueva reserva */}
      <NewBooking
        openBooking={openBooking}
        setOpenBooking={setOpenBooking}
        events={events}
        dateView={selectedDate}
      />

      {/* Modal de detalle de cita */}
      {open && eventSelected && (
        <DetailAppointment
          openModal={openModal}
          closeModal={closeModal}
          event={eventSelected}
          setEventSelected={setEventSelected}
          paymentSuccess={paymentSuccess}
          reloadTable={handleReloadTable}
          eventSearch={eventSearch}
        />
      )}
    </Container>
  );
}

export default Turnero;

// ---- styled ----
const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "#EEEEEE",
  paddingBottom: "20px",
});

const UpperContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: "100px",
  padding: "0 20px",
  backgroundColor: "#EEEEEE",
});

const StyledButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "linear-gradient(135deg, #B985FF 0%, #5B2B99 100%)",
  color: "#FFFFFF",
  borderRadius: "10px",
  padding: "6px 16px",
  textTransform: "none",
  "&:hover": { opacity: 0.9 },
});

const AppointmentsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "97%",
  height: "100%",
  padding: "20px",
  borderRadius: "15px",
  backgroundColor: "#F6F5F5",
  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12), 0 12px 32px rgba(0, 0, 0, 0.15)",
});
