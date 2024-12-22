<script setup lang="ts">
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import 'github-markdown-css'

const props = defineProps<{
  release: Release
}>()

const content = computed(() => {
  if (!props.release.body)
    return null

  const htmlString = micromark(props.release.body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  })

  return parseHtmlAndBlankAnchor(htmlString)
})

const container = ref()
onMounted(() => {
  watch(content, (val) => {
    container.value.innerHTML = '<div class="flex justify-center text-gray-400 dark:text-gray-600">No description</div>'
    if (val) {
      container.value.innerHTML = ''
      container.value.appendChild(val)
    }
  }, { immediate: true })
})
</script>

<template>
  <article ref="container" data-tailwind="false" class="markdown-body box-border px-4 py-5 sm:p-6 md:p-8 lg:p-11">
  </article>
</template>

<style scoped>

</style>
