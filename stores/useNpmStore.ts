import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import type { NuxtError } from '#app'

interface SearchNpmResultItem {
  package: {
    name: string
    description: string
    version: string
    links: {
      repository?: string
      [x: string]: any
    }
    [x: string]: any
  }
  highlight: string
  [x: string]: any
}
type SearchNpmResultItems = SearchNpmResultItem[]

interface NpmItem {
  name: string
  description: string
  version: string
  ownerRepo: string
}

function getOwnerRepoFromGitHubURI(gitHubURI: string) {
  const { GITHUB_URL_PREFIX } = useAppConfig()
  if (!gitHubURI.startsWith(GITHUB_URL_PREFIX))
    return

  const matches = gitHubURI.match(new RegExp(`${GITHUB_URL_PREFIX}/([^/]+)/([^/]+)`))
  if (!matches || matches.length < 3)
    return

  return `${matches[1]}/${matches[2]}`
}

function transformItems(items: SearchNpmResultItems) {
  const result: NpmItem[] = []

  items.forEach((item) => {
    const { links, name, description, version } = item.package
    if (!links.repository)
      return

    const ownerRepo = getOwnerRepoFromGitHubURI(links.repository)
    if (!ownerRepo)
      return

    result.push({
      name,
      description,
      version,
      ownerRepo,
    })
  })

  return result
}

export const useNpmStore = defineStore('npm', () => {
  const loading = ref(false)
  const error = ref<NuxtError<unknown> | null>(null)

  const _searchNpm = pMemoize(async (q: string) => {
    const data = await $fetch<SearchNpmResultItems | {
      code: string
      message: string
    }>('https://api.npms.io/v2/search/suggestions', {
      query: {
        q,
        size: 10,
      },
    })

    if (!Array.isArray(data)) {
      throw createError({
        statusCode: 500,
        statusMessage: data.message,
      })
    }

    return transformItems(data)
  }, {
    cache: new ExpiryMap(60 * 60 * 1000) as any,
  })

  const searchNpm = async (query: string) => {
    error.value = null
    const q = query.trim()

    loading.value = true

    if (!q) {
      loading.value = false
      return []
    }

    try {
      const result = await _searchNpm(q)
      loading.value = false
      return result
    }
    catch (err: any) {
      error.value = err
      loading.value = false
      return []
    }
  }

  return {
    searchNpm,
    loading,
    error,
  }
})
