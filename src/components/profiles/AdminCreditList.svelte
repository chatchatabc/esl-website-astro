<script lang="ts">
  export let userId: number;

  import Pagination from "@components/widgets/Pagination.svelte";
  import type { LogsCredit } from "src/domain/models/LogsModel";
  import {
    logsApproveCredit,
    logsGetAllCredit,
    logsRejectCredit,
  } from "src/domain/services/client/logsService";

  const logStatus: Record<number, string> = {
    0: "Requested",
    1: "Approved",
    2: "Cancelled",
  };
  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  });
  const timeFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "short",
  });
  let showModal = false;
  let logs: LogsCredit[] = [];
  let selectedLogId: null | number = null;
  let isApprove = false;
  let loading = true;
  let pagination = {
    page: 1,
    size: 10,
    totalElements: 1,
  };

  async function handleApprove() {
    const data = { logId: selectedLogId ?? 0 };
    const response = isApprove
      ? await logsApproveCredit(data)
      : await logsRejectCredit(data);
    if (response) {
      loading = true;
      showModal = false;
    } else {
      alert("Something went wrong");
    }
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
          ...pagination,
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
      <p>
        Are you sure you want to {isApprove ? "approve" : "reject"} this request?
      </p>
    </section>

    <section class="flex justify-end mt-4 space-x-2">
      <button
        class="px-4 py-2 rounded-md"
        on:click={() => {
          showModal = false;
        }}
      >
        Cancel
      </button>
      <button
        on:click={() => {
          handleApprove();
        }}
        class={`px-4 py-2 ${
          isApprove ? "bg-blue-500" : "bg-red-500"
        } text-white rounded-md`}
      >
        {isApprove ? "Approve" : "Reject"}
      </button>
    </section>
  </div>
</div>

<header class="justify-between flex">
  <h2 class="text-2xl">Credit Requests</h2>
</header>

<section class="border mt-2">
  <ul class="h-[50vh] overflow-auto">
    {#each logs as log}
      <li class="p-2 flex shadow">
        <div class="w-1/2">
          <p class="text-xs font-bold">
            {dateFormatter.format(new Date(log.updatedAt ?? 0))} @ {timeFormatter.format(
              new Date(log.updatedAt ?? 0)
            )}
          </p>
          <p>Requested by {log.receiver?.firstName} {log.receiver?.lastName}</p>
        </div>

        <div class="w-1/2 flex justify-end space-x-4">
          <div class="text-end">
            <p class="text-xs font-bold">
              {logStatus[log.status]}
            </p>
            <p>
              {userId === log.receiver?.id ? "Receive" : "Send"}
              {log.amount}元
            </p>
          </div>

          {#if log.status === 0}
            <div class="flex space-x-2 items-center">
              <button
                on:click={() => {
                  selectedLogId = log.id;
                  showModal = true;
                  isApprove = false;
                }}
                class="text-white bg-red-500 rounded-full w-8 h-8"
              >
                X
              </button>
              <button
                on:click={() => {
                  selectedLogId = log.id;
                  showModal = true;
                  isApprove = true;
                }}
                class="text-white bg-blue-500 rounded-full w-8 h-8 p-1"
              >
                <svg
                  class="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="currentColor"
                    d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"
                  /></svg
                >
              </button>
            </div>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</section>

<section class="flex justify-end mt-2">
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
