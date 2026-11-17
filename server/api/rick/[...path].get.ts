import type { CharacterPage } from '../../../app/types/rick'

const responses = new Map<string, { expires: number; value: Promise<unknown> }>()

const upstream = () => useRuntimeConfig().public.apiBase.replace(/\/$/, '')

async function cachedRequest(key: string) {
  const cached = responses.get(key)
  if (cached && cached.expires > Date.now()) return cached.value
  const value = $fetch(`${upstream()}/${key}`, { retry: 0 })
  const entry = { expires: Date.now() + 3_600_000, value }
  responses.set(key, entry)
  try { return await value } catch (error) {
    entry.expires = Date.now() + 60_000
    throw error
  }
}

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  if (!/^(character|episode|location)(\/\d+(,\d+)*)?$/.test(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown API resource' })
  }
  const query = getQuery(event)
  if (path === 'character') {
    const page = Number(query.page || 1)
    if (!Number.isSafeInteger(page) || page < 1) throw createError({ statusCode: 400, statusMessage: 'Invalid page' })
    const offset = (page - 1) * 12
    const firstPage = Math.floor(offset / 20) + 1
    const params = new URLSearchParams()
    if (typeof query.name === 'string' && query.name) params.set('name', query.name)
    const loadPage = async (target: number) => {
      const upstreamParams = new URLSearchParams(params)
      upstreamParams.set('page', String(target))
      return await cachedRequest(`character?${upstreamParams}`) as CharacterPage
    }
    const first = await loadPage(firstPage)
    const start = offset % 20
    let results = first.results.slice(start, start + 12)
    if (results.length < 12 && first.info.next) {
      const next = await loadPage(firstPage + 1)
      results = results.concat(next.results.slice(0, 12 - results.length))
    }
    const pages = Math.ceil(first.info.count / 12)
    const localUrl = (target: number) => {
      const localParams = new URLSearchParams(params)
      localParams.set('page', String(target))
      return `/api/rick/character?${localParams}`
    }
    return { info: { count: first.info.count, pages, next: page < pages ? localUrl(page + 1) : null, prev: page > 1 ? localUrl(page - 1) : null }, results }
  }
  const params = new URLSearchParams()
  for (const key of ['name', 'page']) {
    if (typeof query[key] === 'string') params.set(key, query[key])
  }
  const key = `${path}?${params}`
  const cached = responses.get(key)
  if (cached && cached.expires > Date.now()) return cached.value

  // Store the promise immediately so simultaneous requests share one upstream call.
  const value = $fetch(`${upstream()}/${key}`, { retry: 0 })
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
