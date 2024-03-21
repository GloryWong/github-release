export function getOwnerRepoFromTagURL(tagURL: string) {
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
