<script lang="ts">
  import type { User } from "src/domain/models/UserModel";
  import { userGetProfile } from "src/domain/services/client/userService";
  import { onMount } from "svelte";
  import TeacherClassList from "./TeacherClassList.svelte";
  import TeacherScheduleEditor from "./TeacherScheduleEditor.svelte";

  let loading = true;
  let user: User | null = null;

  onMount(async () => {
    user = await userGetProfile();

    if (!user) {
      sessionStorage.clear();
      window.location.href = "/login";
    }

    loading = false;
  });
</script>

{#if loading}
  <div>Loading</div>
{:else if user}
  <section class="bg-white rounded-xl p-4">
    <header>
      <h2 class="text-2xl">Profile</h2>
    </header>

    <section>Test</section>
  </section>

  {#if user.roleId === 3}
    <section class="bg-white rounded-xl p-4 mt-4">
      <TeacherClassList />
    </section>

    <section class="bg-white rounded-xl p-4 mt-4">
      <TeacherScheduleEditor />
    </section>
  {/if}
{:else}
  <div>Not logged in</div>
{/if}
