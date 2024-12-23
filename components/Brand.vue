<script setup lang="ts">
const { appVersion } = useAppConfig()
</script>

<template>
  <div class="flex flex-col sm:gap-4 items-center">
    <div class="flex gap-1 items-center w-full justify-center">
      <img src="/logo.svg" alt="Logo" class="size-7 sm:size-10" />
      <span class="text-2xl sm:text-3xl flex gap-2 justify-center items-center">
        <h1 class="flex-grow truncate">GitHub Repo Release</h1>
        <UButton
          color="white" :label="appVersion"
          size="sm"
          :to="`https://github.com/GloryWong/github-release/releases/tag/v${appVersion}`" target="_blank"
        />
      </span>
    </div>
    <p class="text-gray-500 text-sm sm:text-base">
      Check the latest release of a Github Repository
    </p>
  </div>
</template>

<style scoped>

</style>
