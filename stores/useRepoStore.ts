import type { Octokit } from 'octokit'
import type { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import type { NuxtError } from '#app'

export type SearchRepoResultItems = GetResponseTypeFromEndpointMethod<Octokit['rest']['search']['repos']>['data']['items']

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
      return resultItems.value.get(q)!.map(v => v.full_name)
    }

    try {
      const { data } = await octokit.rest.search.repos({
        q,
        per_page: 7,
      })

      resultItems.value.set(q, data.items)
      return data.items.map(v => v.full_name)
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
