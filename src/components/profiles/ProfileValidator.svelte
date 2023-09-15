<script lang="ts">
  import { onMount } from "svelte";
  import LoadingComp from "@components/LoadingComp.svelte";
  import ProfileInformation from "./ProfileInformation.svelte";
  import ClassList from "./ClassList.svelte";
  import StudentCashList from "./ProfileCreditLogs.svelte";
  import type { User } from "../../../../esl-workers/src/domain/models/UserModel";
  import {
    authGetPhoneToken,
    authGetProfile,
    authValidatePhoneToken,
    authUpdateProfile,
  } from "@services/authService";
  import { utilCookieSave } from "@services/utilService";
  import { validatePhoneNumber } from "@services/validationService";

  let reset = 0;
  let loading = true;
  let sendLoading = false;
  let user: User | null = null;
  let step = 0;
  let timer = 0;
  let interval: any = null;

  function handleReset() {
    reset = reset + 1;
  }

  async function handleGetPhoneToken() {
    sendLoading = true;
    const response = await authGetPhoneToken();
    if (response) {
      timer = 60;
      interval = setInterval(() => {
        timer = timer - 1;
        if (timer <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } else {
      alert("Failed to send phone token");
    }
    sendLoading = false;
  }

  async function handleValidatePhoneToken(e: any) {
    const formData = new FormData(e.target);
    const objData = Object.fromEntries(formData.entries());
    const response = await authValidatePhoneToken({
      token: objData.token as string,
    });

    if (!response) {
      alert("Failed to validate phone");
    } else {
      user = await authGetProfile();
      step = 2;
    }
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    if (
      data.firstName === user?.firstName &&
      data.lastName === user?.lastName &&
      data.phone === user?.phone
    ) {
      step = 1;
      return;
    }

    const isValid = validatePhoneNumber(data.phone as string);
    if (!isValid) {
      alert("Invalid Chinese phone number");
      return;
    }

    const response = await authUpdateProfile(data);

    if (response) {
      user = await authGetProfile();
      step = 1;
    } else {
      alert("Failed to update profile");
    }
  }

  $: if (reset) {
    (async () => {
      user = await authGetProfile();
    })();
  }

  onMount(async () => {
    user = await authGetProfile();

    if (!user) {
      utilCookieSave("userId", "", 0);
      window.location.href = "/login";
    }

    if (
      user?.firstName &&
      user.lastName &&
      user.phone &&
      !user.phoneVerifiedAt
    ) {
      step = 1;
    } else if (user?.phoneVerifiedAt) {
      step = 2;
    }

    loading = false;
  });
</script>

{#if loading}
  <div
    class="bg-white rounded-xl p-4 flex justify-center items-center h-[80vh]"
  >
    <LoadingComp />
  </div>
{:else if user}
  {#if step === 0}
    <section
      class="bg-white rounded-3xl my-8 max-w-lg mx-auto overflow-hidden p-8"
    >
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
    <section
      class="bg-white rounded-3xl my-8 max-w-lg mx-auto overflow-hidden p-8"
    >
      <header>
        <h1 class="text-2xl">Verify Phone Number</h1>
      </header>

      <p class="text-xs">
        We would like to verify your contact information to ensure the security
        of your account.
      </p>

      <section class="mt-4">
        <form on:submit|preventDefault={handleValidatePhoneToken} class="-mx-1">
          <div class="flex items-center">
            <div class="flex w-1/2 flex-col p-1">
              <div class="text-xs font-bold flex space-x-2">
                <p>Phone</p>
              </div>
              <p>+86{user?.phone}</p>
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
                class={`px-4 py-2 ${
                  timer || sendLoading ? "text-gray-500" : "text-blue-500"
                }`}
                disabled={timer ? true : false}
              >
                {sendLoading ? "loading" : timer ? timer : "Send Code"}
              </button>
            </div>
          </label>

          <footer class="p-1 mt-2 flex space-x-2">
            <button
              on:click={async () => {
                step = 0;
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
    <section class="bg-white rounded-3xl p-4 my-8">
      <ProfileInformation {user} />
    </section>

    <section class="flex -mx-2 flex-wrap my-8">
      <section class="px-2 w-full lg:w-1/2">
        <section class="bg-white rounded-xl p-4">
          <ClassList {reset} {handleReset} roleId={user.roleId} />
        </section>
      </section>

      <section class="px-2 w-full lg:w-1/2">
        <section class="bg-white rounded-xl p-4">
          <StudentCashList userId={user.id} {reset} />
        </section>
      </section>
    </section>
  {/if}

  <!-- {#if user.roleId === 3}
    <section class="bg-white rounded-xl p-4 mt-4">
      <ClassList {reset} {handleReset} roleId={user.roleId} />
    </section>

    <section class="bg-white rounded-xl p-4 mt-4">
      <TeacherScheduleEditor userId={user.id} />
    </section>
  {/if} -->
{:else}
  <div>Not logged in</div>
{/if}
