<script lang="ts">
  import type { User } from "src/domain/models/UserModel";
  import { userGetProfile } from "src/domain/services/client/userService";
  import { onMount } from "svelte";
  import TeacherClassList from "./TeacherClassList.svelte";
  import TeacherScheduleEditor from "./TeacherScheduleEditor.svelte";
  import LoadingComp from "@components/LoadingComp.svelte";
  import ProfileInformation from "./ProfileInformation.svelte";
  import StudentClassList from "./StudentClassList.svelte";
  import StudentCashList from "./StudentCashList.svelte";

  let loading = true;
  let user: User | null = null;

  onMount(async () => {
    user = await userGetProfile();

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
      <TeacherClassList />
    </section>

    <section class="bg-white rounded-xl p-4 mt-4">
      <TeacherScheduleEditor />
    </section>
  {/if}

  {#if user.roleId === 1}
    <section class="flex -mx-2">
      <section class="w-1/2 px-2">
        <section class="bg-white rounded-xl p-4 mt-4">
          <StudentClassList />
        </section>
      </section>

      <section class="w-1/2 px-2">
        <section class="bg-white rounded-xl p-4 mt-4">
          <StudentCashList userId={user.id} />
        </section>
      </section>
    </section>
  {/if}
{:else}
  <div>Not logged in</div>
{/if}
