<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let open = false;

  function close() {
    open = false;
  }

  onMount(() => {
    const element = document.querySelector("#dynamic-modal");
    const innerElement = document.querySelector("#dynamic-modal-content");
    element?.addEventListener("click", (e) => {
      if (
        (e.target as Element).closest("#dynamic-modal-content") === innerElement
      )
        return;
      close();
    });
  });
</script>

<div
  id="dynamic-modal"
  class="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-md z-10"
  class:hidden={!open}
>
  <div id="dynamic-modal-inner" class="flex flex-col">
    <div class="flex justify-end w-full relative">
      <button
        class="close block text-black text-esl-3 p-2 bg-white bg-opacity-60 shadow-lg rounded-full hover:text-black focus:outline-none"
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
    <div
      id="dynamic-modal-content"
      class="block max-w-[640px] relative bg-white bg-opacity-60 shadow-lg rounded-[2.5rem] mt-5"
    >
      <div class="w-[300px] h-[300px] p-3 mx-auto">
        <slot />
      </div>
    </div>
  </div>
</div>
