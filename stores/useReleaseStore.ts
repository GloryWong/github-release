import { Octokit } from 'octokit'
import type { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import type { NuxtError } from '#app'

export type Release = GetResponseTypeFromEndpointMethod<Octokit['rest']['repos']['getRelease']>['data']

export const useReleaseStore = defineStore('release', () => {
  const owner = useState('owner', () => '')
  const repo = useState('repo', () => '')
  const tagName = useState<string | undefined>('tagName')

  const release = useState<Release | null>('release', () => null)
  const loading = useState('loading', () => false)
  const error = useState<NuxtError<unknown> | null>('error', () => null)
  const octokit = new Octokit()

  const searchRelease = async () => {
    loading.value = true
    try {
      const _owner = owner.value
      const _repo = repo.value
      const _tagName = tagName.value

      const item = await getStorageRelease(_owner, _repo, _tagName)
      if (item) {
        release.value = item
        return
      }

      let data: Release
      if (_tagName) {
        const result = await octokit.rest.repos.getReleaseByTag({
          owner: _owner,
          repo: _repo,
          tag: _tagName,
        })
        data = result.data
      }
      else {
        const result = await octokit.rest.repos.getLatestRelease({
          owner: _owner,
          repo: _repo,
        })
        data = result.data
      }

      release.value = data
      setStorageRelease(_owner, _repo, data, _tagName)
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    searchRelease,
    owner,
    repo,
    release,
    loading,
    error,
  }
})
