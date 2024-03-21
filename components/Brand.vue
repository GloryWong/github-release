<script setup lang="ts">
const { appVersion } = useAppConfig()
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl flex gap-2 items-center">
      Github Repo Release
      <UBadge color="white" :label="appVersion" />
    </h1>
    <p class="text-gray-500">
      Check the release(s) of a Github Repository
    </p>
  </div>
</template>

<style scoped>

</style>
