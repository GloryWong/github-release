export function compositeReleaseKey(owner: string, repo: string, tagName = 'latest') {
  if (!tagName)
    throw createError('TagName cannot be empty')

  return `${compositeOwnerRepo(owner, repo)}@${tagName}`
}
