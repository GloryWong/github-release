<script setup lang="ts">
const { repo, owner, loading, error } = storeToRefs(useReleaseStore())
const { fetchRelease: _fetchRelease } = useReleaseStore()
const toast = useToast()

const ownerRepo = ref<string>()
const selected = ref<RepoItem>()
watch(() => selected.value?.fullName, (fullName) => {
  ownerRepo.value = fullName
})

const fetchRelease = useDebounceFn(() => {
  const op = ownerRepo.value
  if (!op)
    return

  try {
    const [o, r] = splitOwnerRepo(op)
    owner.value = o
    repo.value = r
    _fetchRelease()
  }
  catch (error) {
    toast.add({ icon: 'i-heroicons-exclamation-circle-16-solid', color: 'red', title: 'Error', description: JSON.stringify(error) })
  }
}, 250)

// Search for repo
const { loading: searchLoading, error: searchError } = storeToRefs(useRepoStore())
const { searchRepo } = useRepoStore()

watch([error, searchError], ([err, searchError]) => {
  if (err || searchError)
    toast.add({ icon: 'i-heroicons-exclamation-circle-16-solid', color: 'red', title: 'Error', description: err?.message || searchError?.message })
})

// Search for npm
const npmSearch = ref(true)
const selectedNpmOwnerRepo = ref<string>()
watch(selectedNpmOwnerRepo, (fullName) => {
  ownerRepo.value = fullName
})
</script>

<template>
  <div class="flex justify-center gap-2">
    <UTooltip :text="`Switch to ${npmSearch ? 'GitHub repo search' : 'Npm search'}`">
      <UButton variant="solid" size="xl" square :icon="npmSearch ? 'i-mdi-npm-variant-outline' : 'i-mdi-github'" color="gray" @click="npmSearch = !npmSearch" />
    </UTooltip>

    <SearchNpm v-if="npmSearch" v-model="selectedNpmOwnerRepo" @keyup-enter="fetchRelease" />
    <UInputMenu
      v-else v-model="selected" :search="searchRepo" :loading="searchLoading" autofocus
      placeholder="Search for a repository" size="xl" leading-icon="i-heroicons-magnifying-glass-solid" :debounce="500"
      option-attribute="fullName" class="w-[400px]" @keyup.enter="fetchRelease"
    >
      <template #leading>
        <UAvatar v-if="selected?.avatar" :src="selected.avatar" size="2xs" />
        <UIcon v-else-if="selected?.icon" :name="selected.icon" class="w-5 h-5" />
      </template>
      <template #option="{ option: item }">
        <UAvatar v-if="item?.avatar" :src="item.avatar" size="2xs" />
        <UIcon v-else :name="item.icon" class="w-5 h-5" />
        <span class="truncate">{{ item.fullName }}</span>
      </template>
      <template #option-empty="{ query }">
        <q>{{ query }}</q> not found
      </template>
      <template #empty>
        No more
      </template>
    </UInputMenu>
    <UButton
      icon="i-heroicons-arrow-down-circle" label="Fetch" :loading="loading" :disabled="!ownerRepo"
      @click="fetchRelease"
    />
  </div>
</template>

<style scoped>

</style>
