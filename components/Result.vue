<script setup lang="ts">
const { release, loading, owner, repo, tagName } = storeToRefs(useReleaseStore())

useHead({
  title: computed(() => compositeReleaseKey(owner.value, repo.value, tagName.value)),
})
</script>

<template>
  <div class="relative">
    <TransitionFade mode="out-in">
      <UCard v-if="release" :ui="{ base: 'overflow-hidden', body: { padding: 'p-0 sm:p-0' } }">
        <template #header>
          <ResultHeader :release="release" />
        </template>
        <ResultBody :release="release" />
      </UCard>
      <UCard v-else>
        <div class="flex justify-center items-center text-gray-400 dark:text-gray-600 min-h-[150px]">
          {{ `404: No release for ${owner}/${repo}${tagName ? `@${tagName}` : ''}` }}
        </div>
      </UCard>
    </TransitionFade>
    <TransitionFade>
      <div
        v-if="loading"
        class="absolute top-0 bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/80 flex justify-center"
      >
        <Icon name="i-mdi-dots-circle" size="2rem" color="gray" class="mt-12 animate-spin" />
      </div>
    </TransitionFade>
  </div>
</template>

<style scoped>

</style>
