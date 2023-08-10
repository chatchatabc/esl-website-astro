<script lang="ts">
  import { onMount } from "svelte";
  import TeacherScheduleEditor from "./TeacherScheduleEditor.svelte";
  import LoadingComp from "@components/LoadingComp.svelte";
  import ProfileInformation from "./ProfileInformation.svelte";
  import ClassList from "./ClassList.svelte";
  import StudentCashList from "./ProfileCreditLogs.svelte";
  import AdminCreditList from "./AdminCreditList.svelte";
  import type { User } from "../../../../esl-workers/src/domain/models/UserModel";
  import { authGetProfile } from "@services/authService";

  let reset = 0;
  let loading = true;
  let user: User | null = null;

  function handleReset() {
    reset = reset + 1;
  }

  $: if (reset) {
    (async () => {
      user = await authGetProfile();
    })();
  }

  onMount(async () => {
    user = await authGetProfile();

    if (!user) {
      sessionStorage.clear();
      window.location.href = "/login";
    }

    if (!user?.firstName || !user?.phoneVerifiedAt) {
      window.location.href = "/register/completion";
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
  <section class="bg-white rounded-xl p-4">
    <ProfileInformation {user} />
  </section>

  {#if user.roleId === 3}
    <section class="bg-white rounded-xl p-4 mt-4">
      <ClassList {reset} {handleReset} roleId={user.roleId} />
    </section>

    <section class="bg-white rounded-xl p-4 mt-4">
      <TeacherScheduleEditor userId={user.id} />
    </section>
  {/if}

  {#if user.roleId === 2}
    <section class="flex -mx-2 flex-wrap">
      <section class="px-2 w-full lg:w-1/2">
        <section class="bg-white rounded-xl p-4 mt-4">
          <ClassList {reset} {handleReset} roleId={user.roleId} />
        </section>
      </section>

      <section class="px-2 w-full lg:w-1/2">
        <section class="bg-white rounded-xl p-4 mt-4">
          <StudentCashList userId={user.id} {reset} />
        </section>
      </section>
    </section>
  {/if}

  {#if user.roleId === 1}
    <section class="bg-white rounded-xl p-4 mt-4">
      <AdminCreditList userId={user.id} />
    </section>
  {/if}
{:else}
  <div>Not logged in</div>
{/if}
