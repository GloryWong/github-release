import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import type { Octokit } from 'octokit'
import type { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import type { NuxtError } from '#app'

export type SearchRepoResultItems = GetResponseTypeFromEndpointMethod<Octokit['rest']['search']['repos']>['data']['items']

function transformItems(items: SearchRepoResultItems) {
  return items.map(item => ({
    fullName: item.full_name,
    icon: 'i-heroicons-user-circle',
    avatar: item.owner?.avatar_url,
  }))
}

export type RepoItem = ReturnType<typeof transformItems>[0]

export const useRepoStore = defineStore('repo', () => {
  const loading = ref(false)
  const error = ref<NuxtError<unknown> | null>(null)
  const { octokit } = useOctokitStore()

  const _searchRepo = pMemoize(async (q: string) => {
    const { data } = await octokit.rest.search.repos({
      q,
      per_page: 10,
      sort: 'stars',
      order: 'desc',
    })

    return transformItems(data.items)
  }, {
    cache: new ExpiryMap(60 * 60 * 1000) as any,
  })

  const searchRepo = async (query: string) => {
    error.value = null
    loading.value = true
    const q = query.trim()

    if (!q) {
      loading.value = false
      return []
    }

    try {
      const result = await _searchRepo(q)
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
    searchRepo,
    loading,
    error,
  }
})
