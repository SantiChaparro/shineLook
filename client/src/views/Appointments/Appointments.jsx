import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import {
  getAppointments,
  getProfessionals,
  getServices,
} from "../../redux/slices/appointments/thunks";
import DetailAppointment from "../../components/detail/DetailAppointment";
import DatePicker from "../../components/calendar/DatePicker";
import NewBooking from "../../components/reserve/NewBooking";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "./Appointments.css";
import "dayjs/locale/es";
import { calcPartial } from "../../assets/functions/calcPartial";
import { fontWeight } from "@mui/system";
import Reference from "../../components/reference/Reference";


dayjs.locale("es");

const Appointments = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointment);
  const { professionals } = useSelector((state) => state.professionals);
  const { tenantId } = useSelector((state) => state.tenant);
  const [open, setOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState([]);
  const [eventSearch, setEventSearch] = useState({});
  const [openBooking, setOpenBooking] = useState(false);
  const [slotSelected, setSlotSelected] = useState("");
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [reloadTable, setReloadTable] = useState(false);
  const localizer = dayjsLocalizer(dayjs);

  console.log('tenant id desde appointments',tenantId);
  console.log('citas', appointments);
  
  

  useEffect(() => {
    dispatch(getAppointments(tenantId));
    dispatch(getProfessionals(tenantId));
    dispatch(getServices(tenantId));
  }, [dispatch,tenantId]);

  useEffect(() => {
    dispatch(getAppointments(tenantId));
  }, [eventSelected]);

  useEffect(() => {
    if (appointments.length > 0) {
    
      adaptAppointments(appointments);
    } else
      setEvents([])
  }, [dispatch, appointments, eventSelected]);

  const adaptAppointments = (appointments) => {
    if (appointments) {
      const adaptEvents = appointments.map((appointment) => {
        const length = appointment.Payments.length;
        return {
          title: appointment.Client.name,
          serviceName: appointment.Service.service_name,
          serviceId: appointment.ServiceId,
          start: dayjs(`${appointment.date}T${appointment.time}`).toDate(),
          end: dayjs(`${appointment.date}T${appointment.time}`)
            .add(`${appointment.duration}`, "minute")
            .toDate(),
          professionalDni: appointment.ProfessionalDni,
          nameClient: appointment.Client.name,
          dniClient: appointment.ClientDni,
          nameProfessional: appointment.Professional.name,
          idAppointment: appointment.id,
          cost: appointment.Payments[length - 1].amount,
          payments: appointment.Payments,
          status: appointment.paid,
          private: appointment.deprived,
          deposit: appointment.Payments[length - 1],
          attended: appointment.Payments[length - 1].attended,
        };
      });
      setEvents(adaptEvents);
    }
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEventSelected([]);
  };

  const loadEventSearch = (event) => {
    setEventSearch(event);
    searchEvents(event);
  };

  const searchEvents = async (event) => {
    let dni = event.dniClient;
    let date = dayjs(event.start).format("DD/MM/YYYY");

    const renderEvents = events.filter((event) => {
      let date2 = dayjs(event.start).format("DD/MM/YYYY");
      return date2 === date && event.dniClient === dni;
    });

    setEventSelected(renderEvents);

    if (!open) {
      openModal();
    }
  };

  const handleReloadTable = () => {
    setReloadTable(!reloadTable);
  };

  const handleSelectSlot = (infoSlot) => {
    setSlotSelected(infoSlot);
    setOpenBooking(true);
  };

  const paymentSuccess = async (event) => {
    try {
      await dispatch(getAppointments(tenantId));

      await searchEvents(event);
    } catch (error) {
      throw Error("Error updating appointments:", error);
    }
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
   

    const colorStatus = (calcPartial(event.payments) >= 0 && event.attended === "No"
      ? "blue"
      : calcPartial(event.payments) === event.cost &&
        event.attended === "Si"
        ? "green"
        : calcPartial(event.payments) === event.cost &&
          event.attended !== "Si"
          ? "orange"
          : "red")

    return {
      style: {
        // backgroundColor: event.status ? "green" : "red",
        backgroundColor: colorStatus,
        color: colorStatus === "orange" ? "black" : "white",
        borderRadius: "5px",
        border: "solid 1px black",
        fontWeight: colorStatus === "orange" ? "600" : null
      },
    };
  };

  console.log(events)

  return (
    <div className="blue-container">
      <div className="yellow-container">
        <div className="form" style={{ marginRight: "50px" }}>
          <DatePicker date={date} handleChangeDate={setDate} /> 
          <Reference/>
          <NewBooking
            openBooking={openBooking}
            setOpenBooking={setOpenBooking}
            events={events}
            dateView={date}
          />
        </div>
        {open && eventSelected && (
          <DetailAppointment
            openModal={openModal}
            closeModal={closeModal}
            event={eventSelected}
            setEventSelected={setEventSelected}
            paymentSuccess={paymentSuccess}
            reloadTable={reloadTable}
            eventSearch={eventSearch}
          />
        )}
      </div>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          views={["day"]}
          defaultView="day"
          date={date.toDate()}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onNavigate={(newDate) => setDate(dayjs(newDate))}
          onSelectEvent={(event) => loadEventSearch(event)}
          onSelectSlot={handleSelectSlot}
         // resources={professionals}
         resources={professionals.map((prof) => ({
          resourceId: prof.Professional.dni, // Extraer el dni del objeto Professional
          resourceTitle: prof.Professional.name, // Extraer el nombre del objeto Professional
        }))}
          // resourceAccessor="professionalDni"
          // resourceIdAccessor="dni"
          // resourceTitleAccessor="name"
          resourceAccessor="professionalDni"
          resourceIdAccessor="resourceId" // Cambiar a resourceId
          resourceTitleAccessor="resourceTitle" // Cambiar a resourceTitle
          timeslots={1}
          min={new Date(2024, 2, 25, 8, 0, 0)}
          max={new Date(2024, 2, 25, 21, 0, 0)}
          eventPropGetter={eventStyleGetter}
          showMultiDayTimes={false}
          step={30}
        />
      </div>
    </div>
  );
};

export default Appointments;
