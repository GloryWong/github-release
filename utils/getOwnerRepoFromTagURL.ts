export function getOwnerRepoFromGitHubURI(gitHubURI: string) {
  const { GITHUB_URL_PREFIX } = useAppConfig()
  if (!gitHubURI.startsWith(GITHUB_URL_PREFIX)) {
    throw createError({
      message: 'Invalid gitHubURI',
      statusCode: 400,
    })
  }

  const matches = gitHubURI.match(new RegExp(`${GITHUB_URL_PREFIX}/([^/]+)/([^/]+)`))
  if (!matches || matches.length < 3) {
    throw createError({
      message: 'Invalid gitHubURI',
      statusCode: 400,
    })
  }

  return [matches[1], matches[2]]
}
