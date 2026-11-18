<script setup lang="ts">
const props = defineProps<{ name: string }>()
const emit = defineEmits<{ search: [name: string] }>()
const input = ref(props.name)
watch(() => props.name, value => { input.value = value })
</script>

<template>
  <form class="page-shell mt-4 flex h-20 gap-4 rounded-[9px] bg-surface p-4 max-[600px]:mt-0" role="search" @submit.prevent="emit('search', input.trim())">
    <label class="sr-only" for="character-search">Search for characters</label>
    <UiInput id="character-search" v-model="input" type="search" autocomplete="off" placeholder="Search for characters..." />
    <UiButton type="submit" aria-label="Search characters" class="flex w-[102px] items-center justify-center gap-2 !p-0 text-sm max-[600px]:w-12 max-[600px]:shrink-0">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
      <span class="max-[600px]:hidden">Search</span>
    </UiButton>
  </form>
</template>
