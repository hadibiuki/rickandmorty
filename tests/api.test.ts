import { describe, expect, it } from 'vitest'
import { characterUrl, idsFromUrls } from '../app/utils/api'

describe('Rick and Morty API helpers', () => {
  it('encodes a search term and page in the character URL', () => {
    const url = new URL(characterUrl('Rick & Morty', 2))
    expect(url.searchParams.get('name')).toBe('Rick & Morty')
    expect(url.searchParams.get('page')).toBe('2')
  })

  it('extracts only positive episode IDs', () => {
    expect(idsFromUrls([
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/42',
      'https://rickandmortyapi.com/api/episode/',
      'https://rickandmortyapi.com/api/episode/nope'
    ])).toEqual([1, 42])
  })
})

