<script setup lang="ts">
const props = defineProps<{
  release: Release
}>()

const { GITHUB_URL_PREFIX } = useAppConfig()

const ownerRepo = computed(() => {
  const [owner, repo] = getOwnerRepoFromGitHubURI(props.release.html_url)
  return {
    owner,
    repo,
  }
})

const date = computed(() => props.release?.published_at ? new Date(props.release.published_at) : '')
const releaseTime = computed(() => date.value
  ? date.value.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  : '')
const releaseTimeAgo = useTimeAgo(date)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1">
      <UTooltip text="Owner" :popper="{ arrow: true }">
        <UButton
          variant="link" color="black" size="xl" class="p-0" :to="`${GITHUB_URL_PREFIX}/${ownerRepo.owner}`"
          target="_blank"
        >
          {{ ownerRepo.owner }}
        </UButton>
      </UTooltip>
      /
      <UTooltip text="Repository" :popper="{ arrow: true }">
        <UButton
          variant="link" color="black" size="xl" class="p-0"
          :to="`${GITHUB_URL_PREFIX}/${compositeOwnerRepo(ownerRepo.owner, ownerRepo.repo)}`" target="_blank"
        >
          {{ ownerRepo.repo }}
        </UButton>
      </UTooltip>
    </div>
    <div>
      <UTooltip text="Tag name" :popper="{ arrow: true }">
        <UButton :to="release.html_url" target="_blank" variant="link" class="p-0">
          <h1 class="text-3xl">
            {{ release.tag_name }}
          </h1>
        </UButton>
      </UTooltip>
    </div>
    <div class="mt-4">
      <div class="flex items-center gap-1 flex-col sm:flex-row">
        <div class="flex items-center w-full sm:w-auto">
          <UAvatar :src="release.author.avatar_url" />
          <UButton color="gray" variant="link" :to="release.author.html_url" target="_blank">
            {{ release.author.login }}
          </UButton>
          <div class="text-gray-500 text-sm">
            released this on
          </div>
        </div>
        <div class="text-gray-500 text-sm w-full sm:w-auto">
          {{ releaseTime }} ({{ releaseTimeAgo }})
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
