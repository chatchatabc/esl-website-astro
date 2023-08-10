<script lang="ts">
  export let userId: number;

  import { Calendar } from "@fullcalendar/core";
  import type { EventImpl } from "@fullcalendar/core/internal";
  import interactionPlugin from "@fullcalendar/interaction";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import { bookingGetAll } from "@services/bookingService";
  import {
    scheduleCreateMany,
    scheduleDeleteMany,
    scheduleGetAllByUser,
    scheduleUpdateMany,
  } from "src/services/scheduleService";
  import type { Booking } from "../../../../esl-workers/src/domain/models/BookingModel";
  import type {
    Schedule,
    ScheduleUpdateInput,
  } from "../../../../esl-workers/src/domain/models/ScheduleModel";

  let calendarEl: any;
  let calendar: Calendar | null = null;
  let schedules = [] as Schedule[];
  let bookings = [] as Booking[];
  let editing = false;
  let loading = true;

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
  $: schedulesEvent = schedules
    .map((schedule) => {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay());

      const start = new Date(schedule.startTime);
      start.setFullYear(date.getFullYear());
      start.setMonth(date.getMonth());
      start.setUTCDate(date.getDate() + schedule.day);
      const diff = schedule.endTime - schedule.startTime;
      const end = new Date(start.getTime() + diff);

      return {
        start,
        end,
      };
    })
    .flat();

  async function handleSave(events: EventImpl[]) {
    const eventSchedules = events.map((event, index) => {
      const start = new Date(event.start ?? 0);
      const end = new Date(event.end ?? 0);
      const startTime = start.getTime();
      const endTime = end.getTime();
      const teacherId = userId;
      const id = schedules[index]?.id;

      return {
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

    const updateSchedules: ScheduleUpdateInput[] = eventSchedules.filter(
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
      editing = !editing;
    } else {
      alert("Error");
    }

    loading = true;
  }

  $: if (editing && calendar) {
    calendar?.removeAllEvents();
    calendar?.setOption("editable", true);
    calendar?.setOption("selectable", true);
    calendar?.setOption("eventClick", (e) => {
      e.event.remove();
    });

    schedulesEvent.forEach((event) => {
      calendar?.addEvent({
        ...event,
        display: "block",
        overlap: false,
      });
    });
  } else if (calendar) {
    calendar?.removeAllEvents();
    calendar?.setOption("editable", false);
    calendar?.setOption("selectable", false);
    calendar?.setOption("eventClick", undefined);

    schedulesEvent.forEach((event) => {
      calendar?.addEvent({
        ...event,
        title: "Open Schedule",
        display: "background",
      });
    });
    bookingsEvent.forEach((event) => {
      calendar?.addEvent(event);
    });
  }

  $: if (loading) {
    (async () => {
      const responseBooking = await bookingGetAll({ page: 0, size: 10000 });
      if (!responseBooking) {
        return;
      }
      const responseSchedule = await scheduleGetAllByUser({ userId });
      if (!responseSchedule) {
        return;
      }

      schedules = responseSchedule.content;
      bookings = responseBooking.content;

      loading = false;
    })();
  }

  $: if (calendarEl) {
    calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      headerToolbar: false,
      views: {
        timeGridWeek: {
          allDaySlot: false,
          dayHeaderContent: (header) => {
            const date = header.date;
            const dayName = date.toDateString().split(" ")[0];
            return dayName;
          },
        },
      },
      select: (e) => {
        calendar?.addEvent({
          start: e.start,
          end: e.end,
        });
      },
    });

    calendar.render();
  }
</script>

<header class="flex justify-between items-center">
  <h2 class="text-2xl">Weekly Schedule</h2>

  <button
    on:click={() => {
      if (editing) {
        handleSave(calendar?.getEvents() ?? []);
      } else {
        editing = !editing;
      }
    }}
    class="px-4 py-2 bg-blue-500 rounded-md text-white"
  >
    {editing ? "Save" : "Edit"}
  </button>
</header>

<section class="mt-2">
  <div bind:this={calendarEl} class="h-[80vh]" />
</section>
