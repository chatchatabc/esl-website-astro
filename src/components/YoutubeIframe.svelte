<script lang="ts">
  export let teacher: Record<string, any>;
  
  let showIframe = false;
  let count = 0;
  function BtnClick(event:any){
    showIframe = true;
   
  }
</script>

<div class="flex h-full w-full items-center">
  <div class="w-full h-0 pb-[50%] relative">
    {#if showIframe}
      <iframe
        class="w-full h-full absolute"
        src={teacher.video}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    {/if}
    {#if !showIframe}
      <div class="absolute h-full w-full youtube-thumbnail-button">
      
          <button
            on:click={BtnClick}
            class="absolute w-full h-full left-0 top-0">
            <img
              src={teacher.videoThumbnail}
              alt="Video"
              class="absolute w-[100%] h-[100%] top-0"
            />
          </button
          >
        
      </div>
    {/if}

  </div>
  
</div>

