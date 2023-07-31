<script lang="ts">
  import type { User } from "src/domain/models/UserModel";
  import {
    userGetPhoneToken,
    userGetProfile,
    userUpdateProfile,
    userValidatePhone,
  } from "src/domain/services/client/userService";
  import { onMount } from "svelte";
  import LoadingComp from "./LoadingComp.svelte";
  import { validatePhoneNumber } from "src/domain/services/validationService";

  let loading = true;
  let user = null as User | null;
  let step = 0;

  async function handleGetPhoneToken() {
    const response = await userGetPhoneToken();
  }

  async function handleValidatePhoneToken(e: any) {
    const formData = new FormData(e.target);
    const objData = Object.fromEntries(formData.entries());

    const response = await userValidatePhone({
      token: objData.token as string,
    });
    if (!response) {
      alert("Failed to validate phone");
    } else {
      user = await userGetProfile();
      step = 2;
    }
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    const isValid = validatePhoneNumber(data.phone as string);
    if (!isValid) {
      alert("Invalid Chinese phone number");
      return;
    }

    const response = await userUpdateProfile(data);

    if (response) {
      user = await userGetProfile();
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

    if (user?.firstName && user?.lastName && user?.phone) {
      step = 1;
    } else if (user?.phoneVerifiedAt) {
      window.location.href = "/profile";
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
              title="Chinese phone number"
              value={user?.phone}
            />
          </div>
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
      <h1 class="text-2xl">Verify Phone Number</h1>
    </header>

    <p class="text-xs">
      We would like to verify your contact information to ensure the security of
      your account.
    </p>

    <section class="mt-4">
      <form on:submit|preventDefault={handleValidatePhoneToken} class="-mx-1">
        <div class="flex items-center">
          <div class="flex w-1/2 flex-col p-1">
            <div class="text-xs font-bold flex space-x-2">
              <p>Phone</p>
            </div>
            <p>{user?.phone}</p>
          </div>
        </div>

        <label class="flex flex-col p-1">
          <span class="text-xs font-bold">Phone Validation</span>
          <div class="flex space-x-1">
            <input
              name="token"
              required
              class="border rounded-md p-2 flex-1"
              placeholder="Validation code"
            />
            <button
              type="button"
              on:click={handleGetPhoneToken}
              class="px-4 py-2 text-blue-500">Send Code</button
            >
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
            Validate
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
