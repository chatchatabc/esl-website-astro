<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import type { EventImpl } from "@fullcalendar/core/internal";
  import interactionPlugin from "@fullcalendar/interaction";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import type { Booking } from "src/domain/models/BookingModel";
  import type { Schedule } from "src/domain/models/ScheduleModel";
  import { authGetUserId } from "src/domain/services/client/authService";
  import { bookingGetAll } from "src/domain/services/client/bookingService";
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

  $: bookingsEvent = bookings.map((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      title: "Booked Schedule",
      start,
      end,
      color: "red",
    };
  });
  $: schedulesEvent = schedules.map((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    const startTime = timeFormatter.format(start);
    const endTime = timeFormatter.format(end);

    return {
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
    console.log(eventSchedules, newSchedules);

    if (responseUpdate && response) {
      events.forEach((event) => {
        event.remove();
      });

      schedules = (await scheduleGetAllByUser({ userId }))?.content ?? [];
      bookings = (await bookingGetAll({})) ?? [];

      editing = !editing;
    } else {
      alert("Error");
    }
  }

  $: if (editing && calendar) {
    calendar?.getEvents().forEach((event) => {
      event.remove();
    });
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

    schedulesEvent.forEach((event) => {
      const activeEvent = {
        ...event,
        title: undefined,
        display: "block",
        overlap: false,
      };
      delete activeEvent.title;
      calendar?.addEvent(activeEvent);
    });
  } else if (calendar) {
    calendar?.getEvents().forEach((event) => {
      event.remove();
    });
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

    schedulesEvent.forEach((event) => {
      calendar?.addEvent(event);
    });
    bookingsEvent.forEach((event) => {
      calendar?.addEvent(event);
    });
  }

  onMount(async () => {
    userId = authGetUserId() ?? 0;
    schedules = (await scheduleGetAllByUser({ userId }))?.content ?? [];
    bookings = (await bookingGetAll({})) ?? [];
    bookings = bookings.filter((booking) => booking.status === 1);

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

        if (e.start.getDate() === e.end.getDate()) {
          const endTime = timeFormatter.format(e.end);
          const startTime = timeFormatter.format(e.start);
          const event = {
            endTime,
            startTime,
            daysOfWeek: [day],
          };
          calendar?.addEvent(event);
        }
      },
    });

    calendar.render();
  });
</script>

<section>
  <div class="h-[80vh]" data-teacher-calendar />
</section>
