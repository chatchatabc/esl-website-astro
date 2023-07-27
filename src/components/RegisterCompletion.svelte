<script lang="ts">
  import type { User } from "src/domain/models/UserModel";
  import { userGetProfile } from "src/domain/services/client/userService";
  import { onMount } from "svelte";
  import LoadingComp from "./LoadingComp.svelte";

  let loading = true;
  let user = null as User | null;
  let step = 0;

  onMount(async () => {
    user = await userGetProfile();

    if (!user) {
      sessionStorage.clear();
      window.location.href = "/login";
    }

    if (user?.firstName && user?.lastName && user?.phone && user?.email) {
      step = 1;
    } else if (user?.phoneVerifiedAt && user?.emailVerifiedAt) {
      step = 2;
    }

    loading = false;
  });
</script>

{#if loading}
  <div
    class="bg-white rounded-xl p-4 flex justify-center items-center h-[50vh]"
  >
    <LoadingComp />
  </div>
{:else if step === 0}
  <section class="bg-white rounded-xl overflow-hidden p-8">
    <header>
      <h1 class="text-2xl">More Details</h1>
    </header>

    <section class="mt-4">
      <form data-register-form class="-mx-1">
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">First name</span>
          <input
            required
            name="firstName"
            class="border rounded-md p-2"
            placeholder="First name"
          />
        </label>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Last name</span>
          <input
            required
            name="lastName"
            class="border rounded-md p-2"
            placeholder="Last name"
          />
        </label>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Phone number</span>
          <input
            required
            name="phoneNumber"
            class="border rounded-md p-2"
            placeholder="Phone number"
          />
        </label>

        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Email</span>
          <input
            required
            name="email"
            class="border rounded-md p-2"
            placeholder="Email"
          />
        </label>

        <footer class="p-1 mt-2 space-y-2">
          <button
            class="mx-auto text-sm w-full block p-2 rounded-md bg-blue-300 transition hover:bg-blue-400"
          >
            Finish
          </button>
        </footer>
      </form>
    </section>
  </section>
{:else if step === 1}
  <section class="bg-white rounded-xl overflow-hidden p-8">
    <header>
      <h1 class="text-2xl">More Details</h1>
    </header>

    <section class="mt-4">
      <form data-register-form class="-mx-1">
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">First name</span>
          <input
            required
            name="firstName"
            class="border rounded-md p-2"
            placeholder="First name"
          />
        </label>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Last name</span>
          <input
            required
            name="lastName"
            class="border rounded-md p-2"
            placeholder="Last name"
          />
        </label>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Phone number</span>
          <input
            required
            name="phoneNumber"
            class="border rounded-md p-2"
            placeholder="Phone number"
          />
        </label>

        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Email</span>
          <input
            required
            name="email"
            class="border rounded-md p-2"
            placeholder="Email"
          />
        </label>

        <footer class="p-1 mt-2 space-y-2">
          <button
            class="mx-auto text-sm w-full block p-2 rounded-md bg-blue-300 transition hover:bg-blue-400"
          >
            Finish
          </button>
        </footer>
      </form>
    </section>
  </section>
{:else if step === 2}
  <section class="bg-white rounded-xl overflow-hidden p-8">
    <header>
      <h1 class="text-2xl">Registration Complete!</h1>
    </header>

    <section class="mt-4">
      <p class="text-sm">
        You have successfully registered your account. You can now use your
        account to book a schedule.
      </p>
      <a href="/login" class="text-blue-400 hover:underline">Login</a>
    </section>
  </section>
{/if}
