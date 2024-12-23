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
          <ClientOnly>
            <Search />
            <template #fallback>
              <div class="flex justify-center">
                <div class="flex justify-center gap-2 max-w-full">
                  <USkeleton class="w-[44px] h-11 shrink-0" />
                  <USkeleton class="w-[400px] h-11" />
                  <USkeleton class="w-[84px] h-11 shrink-0" />
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
        <ClientOnly>
          <TransitionSlide :offset="[0, '100%']" easing="ease-in-out" :duration="1000">
            <div v-if="!initial">
              <Suspense>
                <LazyContent v-if="!initial" />
                <template #fallback>
                  <div class="w-full h-96 flex justify-center items-center">
                    <UIcon name="i-mdi-dots-circle" size="2em" class="animate-spin text-gray-500" />
                  </div>
                </template>
              </Suspense>
            </div>
          </TransitionSlide>
        </ClientOnly>
      </div>
    </UContainer>
    <div v-if="initial" class="fixed bottom-0 left-0 w-full">
      <UContainer>
        <Footer />
      </UContainer>
    </div>
    <UNotifications />
  </div>
</template>
