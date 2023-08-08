<script lang="ts">
  import type { User } from "src/domain/models/UserModel";

  export let user: User;
</script>

<header class="flex">
  <h2 class="text-2xl">Profile</h2>
</header>

<section class="flex flex-wrap -mx-2">
  <div class="p-2 w-1/2 md:w-1/3 lg:w-1/5">
    <h3 class="text-xs font-bold">First name</h3>
    <p class="capitalize">{user.firstName}</p>
  </div>

  <div class="p-2 w-1/2 md:w-1/3 lg:w-1/5">
    <h3 class="text-xs font-bold">Last name</h3>
    <p class="capitalize">{user.lastName}</p>
  </div>

  <div class="p-2 w-1/2 md:w-1/3 lg:w-1/5">
    <h3 class="text-xs font-bold">Username</h3>
    <p>{user.username}</p>
  </div>

  <div class="p-2 w-1/2 md:w-1/3 lg:w-1/5">
    <h3 class="text-xs font-bold">Phone</h3>
    <p class="capitalize">{user.phone}</p>
  </div>

  {#if user.roleId !== 3}
    <div class="p-2 w-1/2 md:w-1/3 lg:w-1/5">
      <h3 class="text-xs font-bold">Credit</h3>
      <p class="capitalize">{user.credit}元</p>
    </div>
  {/if}
</section>
