import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useRef, useState } from "react";
import EventModal from "./EventModel";
export interface EventType {
  id: string; // unique id for each event
  title: string;
  description: string;
  start: string;
  end: string;
  color: string;
}

const Calender = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [start, setStart] = useState<string>("");
  const [isActionModel, setIsActionModel] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState<EventType | null>(null);

  //   const events: EventType[] = [
  //     {
  //       title: "Team Meeting",
  //       start: "2025-11-11T10:00:00",
  //       end: "2025-11-11T11:00:00",
  //       color: "#4CAF50", // green
  //     },
  //     {
  //       title: "Project Deadline",
  //       start: "2025-11-12T09:00:00",
  //       end: "2025-11-12T17:00:00",
  //       color: "#F44336", // red
  //     },
  //     {
  //       title: "Lunch with Client",
  //       start: "2025-11-13T13:00:00",
  //       end: "2025-11-13T14:00:00",
  //       color: "#FF9800", // orange
  //     },
  //     {
  //       title: "Marketing Review",
  //       start: "2025-11-14T15:30:00",
  //       end: "2025-11-14T16:30:00",
  //       color: "#2196F3", // blue
  //     },
  //     {
  //       title: "Workshop: React Advanced",
  //       start: "2025-11-15T09:30:00",
  //       end: "2025-11-17T12:00:00",
  //       color: "#9C27B0", // purple
  //     },
  //   ];
  const [events, setEvents] = useState<EventType[]>(() => {
    const savedEvents = localStorage.getItem("event");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  useEffect(() => {
    localStorage.setItem("event", JSON.stringify(events));
  }, [events]);

  const modelRef = useRef(null);
  const handleDateClick = (info: any) => {
    // console.log(info.date)
    const date = new Date(info.date);
    console.log("Withougth convert", date);

    console.log("After converting in isoString", date.toISOString());
    setStart(date.toISOString().slice(0, 16));
    setIsOpen(true);
  };
  const handleEventClick = (info: any) => {
    setUpdatedData({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      start: info.event.startStr,
      end: info.event.endStr,
      color: info.event.backgroundColor,
    });
    setIsActionModel(true);
    setIsOpen(true);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modelRef.current &&
        !(modelRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsActionModel(false);
        setUpdatedData(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);
  return (
    <div className="p-5 relative">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,dayGridYear",
        }}
        views={{
          dayGridMonth: { buttonText: "Month" },
          timeGridWeek: { buttonText: "Week" },
          dayGridYear: {
            type: "dayGridMonth",
            duration: { months: 12 },
            buttonText: "Year",
          },
        }}
        events={events}
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      {isOpen && (
        <div className="model">
          {" "}
          <EventModal
            modelRef={modelRef}
            onClose={() => {
              setIsOpen(false);
              setUpdatedData(null);
            }}
            setEventes={setEvents}
            actionModel={isActionModel}
            updatedData={updatedData}
            EditeModelOpen={() => {
              setIsOpen(true);
              setIsActionModel(false);
              console.log(updatedData);
            }}
            startDate={start}
            onCloseActionModel={() => {
              setIsActionModel(false);
              setIsOpen(false);
              setUpdatedData(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Calender;
