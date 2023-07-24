<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  let data = [] as any[];

  $: console.log(data);

  onMount(async () => {
    const response = await scheduleGetAllByUser({ userId: 3 });
    if (response) {
      data = Object.values(response)
        .flat()
        .map((event) => {
          const start = new Date(event.start);
          const end = new Date(event.end);

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
            daysOfWeek: [event.day],
          };
        });
    }

    const calendarEl = document.querySelector<HTMLElement>(
      "[data-teacher-calendar]"
    )!;

    let calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin],
      initialView: "timeGridWeek",
      events: data,
      headerToolbar: {
        left: "",
        right: "",
      },
      views: {
        timeGridWeek: {
          allDayContent: () => {
            return "Total Hours";
          },
        },
      },
    });

    calendar.render();
  });
</script>

<header class="flex items-center">
  <h2 class="text-2xl mr-auto">Schedules</h2>
</header>

<section>
  <div data-teacher-calendar />
</section>
