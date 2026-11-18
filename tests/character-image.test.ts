import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useCharacterImage } from '../app/utils/character-image'

describe('character image fallback', () => {
  it('falls back to a local placeholder and resets when the source changes', async () => {
    const src = ref('https://rickandmortyapi.com/api/character/avatar/1.jpeg')
    const { imageSrc, handleError } = useCharacterImage(src)
    expect(imageSrc.value).toBe(src.value)
    handleError()
    expect(imageSrc.value).toBe('/character-unavailable.svg')
    src.value = 'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
    await nextTick()
    expect(imageSrc.value).toBe(src.value)
  })
})
