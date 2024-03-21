<script setup lang="ts">
const { appVersion } = useAppConfig()
</script>

<template>
  <div class="flex flex-col sm:gap4 items-center">
    <span class="text-2xl sm:text-3xl flex gap-2 justify-center items-center w-full">
      <h1 class="truncate">Github Repo Release</h1>
      <UBadge color="white" :label="appVersion" />
    </span>
    <p class="text-gray-500 text-sm sm:text-base">
      Check the latest release of a Github Repository
    </p>
  </div>
</template>

<style scoped>

</style>
