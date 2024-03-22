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
      <div>
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
            <Result v-if="!initial" />
          </TransitionSlide>
        </div>
      </div>
    </UContainer>
    <UNotifications />
  </div>
</template>
