import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useCharacterImage } from '../app/utils/character-image'

describe('character image fallback', () => {
  it('starts with the optimized image and resets when the source changes', async () => {
    const src = ref('https://rickandmortyapi.com/api/character/avatar/1.jpeg')
    const { imageSrc, handleError } = useCharacterImage(src)
    expect(imageSrc.value).toBe('/images/1')
    handleError()
    expect(imageSrc.value).toBe(src.value)
    handleError()
    expect(imageSrc.value).toBe('/character-unavailable.svg')
    src.value = 'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
    await nextTick()
    expect(imageSrc.value).toBe('/images/2')
  })
})
