<script setup lang="ts">
import type { Character } from '~/types/rick'
defineProps<{ character: Character; priority?: boolean }>()
</script>

<template>
  <NuxtLink :to="`/characters/${character.id}`" class="block min-w-0 rounded-[17px] border border-transparent p-[15px] text-white no-underline transition-colors hover:border-card-border focus-visible:border-card-border focus-visible:outline-none max-[600px]:first:border-card-border">
    <CharacterImage :src="character.image" :alt="character.name" :width="352" :height="352" :priority="priority" class="block aspect-square w-full rounded-lg bg-placeholder object-cover" />
    <h2 class="mt-4 mb-[13px] truncate text-xl leading-6 font-extrabold">{{ character.name }}</h2>
    <p class="m-0 text-base leading-[22px]"><UiStatus :status="character.status" :detail="character.species" /></p>
  </NuxtLink>
</template>
