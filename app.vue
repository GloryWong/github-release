<script setup lang="ts">
const { release } = storeToRefs(useReleaseStore())
const initial = computed(() => release.value === undefined)

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - GitHub Repo Release` : 'GitHub Repo Release'
  },
})
</script>

<template>
  <div>
    <UContainer class="py-4 sm:py-8">
      <div class="flex flex-col gap-8">
        <div
          class="flex flex-col gap-6 transition ease-in-out duration-1000 z-10" :class="{
            'translate-y-[calc(50vh-100%)]': initial,
          }"
        >
          <Brand />
          <Search />
        </div>
        <TransitionSlide :offset="[0, '100%']" easing="ease-in-out" :duration="1000">
          <div v-if="!initial" class="flex flex-col gap-2">
            <Result />
            <Footer />
          </div>
        </TransitionSlide>
      </div>
    </UContainer>
    <TransitionSlide :offset="[0, '100%']">
      <div v-if="initial" class="fixed bottom-0 left-0 w-full">
        <UContainer>
          <Footer />
        </UContainer>
      </div>
    </TransitionSlide>
    <UNotifications />
  </div>
</template>
