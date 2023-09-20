<script lang="ts">
  import LoadingComp from "@components/LoadingComp.svelte";

  export let reset: number, handleReset: () => void, roleId: number;

  import Pagination from "@components/widgets/Pagination.svelte";
  import { Calendar } from "@fullcalendar/core";
  import listPlugin from "@fullcalendar/list";
  import { bookingCancel, bookingGetAll } from "@services/bookingService";
  import type { Booking } from "../../../../esl-backend-workers/src/domain/models/BookingModel";

  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  });
  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  });
  let pagination = {
    page: 1,
    size: 10,
    totalElements: 0,
  };
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
          title: `${booking.teacher?.alias}`,
          start: booking.start,
          end: booking.end,
        });
      });
    }
  }

  async function handleCancel() {
    const response = await bookingCancel({ id: bookingId });
    if (!response) {
      alert("Unable to cancel");
    }
    showModal = false;
    handleReset();
  }

  $: if (reset) {
    loading = true;
  }

  $: if (loading) {
    (async () => {
      const response = await bookingGetAll({
        ...pagination,
        status: [1, 2],
        sort: "start,DESC",
      });
      if (!response) {
        alert("Unable to fetch bookings");
      } else {
        pagination = {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
        };
        bookings = response.content;
        generateClass();
      }
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
  <h2 class="text-2xl py-1">Class History</h2>
</header>

<section class="border mt-2">
  {#if loading}
    <div class="flex h-[50vh] justify-center p-8">
      <LoadingComp />
    </div>
  {:else}
    <ul class="overflow-auto h-[50vh]">
      {#if !bookings.length}
        <li class="p-2 shadow text-center">
          <p class="mx-auto w-5/6 md:w-3/4">
            No booked classes yet, please visit <a
              class="text-blue-500 underline hover:no-underline"
              href="/teachers">teachers page</a
            > to browse and book a class.
          </p>
        </li>
      {/if}
      {#each bookings as booking}
        <li class="p-2 shadow flex items-center">
          <div class="flex-1">
            <p class="text-xs">
              {timeFormatter.format(new Date(booking.start))} - {timeFormatter.format(
                new Date(booking.end)
              )}
              <span class="font-bold">
                @ {dateFormatter.format(new Date(booking.start))}
              </span>
            </p>
            {#if roleId === 3}
              <p>
                {booking.user?.firstName}
                {booking.user?.lastName} |
                <a
                  class="text-blue-500 underline hover:no-underline"
                  href={`tel:${booking.user?.phone}`}
                >
                  {booking.user?.phone}
                </a>
              </p>
            {:else}
              <p>
                {booking.teacher?.alias}
              </p>
            {/if}
          </div>
          {#if roleId !== 3 && new Date(booking.start) > new Date(Date.now() + 6 * 60 * 60 * 1000)}
            <button
              class="w-8 h-8 bg-red-500 text-white rounded-full"
              on:click={() => {
                bookingId = booking.id;
                showModal = true;
              }}
            >
              X
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section class="mt-2 flex justify-end">
  <Pagination
    handleChange={(page) => {
      pagination = {
        ...pagination,
        page,
      };
      loading = true;
    }}
    {...pagination}
  />
</section>
