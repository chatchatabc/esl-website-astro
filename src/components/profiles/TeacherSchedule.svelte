<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import interactionPlugin from "@fullcalendar/interaction";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import type { Booking } from "src/domain/models/BookingModel";
  import type { Schedule } from "src/domain/models/ScheduleModel";
  import { bookingGetAllByUser } from "src/domain/services/client/bookingService";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  let calendar: Calendar | null = null;

  let bookingsEvent = [] as Record<string, any>[];
  let bookings = [] as Booking[];
  let schedulesEvent = [] as Record<string, any>[];
  let schedules = [] as Schedule[];
  let editing = false;

  $: if (editing && calendar) {
    calendar?.setOption("editable", true);
    calendar?.setOption("selectable", true);
    schedulesEvent.forEach((event, index) => {
      const activeEvent = {
        ...event,
        title: undefined,
        id: `active-${index}`,
        display: "block",
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
    schedulesEvent.forEach((event, index) => {
      calendar?.getEventById(`active-${index}`)?.remove();
      calendar?.addEvent(event);
    });
    bookingsEvent.forEach((event) => {
      calendar?.addEvent(event);
    });
  }

  onMount(async () => {
    schedules = (await scheduleGetAllByUser({ userId: 3 }))?.content ?? [];
    bookings = (await bookingGetAllByUser({ userId: 3 }))?.content ?? [];
    schedulesEvent = schedules.map((event, index) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      // 24h
      const timeFormatter = new Intl.DateTimeFormat("en", {
        timeStyle: "short",
        hourCycle: "h23",
      });

      const startTime = timeFormatter.format(start);
      const endTime = timeFormatter.format(end);
      console.log(startTime, endTime);

      return {
        id: `open-${index}`,
        title: "Open Schedule",
        startTime,
        endTime,
        display: "background",
        daysOfWeek: [event.day],
      };
    });
    bookingsEvent = bookings.map((event, index) => {
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

    const calendarEl = document.querySelector<HTMLElement>(
      "[data-teacher-calendar]"
    )!;

    calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],

      initialView: "timeGridWeek",
      customButtons: {
        add: {
          text: "Edit",
          click: () => {
            editing = !editing;
          },
        },
      },
      headerToolbar: {
        left: "prev,next",
        right: "add",
      },
      views: {
        timeGridWeek: {
          allDaySlot: false,
        },
      },
    });

    calendar.render();
  });
</script>

<section>
  <div data-teacher-calendar />
</section>
