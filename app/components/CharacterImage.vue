<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}>(), { priority: false })
const failed = ref(false)
const original = ref(false)
const imageSrc = computed(() => {
  const match = props.src.match(/\/avatar\/(\d+)\.jpeg$/)
  return match && !original.value ? `/images/${match[1]}` : props.src
})
function handleError() {
  if (!original.value) original.value = true
  else failed.value = true
}
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img
    :src="failed ? '/character-unavailable.svg' : imageSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
    @error="handleError"
  >
</template>
