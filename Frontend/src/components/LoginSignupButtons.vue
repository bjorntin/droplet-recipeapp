<!-- LoginSignupButtons.vue -->
<template>
  <div v-if="!auth" class="flex items-center">
    <router-link
      to="/login"
      class="relative inline-flex items-center justify-center py-1 px-8 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white rounded-full shadow-md group"
    >
      <button class="home-button">login</button>
    </router-link>
    <div class="p-4"></div>
    <router-link
      to="/signup"
      class="relative inline-flex items-center justify-center py-1 px-10 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white rounded-full shadow-md group"
    >
      <button class="home-button">signup</button>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    auth: Boolean
  }
}
</script>
