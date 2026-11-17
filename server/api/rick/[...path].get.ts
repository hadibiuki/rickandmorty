const responses = new Map<string, { expires: number; value: Promise<unknown> }>()

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  if (!/^(character|episode|location)(\/\d+(,\d+)*)?$/.test(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown API resource' })
  }
  const query = getQuery(event)
  const params = new URLSearchParams()
  for (const key of ['name', 'page']) {
    if (typeof query[key] === 'string') params.set(key, query[key])
  }
  const key = `${path}?${params}`
  const cached = responses.get(key)
  if (cached && cached.expires > Date.now()) return cached.value

  // Store the promise immediately so simultaneous requests share one upstream call.
  const value = $fetch(`https://rickandmortyapi.com/api/${key}`, { retry: 0 })
  const entry = { expires: Date.now() + 3_600_000, value }
  responses.set(key, entry)
  try {
    return await value
  } catch (error) {
    // Briefly reuse failures too, preventing rate-limit retry storms.
    entry.expires = Date.now() + 60_000
    throw error
  } finally {
    for (const [cachedKey, item] of responses) {
      if (item.expires <= Date.now()) responses.delete(cachedKey)
    }
  }
})
