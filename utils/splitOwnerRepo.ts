export function splitOwnerRepo(name: string) {
  if (!name.includes('/')) {
    throw createError({
      message: 'Invalid owner repo name',
      statusCode: 400,
    })
  }

  const [owner, repo] = name.split('/')
  if (!owner || !repo) {
    throw createError({
      message: 'Invalid owner repo name',
      statusCode: 400,
    })
  }
  return [owner, repo] as [owner: string, repo: string]
}
