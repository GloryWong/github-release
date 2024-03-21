<script setup lang="ts">
const { release, loading } = storeToRefs(useReleaseStore())
</script>

<template>
  <div class="relative">
    <TransitionFade mode="out-in">
      <UCard v-if="release">
        <template #header>
          <ResultHeader :release="release" />
        </template>
        <ResultBody :release="release" />
      </UCard>
      <UCard v-else>
        <div class="flex justify-center items-center text-gray-300 dark:text-gray-700 min-h-[150px]">
          Repository latest release will be listed here
        </div>
      </UCard>
    </TransitionFade>
    <TransitionFade>
      <div
        v-if="loading"
        class="absolute top-0 bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 flex justify-center"
      >
        <Icon name="svg-spinners:90-ring-with-bg" size="2rem" color="gray" class="mt-12" />
      </div>
    </TransitionFade>
  </div>
</template>

<style scoped>

</style>
