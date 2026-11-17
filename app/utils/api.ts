import type { Episode, Location } from '~/types/rick'

const base = 'https://rickandmortyapi.com/api'

export function characterUrl(name: string, page: number) {
  const params = new URLSearchParams({ page: String(page) })
  if (name) params.set('name', name)
  return `${base}/character?${params}`
}

export const characterByIdUrl = (id: number) => `${base}/character/${id}`

export function idsFromUrls(urls: string[]) {
  return urls.map(url => Number(url.split('/').at(-1))).filter(Number.isInteger)
}

export async function getEpisodes(urls: string[]): Promise<Episode[]> {
  const ids = idsFromUrls(urls)
  if (!ids.length) return []
  const result = await $fetch<Episode | Episode[]>(`${base}/episode/${ids.join(',')}`)
  return Array.isArray(result) ? result : [result]
}

export async function getLocation(url: string): Promise<Location | null> {
  if (!url || !url.startsWith(`${base}/location/`)) return null
  try { return await $fetch<Location>(url) } catch { return null }
}

