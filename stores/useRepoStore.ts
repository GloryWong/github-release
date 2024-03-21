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
  const resultItems = useState('repoSearchResults', () => new Map<string, SearchRepoResultItems>())

  const searchRepo = async (query: string) => {
    error.value = null
    loading.value = true
    const q = query.trim()

    if (!q) {
      loading.value = false
      return []
    }

    if (resultItems.value.has(q)) {
      loading.value = false
      return transformItems(resultItems.value.get(q)!)
    }

    try {
      const { data } = await octokit.rest.search.repos({
        q,
        per_page: 7,
      })

      resultItems.value.set(q, data.items)
      return transformItems(data.items)
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
