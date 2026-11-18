<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}>(), { priority: false })
const { imageSrc, handleError } = useCharacterImage(() => props.src)
</script>

<template>
  <img
    :src="imageSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
    @error="handleError"
  >
</template>
