<script lang="ts">
  import type { User } from "src/domain/models/UserModel";
  import {
    userGetProfile,
    userUpdateProfile,
  } from "src/domain/services/client/userService";
  import { onMount } from "svelte";
  import LoadingComp from "./LoadingComp.svelte";

  let loading = true;
  let user = null as User | null;
  let step = 0;
  let phoneCode = "";
  let emailCode = "";

  $: if (step === 1) {
    if (user?.phoneVerifiedAt && user?.emailVerifiedAt) {
      step = 2;
    }
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    const response = await userUpdateProfile(data);

    if (response) {
      step = 1;
    } else {
      alert("Failed to update profile");
    }
  }

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
      <form class="-mx-1" on:submit|preventDefault={handleFormSubmit}>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">First name</span>
          <input
            required
            name="firstName"
            class="border rounded-md p-2"
            placeholder="First name"
            value={user?.firstName}
          />
        </label>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Last name</span>
          <input
            required
            name="lastName"
            class="border rounded-md p-2"
            placeholder="Last name"
            value={user?.lastName}
          />
        </label>
        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Phone number</span>
          <div class="flex items-center space-x-1">
            <span>+86</span>
            <input
              required
              name="phone"
              class="border rounded-md p-2 flex-1"
              placeholder="Phone number"
              value={user?.phone}
            />
          </div>
        </label>

        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Email</span>
          <input
            required
            type="email"
            name="email"
            class="border rounded-md p-2"
            placeholder="Email"
            value={user?.email}
          />
        </label>

        <footer class="p-1 mt-2 space-y-2">
          <button
            class="mx-auto text-sm w-full block p-2 rounded-md bg-blue-300 transition hover:bg-blue-400"
          >
            Next
          </button>
        </footer>
      </form>
    </section>
  </section>
{:else if step === 1}
  <section class="bg-white rounded-xl overflow-hidden p-8">
    <header>
      <h1 class="text-2xl">Contact Validation</h1>
    </header>

    <p class="text-xs">
      The codes have been sent to your contact details, please check and
      validate your contact details.
    </p>

    <section class="mt-4">
      <form class="-mx-1">
        <div class="flex items-center">
          <div class="flex w-1/2 flex-col p-1">
            <div class="text-xs font-bold flex space-x-2">
              <p>Phone</p>
              <p class="text-red-500">(Inactive)</p>
            </div>
            <p>{user?.phone}</p>
          </div>

          <div class="flex w-1/2 flex-col p-1">
            <div class="text-xs font-bold flex space-x-2">
              <p>Email</p>
              <p class="text-red-500">(Inactive)</p>
            </div>
            <p>{user?.email}</p>
          </div>
        </div>

        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Phone Validation</span>
          <div class="flex space-x-1">
            <input
              value={phoneCode}
              required
              name="lastName"
              class="border rounded-md p-2 flex-1"
              placeholder="Validation code"
            />
            <button class="px-4 py-2 text-blue-500">Validate</button>
          </div>
        </label>

        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Email Validation</span>
          <div class="flex space-x-1">
            <input
              value={emailCode}
              required
              name="lastName"
              class="border rounded-md p-2 flex-1"
              placeholder="Validation code"
            />
            <button class="px-4 py-2 text-blue-500">Validate</button>
          </div>
        </label>

        <footer class="p-1 mt-2 flex space-x-2">
          <button
            on:click={async () => {
              loading = true;

              user = await userGetProfile();
              step = 0;

              loading = false;
            }}
            type="button"
            class="mx-auto text-sm w-full block p-2 rounded-md text-blue-500"
          >
            Back
          </button>

          <button
            class="mx-auto text-sm w-full block p-2 rounded-md bg-blue-500 text-white transition hover:bg-blue-400"
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
