<script setup lang="ts">
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'

const props = defineProps<{
  release: Release
}>()

const content = computed(() => {
  if (!props.release.body)
    return

  const htmlString = micromark(props.release.body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  })

  return parseHtmlAndBlankAnchor(htmlString)
})

const container = ref()
onMounted(() => {
  watch(content, (val) => {
    if (!val)
      return

    container.value.appendChild(val)
  }, { immediate: true })
})
</script>

<template>
  <div ref="container" data-tailwind="false">
  </div>
</template>

<style scoped>

</style>
