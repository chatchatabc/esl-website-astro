<script lang="ts">
  export let userId: number;

  import { Calendar } from "@fullcalendar/core";
  import type { EventImpl } from "@fullcalendar/core/internal";
  import interactionPlugin from "@fullcalendar/interaction";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import type { Booking } from "src/domain/models/BookingModel";
  import type { Schedule } from "src/domain/models/ScheduleModel";
  import { bookingGetAll } from "src/domain/services/client/bookingService";
  import {
    scheduleConvertToRecurringEvent,
    scheduleCreateMany,
    scheduleDeleteMany,
    scheduleGetAllByUser,
    scheduleUpdateMany,
  } from "src/domain/services/client/scheduleService";

  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hourCycle: "h23",
  });

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
      return scheduleConvertToRecurringEvent(schedule);
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
  }
</script>

<section>
  <div bind:this={calendarEl} class="h-[80vh]" />
</section>
