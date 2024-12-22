// To stabilize access to the npm server, which can be sporadically obstructed by the god damn GFW,
// configure an HTTPS proxy within the local development environment.
const defaultOptions: Record<string, any> = {}
if (process.env.NODE_ENV === 'development') {
  import('undici').then(({ ProxyAgent }) => {
    defaultOptions.dispatcher = new ProxyAgent('http://127.0.0.1:51837')
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

function getOwnerRepoFromGitHubURI(gitHubURI: string) {
  const { GITHUB_URL_PREFIX } = useAppConfig()
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
      ...defaultOptions,
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
