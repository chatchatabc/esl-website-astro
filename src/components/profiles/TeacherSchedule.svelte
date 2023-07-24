<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import { bookingGetAllByUser } from "src/domain/services/client/bookingService";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  let bookings = [] as any[];
  let schedules = [] as any[];
  let create = false;

  onMount(async () => {
    const responseSchedules = await scheduleGetAllByUser({ userId: 3 });
    const responseBookings = await bookingGetAllByUser({ userId: 3 });
    if (responseSchedules) {
      schedules = Object.values(responseSchedules)
        .flat()
        .map((event) => {
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
            title: "Free Schedule",
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
        .map((event) => {
          const start = new Date(event.start);
          const end = new Date(event.end);

          return {
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

    let calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin],
      initialView: "timeGridWeek",
      events: [...schedules, ...bookings],
      customButtons: {
        add: {
          text: "Create +",
          click: () => {
            create = !create;
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
