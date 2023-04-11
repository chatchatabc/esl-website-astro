<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let open = false;

  function close() {
    open = false;
    dispatch("close");
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-10"
  class:hidden={!open}
  on:click={close}
>
  <div
    class=" backdrop-blur-md max-w-[640px] relative bg-black bg-opacity-60 shadow-lg rounded-lg"
    on:click={(e) => {
      e.stopPropagation();
    }}
  >
    <div class="flex justify-end">
      <button
        class="close block text-white text-esl-3 p-2 hover:text-black focus:outline-none"
        on:click={close}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
          /></svg
        >
      </button>
    </div>
    <div class="w-[300px] h-[300px] p-5 mx-auto">
      <slot />
    </div>
  </div>
</div>
