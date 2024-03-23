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
  const loading = useState('repoSearchLoading', () => false)
  const error = useState<NuxtError<unknown> | null>('repoSearchError', () => null)
  const { octokit } = useOctokitStore()

  const _searchRepo = pMemoize(async (q: string) => {
    const { data } = await octokit.rest.search.repos({
      q,
      per_page: 7,
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
      return _searchRepo(q)
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    searchRepo,
    loading,
    error,
  }
})
