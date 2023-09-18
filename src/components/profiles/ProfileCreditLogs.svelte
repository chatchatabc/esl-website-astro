<script lang="ts">
  export let userId: number, reset: number;

  import LoadingComp from "@components/LoadingComp.svelte";
  import Pagination from "@components/widgets/Pagination.svelte";
  import { logsGetAllCredit } from "@services/logsService";
  import type { LogsCredit } from "../../../../esl-workers/src/domain/models/LogsModel";

  let pagination = {
    page: 1,
    size: 10,
    totalElements: 0,
  };
  let loading = true;
  let showModal = false;
  let logs: LogsCredit[] = [];
  const dateFormatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  async function handleSubmit(e: any) {
    const formData = new FormData(e.target);
    const objData = Object.fromEntries(formData.entries());
    const data = {
      amount: Number(objData.amount),
    };
    // const response = await logsRequestCredit(data);
    // if (!response) {
    //   alert("Unable to make a request.");
    // } else {
    //   loading = true;
    //   showModal = false;
    // }
  }

  $: if (reset) {
    loading = true;
  }

  $: if (loading) {
    (async () => {
      const response = await logsGetAllCredit({
        page: pagination.page,
        size: pagination.size,
      });
      if (!response) {
        alert("Unable to fetch data.");
      } else {
        logs = response.content;
        pagination = {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
        };
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
    <section>
      <p>How much credits do you want to add?</p>
    </section>

    <form class="space-y-2 mt-4" on:submit|preventDefault={handleSubmit}>
      <label class="flex flex-col">
        <span class="font-bold text-xs">Amount</span>
        <input
          name="amount"
          class="border flex-1 border-black rounded-md p-2"
          required
        />
      </label>

      <button class="px-4 border-black py-2 border rounded-md mx-auto block">
        Request
      </button>
    </form>
  </div>
</div>

<header class="justify-between flex py-1">
  <h2 class="text-2xl">Transaction History</h2>
  <!-- <button
    class="bg-blue-500 text-white px-4 py-2 rounded-md"
    on:click={() => {
      showModal = true;
    }}
  >
    Add +
  </button> -->
</header>

<section class="border mt-2">
  {#if loading}
    <div class="flex justify-center p-8">
      <LoadingComp />
    </div>
  {:else}
    <ul class="h-[50vh] overflow-auto">
      {#if logs.length === 0}
        <li class="p-2 flex justify-center text-center">
          <p class="mx-auto w-5/6 md:w-3/4">
            No transactions have been made yet.
          </p>
        </li>
      {/if}
      {#each logs as log}
        <li class="p-2 flex shadow">
          <div class="w-2/3">
            <p class="text-xs font-bold">
              {dateFormatter.format(new Date(log.updatedAt ?? 0))} @ {timeFormatter.format(
                new Date(log.updatedAt ?? 0)
              )}
            </p>
            <p>{log.title}</p>
          </div>

          <div class={`w-1/3 text-end`}>
            <p>
              {log.amount}点
            </p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section class="mt-2 flex justify-end">
  <Pagination
    {...pagination}
    handleChange={(page) => {
      pagination = {
        ...pagination,
        page,
      };
      loading = true;
    }}
  />
</section>
