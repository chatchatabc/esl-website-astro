<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import interactionPlugin from "@fullcalendar/interaction";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import { bookingGetAllByUser } from "src/domain/services/client/bookingService";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  let calendar: Calendar | null = null;

  let bookings = [] as any[];
  let schedules = [] as any[];
  let editing = false;

  $: if (editing && calendar) {
    calendar?.setOption("editable", true);
    schedules.forEach((event, index) => {
      const inactiveEvent = {
        ...event,
        id: `inactive-${index}`,
        color: "red",
        display: "inverse-background",
      };
      const activeEvent = {
        ...event,
        id: `active-${index}`,
        display: "block",
      };
      delete activeEvent.title;
      delete inactiveEvent.title;
      calendar?.addEvent(inactiveEvent);
      calendar?.addEvent(activeEvent);
      calendar?.getEventById(`open-${index}`)?.remove();
    });
    bookings.forEach((_, index) => {
      calendar?.getEventById(`bk-${index}`)?.remove();
    });
  } else if (calendar) {
    calendar?.setOption("editable", false);
    schedules.forEach((event, index) => {
      calendar?.getEventById(`inactive-${index}`)?.remove();
      calendar?.getEventById(`active-${index}`)?.remove();
      calendar?.addEvent(event);
    });
    bookings.forEach((event) => {
      calendar?.addEvent(event);
    });
  }

  onMount(async () => {
    const responseSchedules = await scheduleGetAllByUser({ userId: 3 });
    const responseBookings = await bookingGetAllByUser({ userId: 3 });
    if (responseSchedules) {
      schedules = Object.values(responseSchedules)
        .flat()
        .map((event, index) => {
          const start = new Date(event.startTime);
          const end = new Date(event.endTime);

          const startTime = `${start.getHours()}:${start
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          const endTime = `${end.getHours()}:${end
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          return {
            id: `open-${index}`,
            title: "Open Schedule",
            startTime,
            endTime,
            display: "background",
            daysOfWeek: [event.day],
          };
        });
    }
    if (responseBookings) {
      bookings = Object.values(responseBookings.content)
        .flat()
        .map((event, index) => {
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
    }

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
