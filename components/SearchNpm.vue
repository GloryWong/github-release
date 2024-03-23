<script setup lang="ts">
const emit = defineEmits(['keyupEnter'])
const modelValue = defineModel<string>()
const { loading, error } = storeToRefs(useNpmStore())
const { searchNpm } = useNpmStore()
const toast = useToast()

watch(error, (err) => {
  if (err)
    toast.add({ icon: 'i-heroicons-exclamation-circle-16-solid', color: 'red', title: 'Error', description: err.message })
})

const selected = ref()
watch(selected, (v) => {
  modelValue.value = v?.ownerRepo
})
</script>

<template>
  <UInputMenu
    v-model="selected" :search="searchNpm" :loading="loading" autofocus placeholder="Search for a npm package"
    size="xl" leading-icon="i-heroicons-magnifying-glass-solid" :debounce="500" option-attribute="name"
    class="w-[400px]" :ui-menu="{
      option: {
        container: 'flex flex-col w-full gap-0.5',
      },
    }" @keyup.enter="() => emit('keyupEnter')"
  >
    <template #option="{ option: item }">
      <div class="w-full flex">
        <span class="min-w-0 flex-grow truncate">{{ item.name }}</span>
        <span class="text-nowrap">{{ item.version }}</span>
      </div>
      <span class="w-full text-nowrap truncate text-sm text-gray-500">{{ item.description }}</span>
    </template>
    <template #option-empty="{ query }">
      <q>{{ query }}</q> not found
    </template>
    <template #empty>
      No more
    </template>
  </UInputMenu>
</template>

<style scoped>

</style>
