import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useCharacterImage(src: MaybeRefOrGetter<string>) {
  const failed = ref(false)
  const imageSrc = computed(() => failed.value ? '/character-unavailable.svg' : toValue(src))

  function handleError() {
    failed.value = true
  }

  watch(() => toValue(src), () => {
    failed.value = false
  })

  return { imageSrc, handleError }
}
