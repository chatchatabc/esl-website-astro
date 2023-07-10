<script lang="ts">
  type NavLink = { text: string; link: string };
  export let links: Array<NavLink>;
  export let currentPage: string;
  let mobileStyle1 = `max-lg:block max-lg:p-[1rem] max-lg:m-0 max-lg:border-b-0  text-esl-c-2`;
  let style1 = `inline-block text-white  m-4 border-b-2 pb-2 text-esl-2 cursor-pointer`;
  let style2 =
    "inline-block  py-2 px-4 mt-2 rounded-full bg-white text-esl-2 text-esl-c-4 hover:bg-esl-c-2 hover:text-white";
  let navOpen = false;
  const ToggleNav = () => {
    navOpen = !navOpen;
  };
</script>

<nav class="w-full top-0 lg:w-10/12 lg:mx-auto lg:mt-10 items-center z-[2]">
  <!--mobile -->
  <div
    class="relative m-nav {navOpen
      ? 'open'
      : ''} border-b border-[#0057af] border-solid drop-shadow-md lg:hidden"
  >
    <div class="block relative z-[2]">
      <div class="menu-toggle w-full block relative bg-esl-c-1">
        <div class="burger grid grid-cols-3">
          <button class="p-[1rem] w-fit text-white block" on:click={ToggleNav}>
            <slot name="hamburger" />
          </button>
          <!--mobile company logo-->
          <slot name="mobileCompanyLogo" />
        </div>

        <div
          class=" m-close w-full text-esl-c-2 hidden {navOpen
            ? 'bg-white'
            : ''}"
        >
          <button class="w-fit p-[1rem]" on:click={ToggleNav}>
            <slot name="close" />
          </button>
        </div>
      </div>
    </div>

    <div
      class="burger-items absolute w-full overflow-hidden bg-white transition-[transform] duration-500 z-[1]"
    >
      <div class="fit">
        {#each links as link}
          <a
            on:click={ToggleNav}
            class={mobileStyle1 +
              (link.text === currentPage
                ? " border-b-esl-c-3 "
                : " hover:border-b-esl-c-3 ") +
              (link.text === "Home" ? "ml-0 " : "") +
              " mobile-nav-link"}
            href={`/${link.link}`}
          >
            {link.text}
          </a>
        {/each}
      </div>
      <div class="fit block">
        <a
          on:click={ToggleNav}
          class={mobileStyle1 + " mobile-nav-link"}
          href="#contact">联系我们</a
        >
      </div>
    </div>
  </div>
  <!--desktop-->
  <div class="container mx-auto">
    <div class="hidden justify-between lg:flex">
      <slot name="companyLogo" />
      <div class="fit">
        {#each links as link}
          <a
            class={(link.text === currentPage
              ? "border-b-esl-c-3 hover:border-b-esl-c-2 "
              : "border-b-transparent hover:border-b-esl-c-3 ") +
              (link.text === "Home" ? "ml-0 " : "") +
              style1}
            href={`/${link.link}`}
          >
            {link.text}
          </a>
        {/each}
      </div>
      <div class="fit inline-block lg:block">
        <a class={style2} href="#contact">联系我们</a>
      </div>
    </div>
  </div>
</nav>

<style>
  .m-nav.open {
    filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))
      drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
  }
  .m-nav.open .burger {
    display: none;
  }
  .m-nav.open .m-close {
    display: block;
  }
  .m-nav .burger-items {
    transform: translateY(-100%);
    pointer-events: none;
  }
  .m-nav.open .burger-items {
    pointer-events: initial;
    transform: translateY(0);
  }
</style>
