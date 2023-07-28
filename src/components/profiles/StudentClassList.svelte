<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import type { Booking } from "src/domain/models/BookingModel";
  import { bookingGetAll } from "src/domain/services/client/bookingService";
  import { onMount } from "svelte";

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
    });
    calendar.render();
  }

  function generateClass() {
    if (calendar) {
      calendar.removeAllEvents();
      bookings.forEach((booking) => {
        calendar?.addEvent({
          title: booking.teacher?.username,
          start: booking.start,
          end: booking.end,
        });
      });
    }
  }

  onMount(async () => {
    const response = await bookingGetAll({});
    bookings = response?.content ?? [];
    generateClass();
  });
</script>

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
