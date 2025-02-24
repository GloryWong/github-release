<script setup lang="ts">
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeStringify from 'rehype-stringify'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import 'github-markdown-css'
import 'remark-github-blockquote-alert/alert.css'

const props = defineProps<{
  release: Release
}>()

const evaluating = ref(false)
const content = computedAsync(async () => {
  if (!props.release.body)
    return null

  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkGithub, { repository: compositeOwnerRepo(...getOwnerRepoFromGitHubURI(props.release.html_url)) })
      .use(remarkBreaks)
      .use(remarkAlert)
      .use(remarkRehype)
      .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer', 'nofollow'] })
      .use(rehypeStarryNight)
      .use(rehypeStringify)
      .process(props.release.body)

    return String(result)
  }
  catch (error) {
    return error
  }
}, null, evaluating)
</script>

<template>
  <div>
    <div v-if="evaluating" class="flex flex-col gap-4 px-4 py-5 sm:px-6">
      <USkeleton class="w-1/3 h-8" />
      <USkeleton class="w-1/2 h-8" />
      <USkeleton class="w-full h-8" />
      <USkeleton class="w-3/4 h-8" />
      <USkeleton class="w-3/5 h-8" />
    </div>
    <article v-else data-tailwind="false" class="markdown-body box-border px-4 py-5 sm:px-6" v-html="content">
    </article>
  </div>
</template>

<style scoped>

</style>
