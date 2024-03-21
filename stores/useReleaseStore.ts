import { Octokit } from 'octokit'
import type { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import type { NuxtError } from '#app'

export type Release = GetResponseTypeFromEndpointMethod<Octokit['rest']['repos']['getRelease']>['data']

export const useReleaseStore = defineStore('release', () => {
  const owner = useState('owner', () => '')
  const repo = useState('repo', () => '')
  const releases = useState('releases', () => new Map<string, Release>())
  const release = useState<Release | null>('release', () => null)
  const loading = useState('loading', () => false)
  const error = useState<NuxtError<unknown> | null>('error', () => null)
  const octokit = new Octokit()

  const searchRelease = async () => {
    loading.value = true
    try {
      const name = compositeOwnerRepo(owner.value, repo.value)
      if (releases.value.has(name)) {
        release.value = releases.value.get(name)!
        return
      }

      const { data } = await octokit.rest.repos.getLatestRelease({
        owner: owner.value,
        repo: repo.value,
      })

      releases.value = releases.value.set(name, data)
      release.value = data
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
