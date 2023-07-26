<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import type { EventImpl } from "@fullcalendar/core/internal";
  import interactionPlugin from "@fullcalendar/interaction";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import type { Booking } from "src/domain/models/BookingModel";
  import type { Schedule } from "src/domain/models/ScheduleModel";
  import { authGetUserId } from "src/domain/services/client/authService";
  import { bookingGetAllByUser } from "src/domain/services/client/bookingService";
  import {
    scheduleCreateMany,
    scheduleDeleteMany,
    scheduleGetAllByUser,
    scheduleUpdateMany,
  } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hourCycle: "h23",
  });

  let userId = 0;
  let calendar: Calendar | null = null;
  let schedules = [] as Schedule[];
  let bookings = [] as Booking[];
  let editing = false;

  $: bookingsEvent = bookings.map((event, index) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      id: `bk-${index}`,
      title: "Booked Schedule",
      start,
      end,
      color: "red",
    };
  });
  $: schedulesEvent = schedules.map((event, index) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    const startTime = timeFormatter.format(start);
    const endTime = timeFormatter.format(end);

    return {
      id: `open-${index}`,
      title: "Open Schedule",
      startTime,
      endTime,
      display: "background",
      daysOfWeek: [event.day],
    };
  });

  async function handleSave(events: EventImpl[]) {
    const eventSchedules = events.map((event, index) => {
      const start = new Date(event.start ?? 0);
      const end = new Date(event.end ?? 0);
      const day = start.getDay();
      const startTime = start.getTime();
      const endTime = end.getTime();
      const teacherId = authGetUserId() ?? 0;
      const id = schedules[index]?.id;

      return {
        day,
        startTime,
        endTime,
        teacherId,
        id,
      };
    });

    let response: any = true;
    if (schedules.length > eventSchedules.length) {
      const deleteSchedules = schedules.filter(
        (schedule) => !eventSchedules.find((event) => event.id === schedule.id)
      );
      response = await scheduleDeleteMany(deleteSchedules);
    }

    const updateSchedules: Schedule[] = eventSchedules.filter(
      (schedule) => schedule.id
    );
    const responseUpdate = await scheduleUpdateMany({
      userId,
      schedules: updateSchedules,
    });

    const newSchedules = eventSchedules.filter((schedule) => !schedule.id);
    if (newSchedules.length) {
      response = await scheduleCreateMany(newSchedules);
    }

    if (responseUpdate && response) {
      events.forEach((event) => {
        event.remove();
      });

      schedules = (await scheduleGetAllByUser({ userId }))?.content ?? [];
      bookings = (await bookingGetAllByUser({ userId }))?.content ?? [];

      editing = !editing;
    } else {
      alert("Error");
    }
  }

  $: if (editing && calendar) {
    calendar?.setOption("editable", true);
    calendar?.setOption("selectable", true);
    calendar.setOption("customButtons", {
      add: {
        text: "Save",
        click: () => {
          const events = calendar?.getEvents() ?? [];
          handleSave(events);
        },
      },
    });
    calendar?.setOption("eventClick", (e) => {
      e.event.remove();
    });

    schedulesEvent.forEach((event, index) => {
      const activeEvent = {
        ...event,
        title: undefined,
        id: `active-${index}`,
        display: "block",
        overlap: false,
      };
      delete activeEvent.title;
      calendar?.addEvent(activeEvent);
      calendar?.getEventById(`open-${index}`)?.remove();
    });
    bookings.forEach((_, index) => {
      calendar?.getEventById(`bk-${index}`)?.remove();
    });
  } else if (calendar) {
    calendar?.setOption("editable", false);
    calendar?.setOption("selectable", false);
    calendar.setOption("customButtons", {
      add: {
        text: "Edit",
        click: () => {
          editing = !editing;
        },
      },
    });
    calendar?.setOption("eventClick", undefined);
    schedulesEvent.forEach((event, index) => {
      console.log(event);
      calendar?.getEventById(`active-${index}`)?.remove();
      calendar?.addEvent(event);
    });
    bookingsEvent.forEach((event) => {
      calendar?.addEvent(event);
    });
  }

  onMount(async () => {
    userId = authGetUserId() ?? 0;
    schedules = (await scheduleGetAllByUser({ userId }))?.content ?? [];
    bookings = (await bookingGetAllByUser({ userId }))?.content ?? [];

    const calendarEl = document.querySelector<HTMLElement>(
      "[data-teacher-calendar]"
    )!;

    calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      headerToolbar: {
        left: "prev,next",
        right: "add",
      },
      views: {
        timeGridWeek: {
          allDaySlot: false,
        },
      },
      select: (e) => {
        const day = e.start.getDay();
        const endTime = timeFormatter.format(e.end);
        const startTime = timeFormatter.format(e.start);
        const events = calendar?.getEvents() ?? [];
        const event = {
          endTime,
          startTime,
          daysOfWeek: [day],
          id: `active-${events.length}`,
        };
        calendar?.addEvent(event);
      },
    });

    calendar.render();
  });
</script>

<section>
  <div data-teacher-calendar />
</section>
