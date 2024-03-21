<script setup lang="ts">
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'

const props = defineProps<{
  release: Release
}>()

const contentHtml = computed(() => {
  if (!props.release.body)
    return 'none'

  return micromark(props.release.body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  })
})
</script>

<template>
  <div data-tailwind="false" v-html="contentHtml"></div>
</template>

<style scoped>

</style>
