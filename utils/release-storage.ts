import localforage from 'localforage'

function createStorage(tableName: string, description: string) {
  return localforage.createInstance({
    name: 'ghrelease',
    description,
    storeName: tableName,
  })
}

let releaseTable: LocalForage
let lastestReleaseExpirationTable: LocalForage

export function getReleaseTable() {
  if (releaseTable)
    return releaseTable

  return releaseTable = createStorage('release', 'repository releases')
}

export function getLastestReleaseExpirationTable() {
  if (lastestReleaseExpirationTable)
    return lastestReleaseExpirationTable

  return lastestReleaseExpirationTable = createStorage('latestReleaseExpiration', 'repository latest release expirations')
}

export function addLatestReleaseExpiration(ownerRepo: string) {
  const table = getLastestReleaseExpirationTable()
  return table.setItem(ownerRepo, new Date().getTime() + (LATEST_RELEASE_ITEM_MAX_LIVE * 3600000))
}

export async function isLatestReleaseExpired(ownerRepo: string) {
  const table = getLastestReleaseExpirationTable()
  const item = await table.getItem<number>(ownerRepo)
  if (!item)
    return true

  return new Date().getTime() > item
}

export async function getStorageRelease(owner: string, repo: string, tagName?: string) {
  try {
    const releaseTable = getReleaseTable()
    const expirationTable = getLastestReleaseExpirationTable()
    const key = compositeReleaseKey(owner, repo, tagName)

    if (!tagName && await isLatestReleaseExpired(compositeOwnerRepo(owner, repo))) {
      await releaseTable.removeItem(key)
      await expirationTable.removeItem(key)
      return null
    }
    return releaseTable.getItem<Release>(key)
  }
  catch (error) {
    console.error('getStorageRelease: %o', error)
  }

  return null
}

export async function setStorageRelease(owner: string, repo: string, release: Release, tagName?: string) {
  try {
    const releaseTable = getReleaseTable()
    const key = compositeReleaseKey(owner, repo, tagName)
    releaseTable.setItem(key, release)
    if (!tagName)
      addLatestReleaseExpiration(compositeOwnerRepo(owner, repo))
  }
  catch (error) {
    console.error('setStorageRelease: %o', error)
  }
}
