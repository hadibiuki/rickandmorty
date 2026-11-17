import type { Episode, Location } from '~/types/rick'

const base = '/api/rick'
const upstream = 'https://rickandmortyapi.com/api'

export function characterUrl(name: string, page: number) {
  const params = new URLSearchParams({ page: String(page) })
  if (name) params.set('name', name)
  return `${base}/character?${params}`
}

export const characterByIdUrl = (id: number) => `${base}/character/${id}`

export function idsFromUrls(urls: string[]) {
  return urls.map(url => {
    const id = Number(url.split('/').at(-1))
    return Number.isSafeInteger(id) && id > 0 ? id : null
  }).filter((id): id is number => id !== null)
}

export async function getEpisodes(urls: string[]): Promise<Episode[]> {
  const ids = [...new Set(idsFromUrls(urls))]
  if (!ids.length) return []
  const result = await $fetch<Episode | Episode[]>(`${base}/episode/${ids.join(',')}`, { retry: 0 })
  return Array.isArray(result) ? result : [result]
}

export async function getLocation(url: string): Promise<Location | null> {
  if (!url || !url.startsWith(`${upstream}/location/`)) return null
  return await $fetch<Location>(url.replace(upstream, base), { retry: 0 })
}

