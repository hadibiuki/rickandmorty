<script setup lang="ts">
import type { Character } from '~/types/rick'
defineProps<{ character: Character }>()
const statusLabel = (status: Character['status']) => ({ Alive: 'زنده', Dead: 'مرده', unknown: 'نامشخص' })[status]
</script>

<template>
  <NuxtLink :to="`/characters/${character.id}`" class="glass group overflow-hidden rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-lime-300/60 hover:shadow-[0_15px_45px_#0005]">
    <div class="relative aspect-square overflow-hidden bg-slate-800">
      <NuxtImg :src="character.image" :alt="`تصویر ${character.name}`" loading="lazy" width="300" height="300" sizes="100vw sm:50vw lg:25vw xl:20vw" format="webp" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <span class="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-[#08131c]/90 px-3 py-1 text-xs backdrop-blur"><span class="h-2 w-2 rounded-full" :class="character.status === 'Alive' ? 'bg-lime-400' : character.status === 'Dead' ? 'bg-rose-400' : 'bg-slate-400'" />{{ statusLabel(character.status) }}</span>
    </div>
    <div class="flex items-center justify-between gap-3 p-4"><h2 class="truncate text-base font-bold" dir="auto">{{ character.name }}</h2><span class="shrink-0 text-lg text-lime-300" aria-hidden="true">←</span></div>
  </NuxtLink>
</template>
