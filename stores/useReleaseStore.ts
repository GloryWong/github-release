import type { NuxtError } from '#app'

export interface Release {
  url: string
  assets_url: string
  upload_url: string
  html_url: string
  id: number
  author: {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
  }
  node_id: string
  tag_name: string
  target_commitish: string
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  assets: Array<any>
  tarball_url: string
  zipball_url: string
  body: string
}

export const GITHUB_URL_PREFIX = 'https://github.com' as const

export function compositeProjectName(owner: string, repo: string) {
  if (!owner)
    throw createError('Owner cannot be empty')
  if (!repo)
    throw createError('Repo cannot be empty')

  return `${owner}/${repo}`
}

export function splitProjectName(name: string) {
  if (!name.includes('/')) {
    throw createError({
      message: 'Invalid project name',
      statusCode: 400,
    })
  }

  const [owner, repo] = name.split('/')
  if (!owner || !repo) {
    throw createError({
      message: 'Invalid project name',
      statusCode: 400,
    })
  }
  return [owner, repo]
}

export function getOwnerAndRepoFromTagURL(tagURL: string) {
  if (!tagURL.startsWith(GITHUB_URL_PREFIX)) {
    throw createError({
      message: 'Invalid tagURL',
      statusCode: 400,
    })
  }

  const matches = tagURL.match(new RegExp(`${GITHUB_URL_PREFIX}/([^/]+)/([^/]+)`))
  if (!matches || matches.length < 3) {
    throw createError({
      message: 'Invalid tagURL',
      statusCode: 400,
    })
  }

  return [matches[1], matches[2]]
}

export const useReleaseStore = defineStore('release', () => {
  const owner = useState('owner', () => '')
  const repo = useState('repo', () => '')
  const releases = useState('releases', () => new Map<string, Release>())
  const release = useState<Release | null>('release', () => null)
  const loading = useState('loading', () => false)
  const error = useState<NuxtError<unknown> | null>('error', () => null)

  const searchRelease = async () => {
    loading.value = true
    try {
      const name = compositeProjectName(owner.value, repo.value)
      if (releases.value.has(name)) {
        release.value = releases.value.get(name)!
        return
      }

      const data = await $fetch<Release>(`https://api.github.com/repos/${name}/releases/latest`)
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
