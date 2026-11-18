import type { CharacterPage } from '../../../app/types/rick'
import { characterPage } from '../../utils/character-page'
import { createRequestCache } from '../../utils/request-cache'

const upstream = () => useRuntimeConfig().public.apiBase.replace(/\/$/, '')

const cachedRequest = createRequestCache((key: string) => $fetch(`${upstream()}/${key}`, { retry: 0 }))

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  if (!/^(character|episode|location)(\/\d+(,\d+)*)?$/.test(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown API resource' })
  }
  const query = getQuery(event)
  if (path === 'character') {
    const page = Number(query.page || 1)
    if (!Number.isSafeInteger(page) || page < 1) throw createError({ statusCode: 400, statusMessage: 'Invalid page' })
    const name = typeof query.name === 'string' ? query.name : ''
    return await characterPage(page, name, async (target, search) => {
      const upstreamParams = new URLSearchParams()
      if (search) upstreamParams.set('name', search)
      upstreamParams.set('page', String(target))
      return await cachedRequest(`character?${upstreamParams}`) as CharacterPage
    })
  }
  const params = new URLSearchParams()
  for (const key of ['name', 'page']) {
    if (typeof query[key] === 'string') params.set(key, query[key])
  }
  return await cachedRequest(`${path}?${params}`)
})
