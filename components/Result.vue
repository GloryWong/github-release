<script setup lang="ts">
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'

const { release, loading } = storeToRefs(useReleaseStore())

const contentHtml = computed(() => {
  if (!release.value)
    return 'none'

  return micromark(release.value.body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  })
})

const ownerRepo = computed(() => {
  if (!release.value)
    return
  const [owner, repo] = getOwnerAndRepoFromTagURL(release.value.html_url)
  return {
    owner,
    repo,
  }
})
</script>

<template>
  <div class="relative">
    <TransitionFade mode="out-in">
      <div v-if="release">
        <UCard>
          <template #header>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <UButton
                  variant="link" color="black" size="xl" class="p-0"
                  :to="`${GITHUB_URL_PREFIX}/${ownerRepo?.owner}`" target="_blank"
                >
                  {{ ownerRepo?.owner }}
                </UButton>
                /
                <UButton
                  variant="link" color="black" size="xl" class="p-0"
                  :to="`${GITHUB_URL_PREFIX}/${compositeProjectName(ownerRepo?.owner ?? '', ownerRepo?.repo ?? '')}`"
                  target="_blank"
                >
                  {{ ownerRepo?.repo }}
                </UButton>
              </div>
              <div>
                <UButton :to="release.html_url" target="_blank" variant="link" class="p-0">
                  <h1 class="text-3xl">
                    {{ release.tag_name }}
                  </h1>
                </UButton>
              </div>
              <div class="mt-4">
                <div class="flex items-center gap-1">
                  <UAvatar :src="release.author.avatar_url" />
                  <UButton color="gray" variant="link" :to="release.author.html_url" target="_blank">
                    {{ release.author.login }}
                  </UButton>
                  <div class="text-gray-500">
                    released this at {{ new Date(release.published_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }) }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div data-tailwind="false" v-html="contentHtml"></div>
        </UCard>
      </div>
      <UCard v-else>
        <div class="flex justify-center text-gray-300 dark:text-gray-700">
          search a repository
        </div>
      </UCard>
    </TransitionFade>
    <TransitionFade>
      <div v-if="loading" class="absolute top-0 bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 flex justify-center">
        <Icon name="svg-spinners:90-ring-with-bg" size="4rem" color="gray" class="mt-12" />
      </div>
    </TransitionFade>
  </div>
</template>

<style scoped>

</style>
