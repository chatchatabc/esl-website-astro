<script lang="ts">
  export let teacherId;

  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import type { Booking } from "src/domain/models/BookingModel";
  import type { Schedule } from "src/domain/models/ScheduleModel";
  import { authGetUserId } from "src/domain/services/client/authService";
  import { bookingGetAllByUser } from "src/domain/services/client/bookingService";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { onMount } from "svelte";

  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hourCycle: "h23",
  });
  let schedules = [] as Schedule[];
  let bookings = [] as Booking[];
  let calendar = null as Calendar | null;
  let calendarDate = new Date();

  function generateOpenSchedules() {
    if (calendar) {
      calendar.removeAllEvents();
      schedules.map((schedule, index) => {
        const currentDate = new Date(calendarDate);
        currentDate.setDate(currentDate.getDate() + schedule.day);
        const startTime = new Date(schedule.startTime);
        const endTime = new Date(schedule.endTime);
        let start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          startTime.getHours(),
          startTime.getMinutes()
        );
        let end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          endTime.getHours(),
          endTime.getMinutes()
        );

        while (start < end) {
          const event = {
            id: `open-${index}`,
            title: "Open Schedule",
            start,
          };
          start = new Date(start.getTime() + 30 * 60000);
          calendar?.addEvent(event);
        }
      });
      bookings.map((booking) => {
        const event = {
          id: `bk-${booking.id}`,
          start: booking.start,
          end: booking.end,
        };
        calendar?.addEvent(event);
      });
    }
  }

  onMount(async () => {
    calendarDate.setDate(calendarDate.getDate() - calendarDate.getDay());
    teacherId = authGetUserId() ?? 0;
    schedules =
      (await scheduleGetAllByUser({ userId: teacherId }))?.content ?? [];
    bookings =
      (await bookingGetAllByUser({ userId: teacherId }))?.content ?? [];

    const calendarEl = document.querySelector<HTMLElement>(
      "[data-teacher-schedule]"
    )!;

    calendar = new Calendar(calendarEl, {
      plugins: [listPlugin],
      aspectRatio: 0.1,
      initialView: "listWeek",
      headerToolbar: {
        left: "",
        right: "",
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
    generateOpenSchedules();
  });
</script>

<section>
  <header>
    <section class="flex space-x-2">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        on:click={() => {
          calendar?.prev();
          calendarDate.setDate(calendarDate.getDate() - 7);
          generateOpenSchedules();
        }}
      >
        Prev
      </button>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        on:click={() => {
          calendar?.next();
          calendarDate.setDate(calendarDate.getDate() + 7);
          generateOpenSchedules();
        }}
      >
        Next
      </button>
    </section>
  </header>

  <div class="-mt-4 min-h-[50px] max-h-[80vh]" data-teacher-schedule />
</section>
