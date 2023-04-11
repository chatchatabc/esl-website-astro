<script lang="ts">
  import { onMount } from "svelte";

  //calculation is based on style
  onMount(() => {
    let longDesc = document.querySelectorAll("div.longDesc");
    console.log(longDesc);

    longDesc.forEach((item, index) => {
      let span = item.querySelector("span.longDescText")! as HTMLSpanElement;
      let seeMoreLess = item.querySelectorAll(".descVisibility>span");

      // UpdateVisibility(span, item);
      // window.addEventListener("resize", () => {
      //   UpdateVisibility(span, item);
      // });

      seeMoreLess[0].addEventListener("click", () => {
        span.classList.add("unclamped");
        seeMoreLess[0].classList.add("hidden");
        seeMoreLess[1].classList.remove("hidden");
      }); //see more
      seeMoreLess[1].addEventListener("click", () => {
        span.classList.remove("unclamped");
        seeMoreLess[0].classList.remove("hidden");
        seeMoreLess[1].classList.add("hidden");
      }); //see less
    });

    // function UpdateVisibility(span: HTMLSpanElement, item: Element) {
    //   let descVisibility = item.querySelector(".descVisibility")!;
    //   if (!span.classList.contains("unclamped")) {
    //     if (span.clientHeight < span.scrollHeight) {
    //       descVisibility.classList.remove("hidden");
    //     } else {
    //       descVisibility.classList.add("hidden");
    //     }
    //   } else {
    //     let lineHeight = parseInt(window.getComputedStyle(span).lineHeight);
    //     let height = span.clientHeight;
    //     let maxLines = 2;
    //     if (height <= lineHeight * maxLines) {
    //       descVisibility.classList.add("hidden");
    //     } else {
    //       descVisibility.classList.remove("hidden");
    //     }
    //   }
    // }
  });
</script>

<div class="longDesc">
  <span class="longDescText clamped"><slot /></span>
  <div class="descVisibility pt-6 pb-0 font-medium text-esl-c-1">
    <span
      ><span>Show more</span><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        class="inline-block"
        viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4l-6 6Z"
        /></svg
      ></span
    >
    <span class="hidden"
      ><span>Show less</span><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        class="inline-block"
        viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M7.4 15.4L6 14l6-6l6 6l-1.4 1.4l-4.6-4.6l-4.6 4.6Z"
        /></svg
      ></span
    >
  </div>
</div>

<style>
  span.longDescText.clamped {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  :global(span.longDescText.clamped.unclamped) {
    -webkit-line-clamp: unset;
  }
</style>
