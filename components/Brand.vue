<script setup lang="ts">
const { appVersion } = useAppConfig()
</script>

<template>
  <div class="flex flex-col sm:gap-4 items-center">
    <div class="flex gap-1 items-center w-full justify-center">
      <span class="w-7 h-7 sm:w-10 sm:h-10 flex items-center">
        <img src="/logo.svg" />
      </span>
      <span class="text-2xl sm:text-3xl flex gap-2 justify-center items-center">
        <h1 class="flex-grow truncate">Github Repo Release</h1>
        <UBadge color="white" :label="appVersion" />
      </span>
    </div>
    <p class="text-gray-500 text-sm sm:text-base">
      Check the latest release of a Github Repository
    </p>
  </div>
</template>

<style scoped>

</style>
