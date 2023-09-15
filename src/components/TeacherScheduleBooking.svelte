<script lang="ts">
  export let teacherId: number;

  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import type { User } from "../../../esl-workers/src/domain/models/UserModel";
  import type { Schedule } from "../../../esl-workers/src/domain/models/ScheduleModel";
  import type { Booking } from "../../../esl-workers/src/domain/models/BookingModel";
  import type { Teacher } from "../../../esl-workers/src/domain/models/TeacherModel";
  import { bookingCreate, bookingGetAll } from "@services/bookingService";
  import { teacherGet } from "@services/teacherService";
  import { authGetProfile } from "@services/authService";
  import LoadingComp from "./LoadingComp.svelte";
  import { scheduleGetAll } from "@services/scheduleService";

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
  let teacher = null as Teacher | null;
  let calendarEl: any;
  let sending = false;

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
  }

  function generateOpenSchedules() {
    if (calendar) {
      calendar.removeAllEvents();

      schedules.map((schedule) => {
        let start = new Date(schedule.startTime);
        start.setFullYear(calendarDate.getFullYear());
        start.setMonth(calendarDate.getMonth());
        start.setUTCDate(calendarDate.getUTCDate() + schedule.day);
        const diff = schedule.endTime - schedule.startTime;
        const end = new Date(start.getTime() + diff);

        // Create event for each 30 minutes
        while (start < end) {
          // Only add events that are in the future
          if (start < new Date()) {
            start = new Date(start.getTime() + 30 * 60000);
            continue;
          }

          const event = {
            id: `open-${start.getTime()}`,
            title: "Open Schedule",
            start,
            end: start.getTime() + 30 * 60000,
          };
          calendar?.addEvent(event);
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

      calendar?.gotoDate(calendarDate);
    }
  }

  async function handleSubmit() {
    if (sending) {
      return;
    }

    if (!user || !teacher) {
      alert("Error. Missing data.");
      return;
    }

    if (endValue <= startValue) {
      alert(
        "Invalid time schedule. End time cannot be earlier or the same than start time."
      );
      return;
    }

    // const price =
    //   ((endValue.getTime() - startValue.getTime()) / 30 / 60000) *
    //   teacher.price;

    // if (price > user.credit ?? 0) {
    //   alert(
    //     "Invalid transaction. Booked price cannot be higher than your available credit points."
    //   );
    //   return;
    // }

    const data = {
      start: startValue.getTime(),
      end: endValue.getTime(),
      teacherId,
      studentId: user?.id,
    };
    // const response = await bookingCreate(data);

    // if (response) {
    //   showModal = false;
    // } else {
    //   alert(
    //     "Unable to book schedule. Please refresh the page and try again later."
    //   );
    // }

    loading = true;
  }

  $: if (loading) {
    (async () => {
      if (!user) {
        user = await authGetProfile();
        calendarDate.setDate(calendarDate.getDate() - calendarDate.getDay());
      }

      teacher = await teacherGet({ userId: teacherId });
      schedules = (await scheduleGetAll({ teacherId }))?.content ?? [];

      const responseBooking = await bookingGetAll({
        userId: teacherId,
        page: 1,
        size: 100000,
      });

      if (responseBooking) {
        bookings = responseBooking.content;
      }

      generateOpenSchedules();
      loading = false;
    })();
  }
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
  <div class="bg-white max-w-xl w-full rounded-lg overflow-hidden">
    <header class="p-4 border-b border-p flex bg-p-100 justify-between">
      <h3 class="text-xl font-bold text-p-950">Create booking</h3>

      <button
        on:click={() => {
          showModal = false;
        }}
        class="text-p-950 font-bold transition hover:text-p-700">X</button
      >
    </header>

    <form class="p-4 flex flex-wrap" on:submit|preventDefault={handleSubmit}>
      <section class="flex justify-between w-full p-1">
        <div class="-space-y-1">
          <p class="text-xs font-bold">Available Credits</p>
          <p>{user?.credits}点</p>
        </div>

        <div class="-space-y-1">
          <p class="text-xs font-bold">Total Cost</p>
          <p class="text-end">
            <!-- {teacher?.price &&
              (teacher.price * (endValue.getTime() - startValue.getTime())) /
                30 /
                60000}元 -->
            0点
          </p>
        </div>
      </section>

      <label class="flex flex-col w-full p-1">
        <span class="font-bold text-xs">Date</span>
        <input
          value={dateValue}
          name="date"
          class="border border-black rounded-md p-2"
          type="date"
          required
        />
      </label>

      <label class="flex flex-col w-1/2 p-1">
        <span class="font-bold text-xs">Start Time</span>
        <input
          disabled
          value={timeFormatter.format(startValue)}
          name="start"
          class="border bg-gray-100 cursor-not-allowed flex-1 border-black rounded-md p-2"
          type="time"
          required
        />
      </label>

      <label class="flex flex-col w-1/2 p-1">
        <span class="font-bold text-xs">End Time</span>

        <div class="flex items-center">
          <input
            disabled
            value={timeFormatter.format(endValue)}
            name="end"
            class="border border-black bg-gray-100 cursor-not-allowed rounded-md p-2 flex-1"
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

      <footer class="p-1 pt-4">
        <button
          class="px-8 bg-p text-white py-2 border rounded-md transition hover:bg-p-600"
          disabled={loading}
        >
          {sending ? "Sending" : "Submit"}
        </button>
      </footer>
    </form>
  </div>
</div>

{#if loading && !user}
  <div
    class="bg-white rounded-xl p-4 flex justify-center items-center h-[50vh]"
  >
    <LoadingComp />
  </div>
{:else if user}
  <section>
    {#if loading}
      <div
        class="bg-white rounded-xl p-4 flex justify-center items-center h-[50vh]"
      >
        <LoadingComp />
      </div>
    {/if}
    <header
      class={`justify-between items-center space-x-2 ${
        loading ? "hidden" : "flex"
      }`}
    >
      <section class="flex space-x-2">
        <button
          class="bg-p text-white px-4 py-2 rounded-md transition hover:bg-p-600"
          on:click={() => {
            calendarDate.setDate(calendarDate.getDate() - 7);
            calendarDate = new Date(calendarDate);

            generateOpenSchedules();
          }}
        >
          Prev
        </button>
        <button
          class="bg-p text-white px-4 py-2 rounded-md transition hover:bg-p-600"
          on:click={() => {
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

    <section class={`${loading ? "hidden" : ""}`}>
      <div bind:this={calendarEl} class="-mt-4 h-[80vh]" />
    </section>
  </section>
{:else}
  <div
    class="bg-white rounded-xl p-4 flex justify-center items-center h-[40vh]"
  >
    <p class="text-center">
      Please <a
        class="text-blue-500 underline hover:no-underline"
        href="/login"
      >
        login
      </a> in order to book a schedule with a teacher.
    </p>
  </div>
{/if}
