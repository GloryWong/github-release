import https from 'node:https'

// In local development, set https proxy to get access to npm api
// Fuck GFW!!!
if (process.env.NODE_ENV === 'development') {
  import('https-proxy-agent').then(({ HttpsProxyAgent }) => {
    https.globalAgent = new HttpsProxyAgent('http://127.0.0.1:51837')
  })
}

interface SearchNpmResultItem {
  name: string
  description: string
  version: string
  links: {
    repository?: string
    [x: string]: any
  }
  [x: string]: any
}
type SearchNpmResultItems = SearchNpmResultItem[]

interface NpmItem {
  name: string
  description: string
  version: string
  ownerRepo: string
}

const GITHUB_URL_PREFIX = 'https://github.com' as const

function getOwnerRepoFromGitHubURI(gitHubURI: string) {
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
    const { links, name, description, version } = item
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

export default defineCachedEventHandler(async (event) => {
  let query = getQuery(event).q
  if (!query || typeof query !== 'string')
    return []

  query = query.trim()

  try {
    const data = await $fetch<SearchNpmResultItems>('https://www.npmjs.com/search/suggestions', {
      query: {
        q: query,
      },
    })
    return transformItems(data)
  }
  catch (error) {
    console.error(error)
    return []
  }
})
