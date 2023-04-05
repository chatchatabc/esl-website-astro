<script lang="ts">
  export let teacher: Record<string, any>;
  let showIframe = false;
</script>

<div class="relative top-0 h-0 w-full pb-[50%]">
  {#if showIframe}
    <iframe
      class="w-full h-full"
      src={teacher.video}
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  {/if}

  <div class="absolute h-full w-full youtube-thumbnail-button">
    {#if !showIframe}
      <button
        on:click={() => (showIframe = true)}
        class="absolute w-full h-full left-0 top-0"><slot /></button
      >
    {/if}
  </div>
</div>
