<script setup lang="ts">
import type { Character } from '~/types/rick'
defineProps<{ character: Character; priority?: boolean }>()
</script>

<template>
  <NuxtLink :to="`/characters/${character.id}`" class="character-card">
    <CharacterImage :src="character.image" :alt="character.name" :width="352" :height="352" :priority="priority" class="character-image" />
    <h2>{{ character.name }}</h2>
    <p class="status-line"><span class="status-dot" :class="character.status.toLowerCase()" />{{ character.status }}-{{ character.species }}</p>
  </NuxtLink>
</template>

<style scoped>
.character-card { display: block; min-width: 0; padding: 15px; border: 1px solid transparent; border-radius: 17px; color: white; text-decoration: none; transition: border-color .15s; }
.character-card:hover, .character-card:focus-visible { border-color: #45494b; outline: none; }
.character-image { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; background: #505254; }
h2 { margin: 16px 0 13px; font-size: 20px; line-height: 24px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.status-line { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 16px; line-height: 22px; }
@media (max-width: 600px) { .character-card { border-color: transparent; } .character-card:first-child { border-color: #45494b; } }
</style>
