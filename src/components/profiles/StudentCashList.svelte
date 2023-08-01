<script lang="ts">
  export let userId: number;

  import type { LogsCredit } from "src/domain/models/LogsModel";
  import { logsGetAllCredit } from "src/domain/services/client/logsService";
  import { onMount } from "svelte";

  let logs: LogsCredit[] = [];
  const logStatus: Record<number, string> = {
    0: "Pending",
    1: "Success",
    2: "Cancelled",
  };
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

  onMount(async () => {
    logs = (await logsGetAllCredit()) ?? [];
  });
</script>

<header>
  <h2 class="text-2xl">Transaction History</h2>
</header>

<section class="border mt-4">
  <ul class="h-[50vh] -mt-4 -mb-2 pt-4">
    {#each logs as log}
      <li class="p-2 flex shadow">
        <div class="w-1/2">
          <p class="text-xs font-bold">
            {dateFormatter.format(new Date(log.updatedAt ?? 0))} @ {timeFormatter.format(
              new Date(log.updatedAt ?? 0)
            )}
          </p>
          <p>{log.title}</p>
        </div>

        <div class="w-1/2 text-end">
          <p class="text-xs font-bold">
            {logStatus[log.status ?? 0]}
          </p>
          <p
            class={userId === log.receiverId
              ? "text-green-500"
              : "text-red-500"}
          >
            {log.amount}元
          </p>
        </div>
      </li>
    {/each}
  </ul>
</section>
