import { describe, expect, it, vi } from 'vitest'
import type { CharacterPage } from '../app/types/rick'
import { characterPage } from '../server/utils/character-page'

const load = vi.fn(async (page: number, name: string): Promise<CharacterPage> => {
  const count = name ? 25 : 60
  const start = (page - 1) * 20 + 1
  return {
    info: { count, pages: Math.ceil(count / 20), next: start + 20 <= count ? 'next' : null, prev: page > 1 ? 'prev' : null },
    results: Array.from({ length: Math.min(20, count - start + 1) }, (_, index) => ({ id: start + index })) as CharacterPage['results']
  }
})

describe('character pagination', () => {
  it('returns the correct 12 characters when pages are visited out of order', async () => {
    const tenth = await characterPage(5, '', load)
    const second = await characterPage(2, '', load)
    expect(tenth.results.map(item => item.id)).toEqual([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60])
    expect(second.results.map(item => item.id)).toEqual([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
    expect(tenth.info.pages).toBe(5)
    expect(second.info.next).toBe('/api/rick/character?page=3')
  })

  it('keeps search filters and handles a partial final page', async () => {
    const result = await characterPage(3, 'Rick & Morty', load)
    expect(result.results.map(item => item.id)).toEqual([25])
    expect(result.info.next).toBeNull()
    expect(result.info.prev).toBe('/api/rick/character?name=Rick+%26+Morty&page=2')
    expect(load).toHaveBeenCalledWith(2, 'Rick & Morty')
  })
})
