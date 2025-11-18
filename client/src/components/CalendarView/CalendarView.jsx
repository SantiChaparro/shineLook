import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const CalendarView = ({
  events = [],
  professionals = [],
  onDateSelect,
  onEventClick,
  currentDate,
  eventStyleGetter,
}) => {
  const calendarRef = useRef(null);

  // 🔹 Sincronizar fecha con Turnero
  useEffect(() => {
    if (calendarRef.current && currentDate) {
      const api = calendarRef.current.getApi();
      api.gotoDate(currentDate.toDate());
    }
  }, [currentDate]);

  // 🔹 Manejadores
  const handleDateSelect = (info) => {
    if (onDateSelect) onDateSelect(info);
  };

  const handleEventClick = (info) => {
  if (onEventClick) {
    onEventClick({
      ...info.event.extendedProps,
      start: info.event.start,
      end: info.event.end,
      title: info.event.title,
    });
  }
};

  // 🔹 Adaptar estructura de profesionales (según tu backend)
  const normalizedProfessionals = professionals.map((prof) => ({
    id: String(prof.Professional?.dni),
    title: prof.Professional?.name || "Sin nombre",
  }));

  // 🔹 Adaptar estructura de eventos
  const formattedEvents = events.map((e) => ({
    ...e,
    start: dayjs(e.start).format(),
    end: dayjs(e.end).format(),
    resourceId: String(e.professionalDni),
    color: eventStyleGetter ? eventStyleGetter(e).backgroundColor : undefined,
    textColor: eventStyleGetter ? eventStyleGetter(e).color : undefined,
  }));

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[resourceTimeGridPlugin, interactionPlugin]}
        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        initialView="resourceTimeGridDay"
        initialDate={dayjs().format("YYYY-MM-DD")}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        locale="es"
        allDaySlot={false}
        editable={false}
        selectable={true}
        height="100%"
        headerToolbar={false}
        resourceAreaWidth="200px"
        resourceLabelText="Profesionales"
        resources={normalizedProfessionals}
        events={formattedEvents}
        dateClick={handleDateSelect}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default CalendarView;
