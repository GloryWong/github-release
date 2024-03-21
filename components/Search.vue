<script setup lang="ts">
const { repo, owner, loading, error } = storeToRefs(useReleaseStore())
const { fetchRelease: _fetchRelease } = useReleaseStore()
const toast = useToast()

const selected = ref('')

const fetchRelease = useDebounceFn(() => {
  if (!selected.value)
    return

  try {
    const [o, r] = splitOwnerRepo(selected.value)
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
</script>

<template>
  <div class="flex justify-center gap-2">
    <UInputMenu
      v-model="selected" :search="searchRepo" :loading="searchLoading" autofocus
      placeholder="Search for a repository" size="xl" leading-icon="i-heroicons-magnifying-glass-solid"
      :debounce="500"
      @keyup.enter="fetchRelease"
    >
      <template #option-empty="{ query }">
        <q>{{ query }}</q> not found
      </template>
      <template #empty>
        No more
      </template>
    </UInputMenu>
    <UButton
      icon="i-heroicons-magnifying-glass-solid" label="Search" :loading="loading" :disabled="!selected"
      @click="fetchRelease"
    />
  </div>
</template>

<style scoped>

</style>
