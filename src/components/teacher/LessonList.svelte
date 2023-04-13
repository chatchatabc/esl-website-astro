<script lang="ts">
  import Modal from "../common/Modal.svelte";
  export let showModal = false;
  export let lessons: Array<string>;

  function toggleModal() {
    showModal = !showModal;
  }
</script>

<div class="bg-white p-5 mt-4">
  <div class="space-y-4 sm:w-10/12 sm:mx-auto">
    {#each lessons as lesson}
      <!--lesson item -->
      <div
        class="bg-white drop-shadow-esl-sm p-4 flex justify-between hover:drop-shadow-esl-md"
      >
        <div class="text-esl-2">{lesson}</div>
        <button
          class="bg-[#FF4438] py-1 px-[2rem] rounded-full text-white"
          on:click={toggleModal}
        >
          预约
        </button>
      </div>
    {/each}
  </div>
</div>

<Modal bind:open={showModal}><slot name="img" /></Modal>
