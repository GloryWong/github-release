export function compositeOwnerRepo(owner: string, repo: string) {
  if (!owner)
    throw createError('Owner cannot be empty')
  if (!repo)
    throw createError('Repo cannot be empty')

  return `${owner}/${repo}`
}
