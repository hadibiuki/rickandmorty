<script setup lang="ts">
import type { Character, Episode, Location } from '~/types/rick'
import { characterByIdUrl, getEpisodes, getLocation } from '~/utils/api'

const route = useRoute()
const id = Number(route.params.id)
if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 404, statusMessage: 'Character not found' })

const characterPreviews = useState<Record<number, Character>>('character-previews', () => ({}))
const { data: character, error, status: characterStatus } = useLazyFetch<Character | null>(characterByIdUrl(id), {
  retry: 0,
  dedupe: 'defer',
  key: `character:${id}`,
  default: () => characterPreviews.value[id] ?? null
})
const notFound = computed(() => error.value?.statusCode === 404)

const { data: extra, status: extraStatus } = useLazyAsyncData(`character-extra:${id}`, async () => {
  if (!character.value) return { episodes: [] as Episode[], location: null as Location | null, origin: null as Location | null, episodesUnavailable: false, locationUnavailable: false }
  const [episodes, location, origin] = await Promise.allSettled([
    getEpisodes(character.value.episode),
    getLocation(character.value.location.url),
    getLocation(character.value.origin.url)
  ])
  return {
    episodes: episodes.status === 'fulfilled' ? episodes.value : [],
    location: location.status === 'fulfilled' ? location.value : null,
    origin: origin.status === 'fulfilled' ? origin.value : null,
    episodesUnavailable: episodes.status === 'rejected',
    locationUnavailable: location.status === 'rejected' || origin.status === 'rejected'
  }
}, { server: false, watch: [() => character.value?.id] })
const showAllEpisodes = ref(false)
const visibleEpisodes = computed(() => showAllEpisodes.value ? extra.value?.episodes ?? [] : extra.value?.episodes.slice(0, 8) ?? [])
const locations = computed(() => {
  if (!character.value) return []
  return [
    { role: 'Last known location', name: character.value.location.name, detail: extra.value?.location },
    { role: 'Origin', name: character.value.origin.name, detail: extra.value?.origin }
  ]
})
useSeoMeta({ title: () => character.value ? `${character.value.name} | Rick and Morty` : 'Character | Rick and Morty', description: () => character.value ? `Episodes and locations of ${character.value.name}.` : 'Rick and Morty character details.' })
</script>

<template>
  <div>
    <LayoutHero class="h-[432px] max-[600px]:h-auto max-[600px]:min-h-[387px] max-[600px]:pb-8">
      <LayoutHeader />
      <div v-if="!character && (characterStatus === 'pending' || characterStatus === 'idle')" class="page-shell mt-14 flex items-center gap-12 max-[600px]:mt-[25px] max-[600px]:block" aria-label="Loading character">
        <div class="size-60 shrink-0 rounded-md bg-placeholder max-[600px]:size-[180px]" />
        <div class="h-8 w-48 rounded bg-placeholder max-[600px]:mt-4" />
      </div>
      <div v-if="character" class="page-shell mt-14 flex items-center gap-12 max-[600px]:mt-[25px] max-[600px]:block">
        <CharacterImage :src="character.image" :alt="character.name" :width="240" :height="240" priority class="block size-60 shrink-0 rounded-md bg-placeholder object-cover max-[600px]:size-[180px]" />
        <div class="min-w-0 [overflow-wrap:anywhere] max-[600px]:mt-4">
          <h1 class="mb-[15px] text-[32px] leading-10 font-bold max-[600px]:mb-3.5 max-[600px]:text-2xl max-[600px]:leading-[29px]">{{ character.name }}</h1>
          <p class="m-0 text-base"><UiStatus :status="character.status" :detail="character.species" /></p>
        </div>
      </div>
    </LayoutHero>
    <main class="page-shell pt-[62px] pb-16 max-[600px]:pt-8">
      <div v-if="error" class="text-center"><h1>{{ notFound ? 'Character not found' : 'Could not load character' }}</h1><NuxtLink to="/" class="text-lime">Back to characters</NuxtLink></div>
      <template v-else-if="character">
        <section aria-labelledby="episodes-title">
          <h2 id="episodes-title" class="mb-6 flex items-center gap-4 text-2xl leading-[30px] font-bold max-[600px]:mb-5"><span class="grid h-[18px] w-5 shrink-0 place-items-center rounded-sm bg-lime text-lg leading-none font-extrabold text-surface" aria-hidden="true">▤</span>Episodes</h2>
          <p v-if="extraStatus === 'idle' || extraStatus === 'pending'" class="text-muted">Loading episodes...</p>
          <p v-else-if="extra?.episodesUnavailable" class="text-muted">Episode details are temporarily unavailable.</p>
          <div v-else-if="visibleEpisodes.length" class="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:gap-4">
            <UiInfoCard v-for="episode in visibleEpisodes" :key="episode.id" :title="episode.name" :accent="episode.episode.replace(/^(S\d+)(E\d+)$/, '$1 $2')" :detail="episode.air_date" />
          </div>
          <p v-else class="text-muted">No episodes available.</p>
          <UiButton v-if="extra && extra.episodes.length > 8" variant="outline" class="mx-auto mt-6 block" @click="showAllEpisodes = !showAllEpisodes">{{ showAllEpisodes ? 'Show fewer episodes' : `Show all ${extra.episodes.length} episodes` }}</UiButton>
        </section>
        <section class="mt-[62px] max-[600px]:mt-8" aria-labelledby="locations-title">
          <h2 id="locations-title" class="mb-6 flex items-center gap-4 text-2xl leading-[30px] font-bold max-[600px]:mb-5"><svg class="w-[22px] shrink-0 fill-lime" width="22" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>Locations</h2>
          <p v-if="extraStatus === 'idle' || extraStatus === 'pending'" class="text-muted">Loading locations...</p>
          <p v-else-if="extra?.locationUnavailable" class="text-muted">Some location details are temporarily unavailable.</p>
          <div v-if="extraStatus !== 'idle' && extraStatus !== 'pending'" class="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:gap-4">
            <UiInfoCard v-for="location in locations" :key="location.role" :title="location.name" :accent="location.detail?.type || location.role" :detail="location.detail?.dimension || 'unknown'" />
          </div>
        </section>
      </template>
    </main>
  </div>
</template>
