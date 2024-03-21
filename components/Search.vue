<script setup lang="ts">
const { repo, owner, loading, error } = storeToRefs(useReleaseStore())
const { searchRelease } = useReleaseStore()
const toast = useToast()

const text = ref('')

const search = useDebounceFn(() => {
  if (!text.value)
    return

  try {
    const [o, r] = splitProjectName(text.value)
    owner.value = o
    repo.value = r
    searchRelease()
  }
  catch (error) {
    toast.add({ color: 'red', title: 'Error', description: JSON.stringify(error) })
  }
}, 200)

whenever(error, (err) => {
  toast.add({ color: 'red', title: 'Error', description: err.message })
})
</script>

<template>
  <div class="flex justify-center gap-2">
    <UInput v-model.trim="text" size="xl" placeholder="owner/repo" @keyup.enter="search" />
    <UButton
      icon="i-heroicons-magnifying-glass-solid" label="Search" :loading="loading" :disabled="!text"
      @click="search"
    />
  </div>
</template>

<style scoped>

</style>
