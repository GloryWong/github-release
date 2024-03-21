<script setup lang="ts">
const { appVersion } = useAppConfig()
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl flex gap-1 items-center">
      Github Release
      <UBadge color="white" :label="appVersion" />
    </h1>
    <p class="text-gray-500">
      Check the release(s) of a Github project
    </p>
  </div>
</template>

<style scoped>

</style>
