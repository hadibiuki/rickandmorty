<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}>(), { priority: false })
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img
    :src="failed ? '/character-unavailable.svg' : src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
    @error="failed = true"
  >
</template>
