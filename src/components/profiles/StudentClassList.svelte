<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import type { Booking } from "src/domain/models/BookingModel";
  import {
    bookingCancel,
    bookingGetAll,
  } from "src/domain/services/client/bookingService";
  import { onMount } from "svelte";

  let loading = true;
  let bookingId = 0;
  let showModal = false;
  let calendarEl: any;
  let bookings = [] as Booking[];
  let calendar: Calendar | null;

  $: if (calendarEl) {
    calendar = new Calendar(calendarEl, {
      plugins: [listPlugin],
      aspectRatio: 0.1,
      initialView: "listMonth",
      headerToolbar: {
        left: "",
        right: "",
      },
      eventClick: (e) => {
        bookingId = Number(e.event.id);
        showModal = true;
      },
    });
    calendar.render();
  }

  function generateClass() {
    if (calendar) {
      calendar.removeAllEvents();
      bookings.forEach((booking) => {
        calendar?.addEvent({
          id: String(booking.id),
          title: booking.teacher?.username,
          start: booking.start,
          end: booking.end,
        });
      });
    }
  }

  async function fetchData() {
    const responseBooking = await bookingGetAll({});
    if (responseBooking) {
      bookings = responseBooking?.content ?? [];
      generateClass();
    }
    loading = false;
  }

  async function handleCancel() {
    const response = await bookingCancel({ bookingId });
    if (!response) {
      alert("Unable to cancel");
    }
    fetchData();
    showModal = false;
  }

  onMount(async () => {
    fetchData();
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
  <div class="bg-white p-8 max-w-sm w-full rounded-lg">
    <header>
      <h3 class="text-xl font-bold">Cancel Confirmation</h3>
    </header>

    <section class="mt-2">
      <p>Are you sure you want to cancel your booked class?</p>

      <footer class="flex space-x-2 mt-4 justify-end">
        <button
          class="text-blue-500 px-4 py-2 rounded-md"
          on:click={() => {
            showModal = false;
          }}>Cancel</button
        >
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md"
          on:click={handleCancel}
        >
          Yes
        </button>
      </footer>
    </section>
  </div>
</div>

<header class="flex justify-between">
  <h2 class="text-2xl">Class History</h2>
  <section class="flex space-x-2">
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
  </section>
</header>

<section>
  <div class="-mt-4 h-[50vh]" bind:this={calendarEl} />
</section>
