import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useCharacterImage(src: MaybeRefOrGetter<string>) {
  const failed = ref(false)
  const original = ref(false)
  const imageSrc = computed(() => {
    const source = toValue(src)
    const match = source.match(/\/avatar\/(\d+)\.jpeg$/)
    return failed.value ? '/character-unavailable.svg' : match && !original.value ? `/images/${match[1]}` : source
  })

  function handleError() {
    if (!original.value) original.value = true
    else failed.value = true
  }

  watch(() => toValue(src), () => {
    original.value = false
    failed.value = false
  })

  return { imageSrc, handleError }
}
