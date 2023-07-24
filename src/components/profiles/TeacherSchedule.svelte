<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  let data = [] as any[];
  let create = false;

  $: console.log(data);
  $: console.log(create);

  onMount(async () => {
    const response = await scheduleGetAllByUser({ userId: 3 });
    if (response) {
      data = Object.values(response)
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
