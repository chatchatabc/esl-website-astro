<script lang="ts">
  import type { Booking } from "src/domain/models/BookingModel";
  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import { authGetUserId } from "src/domain/services/client/authService";
  import {
    bookingGetAllByUser,
    bookingUpdate,
  } from "src/domain/services/client/bookingService";
  import { onMount } from "svelte";

  const dateFormatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hourCycle: "h23",
  });
  const bookingColor = {
    0: "#f59e0b",
    1: "#10b981",
    2: "#ef4444",
  };
  type BookingColor = typeof bookingColor;
  let showModal = false;
  let userId = 0;
  let bookings: Booking[] = [];
  let calendar = null as Calendar | null;
  let calendarEl: any;
  let selectedBookingId = 0;
  let dateValue = "";
  let startValue = new Date();
  let endValue = new Date(startValue.getTime() + 30 * 60000);

  async function handleSubmit(accept: boolean) {
    const selectedBooking = bookings.find(
      (booking) => booking.id === selectedBookingId
    );
    if (!selectedBooking) {
      alert("Booking not found");
      return;
    }

    selectedBooking.start = startValue.getTime();
    selectedBooking.end = endValue.getTime();
    selectedBooking.status = accept ? 1 : 2;

    const response = await bookingUpdate(selectedBooking);

    if (response) {
      generateEvents();
      showModal = false;
    } else {
      alert("Failed to update booking");
    }
  }

  function generateEvents() {
    if (calendar) {
      calendar.removeAllEvents();
      bookings.map((booking) => {
        const bookingDate = new Date(booking.start);
        if (booking.status !== 0 && bookingDate < new Date()) return;
        const event = {
          id: `${booking.id}`,
          title: `${booking.student?.username}`,
          start: booking.start,
          end: booking.end,
          backgroundColor: bookingColor[booking.status as keyof BookingColor],
        };
        calendar?.addEvent(event);
      });
    }
  }

  onMount(async () => {
    userId = authGetUserId() ?? 0;
    bookings = (await bookingGetAllByUser({ userId }))?.content ?? [];

    calendar = new Calendar(calendarEl, {
      plugins: [listPlugin],
      aspectRatio: 0.1,
      initialView: "listMonth",
      headerToolbar: {
        left: "",
        right: "",
      },
      views: {
        timeGridWeek: {
          allDaySlot: false,
        },
      },
      eventClick: (e) => {
        showModal = true;

        const dateArray = dateFormatter.format(e.event.start ?? 0).split("/");
        dateValue = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
        startValue = new Date(e.event.start ?? 0);
        endValue = new Date(e.event.end ?? 0);
        selectedBookingId = Number(e.event.id);
      },
    });

    calendar.render();
    generateEvents();
  });
</script>

<section>
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
      <form class="space-y-2">
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

        <section class="flex space-x-2 pt-2">
          <button
            on:click={() => {
              handleSubmit(false);
            }}
            type="button"
            class="px-4 border-red-500 border-2 py-2 text-red-500 rounded-md"
          >
            Reject
          </button>
          <button
            on:click={() => {
              handleSubmit(true);
            }}
            type="button"
            class="px-4 bg-green-500 text-white py-2 border rounded-md"
          >
            Accept
          </button>
        </section>
      </form>
    </div>
  </div>

  <header class="flex justify-between">
    <h2 class="text-2xl">Bookings</h2>
    <div class="flex space-x-2">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        on:click={() => {
          calendar?.prev();
        }}
      >
        Prev
      </button>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        on:click={() => {
          calendar?.next();
        }}
      >
        Next
      </button>
    </div>
  </header>

  <section>
    <div class="-mt-4 h-[300px]" bind:this={calendarEl} />
  </section>
</section>
