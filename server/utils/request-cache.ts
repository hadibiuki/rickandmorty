export function createRequestCache<T>(load: (key: string) => Promise<T>, maxEntries = 200) {
  const entries = new Map<string, { expires: number; value: Promise<T> }>()

  return (key: string): Promise<T> => {
    const now = Date.now()
    for (const [cachedKey, entry] of entries) {
      if (entry.expires <= now) entries.delete(cachedKey)
    }

    const cached = entries.get(key)
    if (cached) {
      entries.delete(key)
      entries.set(key, cached)
      return cached.value
    }

    const value = Promise.resolve().then(() => load(key))
    const entry = { expires: now + 3_600_000, value }
    entries.set(key, entry)
    while (entries.size > maxEntries) entries.delete(entries.keys().next().value!)

    void value.catch(() => {
      // Share concurrent failures briefly without keeping them for an hour.
      if (entries.get(key) === entry) entry.expires = Date.now() + 60_000
    })
    return value
  }
}
