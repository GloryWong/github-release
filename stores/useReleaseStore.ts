import type { NuxtError } from '#app'
import type { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import type { Octokit } from 'octokit'

export type Release = GetResponseTypeFromEndpointMethod<Octokit['rest']['repos']['getRelease']>['data']

export const useReleaseStore = defineStore('release', () => {
  const owner = ref('')
  const repo = ref('')
  const tagName = ref<string | undefined>()

  const release = ref<Release | undefined | null>()
  const loading = ref(false)
  const error = ref<NuxtError<unknown> | null>(null)
  const notFounds = ref(new Set<string>())
  const { $octokit } = useNuxtApp()

  const fetchRelease = async () => {
    error.value = null
    loading.value = true

    const _owner = owner.value
    const _repo = repo.value
    const _tagName = tagName.value

    try {
      if (notFounds.value.has(compositeReleaseKey(_owner, _repo, _tagName))) {
        release.value = null
        return
      }

      const item = await getStorageRelease(_owner, _repo, _tagName)
      if (item) {
        release.value = item
        return
      }

      let data: Release
      if (_tagName) {
        const result = await $octokit.rest.repos.getReleaseByTag({
          owner: _owner,
          repo: _repo,
          tag: _tagName,
        })
        data = result.data
      }
      else {
        const result = await $octokit.rest.repos.getLatestRelease({
          owner: _owner,
          repo: _repo,
        })
        data = result.data
      }

      release.value = data
      setStorageRelease(_owner, _repo, data, _tagName)
    }
    catch (err: any) {
      if (err?.status === 404) {
        release.value = null
        notFounds.value.add(compositeReleaseKey(_owner, _repo, _tagName))
      }
      else { error.value = err }
    }
    finally {
      loading.value = false
    }
  }

  return {
    fetchRelease,
    owner,
    repo,
    tagName,
    release,
    loading,
    error,
  }
})
