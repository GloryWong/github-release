import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import type { NuxtError } from '#app'

export const useNpmStore = defineStore('npm', () => {
  const loading = useState('npmSearchLoading', () => false)
  const error = useState<NuxtError<unknown> | null>('npmSearchError', () => null)

  const _searchNpm = pMemoize((q: string) => $fetch('/api/npm-search', {
    query: {
      q,
    },
  }), {
    cache: new ExpiryMap(60 * 60 * 1000) as any,
  })

  const searchNpm = async (query: string) => {
    error.value = null
    const q = query.trim()

    if (!q)
      return []

    loading.value = true

    try {
      return _searchNpm(q)
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    searchNpm,
    loading,
    error,
  }
})
