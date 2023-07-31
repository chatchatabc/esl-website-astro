<script lang="ts">
  export let teacherId: number;

  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import type { Booking } from "src/domain/models/BookingModel";
  import type { Schedule } from "src/domain/models/ScheduleModel";
  import type { User } from "src/domain/models/UserModel";
  import {
    bookingCreate,
    bookingGetAllByUser,
  } from "src/domain/services/client/bookingService";
  import { scheduleGetAllByUser } from "src/domain/services/client/scheduleService";
  import { userGetProfile } from "src/domain/services/client/userService";
  import { onMount } from "svelte";
  import LoadingComp from "./LoadingComp.svelte";

  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hourCycle: "h23",
  });
  const dateFormatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  let showModal = false;
  let schedules = [] as Schedule[];
  let bookings = [] as Booking[];
  let calendar = null as Calendar | null;
  let calendarDate = new Date();
  let dateValue = "";
  let startValue = new Date();
  let endValue = new Date(startValue.getTime() + 30 * 60000);
  let user: User | null = null;
  let loading = true;
  let calendarEl: any;

  $: if (calendarEl) {
    calendar = new Calendar(calendarEl, {
      plugins: [listPlugin],
      aspectRatio: 0.1,
      initialView: "listWeek",
      headerToolbar: {
        left: "",
        right: "",
      },
      eventClick: (e) => {
        showModal = true;
        const selectedDate = new Date(e.event.start ?? 0);

        const dateArray = dateFormatter.format(selectedDate).split("/");
        dateValue = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
        startValue = selectedDate;
        endValue = new Date(selectedDate.getTime() + 30 * 60000);
      },
    });

    calendar.render();
    generateOpenSchedules();
  }

  function generateOpenSchedules() {
    if (calendar) {
      calendar.removeAllEvents();
      schedules.map((schedule) => {
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
            id: `open-${start.getTime()}`,
            title: "Open Schedule",
            start,
            end: start.getTime() + 30 * 60000,
          };

          if (start > new Date()) {
            calendar?.addEvent(event);
          }

          start = new Date(start.getTime() + 30 * 60000);
        }
      });

      bookings.forEach((booking) => {
        let start = new Date(booking.start);
        const end = new Date(booking.end);
        while (start < end) {
          const event = calendar?.getEventById(`open-${start.getTime()}`);
          if (event) {
            event.remove();
          }
          start = new Date(start.getTime() + 30 * 60000);
        }
      });
    }
  }

  async function handleSubmit() {
    const data = {
      start: startValue.getTime(),
      end: endValue.getTime(),
      teacherId,
      status: 0,
      studentId: user?.id,
    };
    const response = await bookingCreate(data);

    if (response) {
      schedules =
        (await scheduleGetAllByUser({ userId: teacherId }))?.content ?? [];
      bookings =
        (await bookingGetAllByUser({ userId: teacherId }))?.content ?? [];
      bookings = bookings.filter((booking) => {
        return booking.status === 1;
      });
      generateOpenSchedules();
      showModal = false;
    } else {
      alert("Something went wrong");
    }
  }

  onMount(async () => {
    user = await userGetProfile();
    calendarDate.setDate(calendarDate.getDate() - calendarDate.getDay());
    schedules =
      (await scheduleGetAllByUser({ userId: teacherId }))?.content ?? [];
    bookings =
      (await bookingGetAllByUser({ userId: teacherId }))?.content ?? [];
    bookings = bookings.filter((booking) => {
      return booking.status === 1;
    });
    loading = false;
  });
</script>

<!-- Modal -->
<div
  aria-hidden={showModal ? "false" : "true"}
  aria-label="Modal Background"
  on:click={(e) => {
    if (e.target === e.currentTarget) {
      showModal = false;
    }
  }}
  class={`fixed top-0 left-0 bg-black bg-opacity-30 h-full w-full ${
    showModal
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
  } flex z-[5] justify-center items-center transition`}
>
  <!-- Content -->
  <div class="bg-white p-8 max-w-xs w-full rounded-lg">
    <form class="space-y-2" on:submit|preventDefault={handleSubmit}>
      <label class="flex flex-col">
        <span class="font-bold text-xs">Date</span>
        <input
          value={dateValue}
          name="date"
          class="border border-black rounded-md p-2"
          type="date"
          required
        />
      </label>

      <label class="flex flex-col">
        <span class="font-bold text-xs">Start Time</span>
        <input
          disabled
          value={timeFormatter.format(startValue)}
          name="start"
          class="border flex-1 border-black rounded-md p-2"
          type="time"
          required
        />
      </label>

      <label class="flex flex-col">
        <span class="font-bold text-xs">End Time</span>

        <div class="flex items-center">
          <input
            disabled
            value={timeFormatter.format(endValue)}
            name="end"
            class="border border-black rounded-md p-2 flex-1"
            type="time"
            required
          />
          <div class="flex px-2 space-x-2 text-2xl">
            <button
              type="button"
              on:click={() => {
                endValue = new Date(endValue.getTime() - 30 * 60000);
              }}
            >
              -
            </button>
            <button
              type="button"
              on:click={() => {
                endValue = new Date(endValue.getTime() + 30 * 60000);
              }}
            >
              +
            </button>
          </div>
        </div>
      </label>

      <button class="px-4 border-black py-2 border rounded-md mx-auto block">
        Submit
      </button>
    </form>
  </div>
</div>

{#if loading}
  <div
    class="bg-white rounded-xl p-4 flex justify-center items-center h-[50vh]"
  >
    <LoadingComp />
  </div>
{:else if user}
  <section>
    <header class="flex justify-between items-center space-x-2">
      <section class="flex space-x-2">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-md"
          on:click={() => {
            calendar?.prev();
            calendarDate.setDate(calendarDate.getDate() - 7);
            calendarDate = new Date(calendarDate);
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
            calendarDate = new Date(calendarDate);
            generateOpenSchedules();
          }}
        >
          Next
        </button>
      </section>

      <p class="text-lg">
        {dateFormatter.format(calendarDate)} - {dateFormatter.format(
          new Date().setDate(calendarDate.getDate() + 6)
        )}
      </p>
    </header>

    <section>
      <div bind:this={calendarEl} class="-mt-4 h-[80vh]" />
    </section>
  </section>
{:else}
  <div
    class="bg-white rounded-xl p-4 flex justify-center items-center h-[40vh]"
  >
    <p class="text-center">
      Please <a href="/login">login</a> to view this page
    </p>
  </div>
{/if}
