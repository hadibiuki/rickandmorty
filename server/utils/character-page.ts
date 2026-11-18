import type { CharacterPage } from '../../app/types/rick'

export const PAGE_SIZE = 12
const UPSTREAM_PAGE_SIZE = 20

export async function characterPage(page: number, name: string, load: (page: number, name: string) => Promise<CharacterPage>): Promise<CharacterPage> {
  const offset = (page - 1) * PAGE_SIZE
  const firstPage = Math.floor(offset / UPSTREAM_PAGE_SIZE) + 1
  const first = await load(firstPage, name)
  const start = offset % UPSTREAM_PAGE_SIZE
  let results = first.results.slice(start, start + PAGE_SIZE)
  if (results.length < PAGE_SIZE && first.info.next) {
    const next = await load(firstPage + 1, name)
    results = results.concat(next.results.slice(0, PAGE_SIZE - results.length))
  }
  const pages = Math.ceil(first.info.count / PAGE_SIZE)
  const localUrl = (target: number) => {
    const params = new URLSearchParams()
    if (name) params.set('name', name)
    params.set('page', String(target))
    return `/api/rick/character?${params}`
  }
  return {
    info: {
      count: first.info.count,
      pages,
      next: page < pages ? localUrl(page + 1) : null,
      prev: page > 1 ? localUrl(page - 1) : null
    },
    results
  }
}
