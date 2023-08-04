<script lang="ts">
  export let totalElements: number,
    page: number,
    size: number,
    handleChange: (page: number) => void;

  const totalPages = Math.ceil(totalElements / size) + 1;
</script>

<div class="flex space-x-2 items-center">
  <p>{page + 1} / {totalPages}</p>

  <div class="space-x-1 flex items-center">
    <button
      class={`h-8 w-8 rounded-full bg-blue-500 text-white ${
        page === 0 && "opacity-50"
      }`}
      disabled={page === 0}
      on:click={() => {
        handleChange(page - 1);
      }}
    >
      &lt;
    </button>

    <button
      class={`h-8 w-8 rounded-full bg-blue-500 text-white ${
        page + 1 === totalPages && "opacity-50"
      }`}
      disabled={page + 1 === totalPages}
      on:click={() => {
        handleChange(page + 1);
      }}
    >
      &gt;
    </button>
  </div>
</div>
