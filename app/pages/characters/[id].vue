<script setup lang="ts">
import type { Character, Episode, Location } from '~/types/rick'
import { characterByIdUrl, getEpisodes, getLocation } from '~/utils/api'

const route = useRoute()
const id = Number(route.params.id)
if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 404, statusMessage: 'Character not found' })

const { data: character, error } = await useFetch<Character>(characterByIdUrl(id), { retry: 0, dedupe: 'defer', key: `character:${id}` })
if (error.value?.statusCode === 404) throw createError({ statusCode: 404, statusMessage: 'Character not found' })

const { data: extra, status: extraStatus } = await useAsyncData(`character-extra:${id}`, async () => {
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
})
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
    <div class="design-hero detail-hero">
      <AppHeader />
      <div v-if="character" class="page-shell profile">
        <CharacterImage :src="character.image" :alt="character.name" :width="240" :height="240" priority class="profile-image" />
        <div class="profile-copy">
          <h1>{{ character.name }}</h1>
          <p><span class="status-dot" :class="character.status.toLowerCase()" />{{ character.status }}-{{ character.species }}</p>
        </div>
      </div>
    </div>
    <main class="page-shell detail-main">
      <div v-if="error" class="detail-error"><h1>Could not load character</h1><NuxtLink to="/">Back to characters</NuxtLink></div>
      <template v-else-if="character">
        <section class="detail-section" aria-labelledby="episodes-title">
          <h2 id="episodes-title"><span class="section-icon episode-icon" aria-hidden="true">▤</span>Episodes</h2>
          <p v-if="extraStatus === 'pending'" class="section-note">Loading episodes...</p>
          <p v-else-if="extra?.episodesUnavailable" class="section-note">Episode details are temporarily unavailable.</p>
          <div v-else-if="visibleEpisodes.length" class="info-grid">
            <article v-for="episode in visibleEpisodes" :key="episode.id" class="design-card info-card">
              <h3>{{ episode.name }}</h3>
              <p class="accent">{{ episode.episode.replace(/^(S\d+)(E\d+)$/, '$1 $2') }}</p>
              <p class="muted">{{ episode.air_date }}</p>
            </article>
          </div>
          <p v-else class="section-note">No episodes available.</p>
          <button v-if="extra && extra.episodes.length > 8" class="show-more" @click="showAllEpisodes = !showAllEpisodes">{{ showAllEpisodes ? 'Show fewer episodes' : `Show all ${extra.episodes.length} episodes` }}</button>
        </section>
        <section class="detail-section locations-section" aria-labelledby="locations-title">
          <h2 id="locations-title"><svg class="section-icon" width="22" height="24" viewBox="0 0 24 24" fill="#b2df1f" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>Locations</h2>
          <p v-if="extra?.locationUnavailable" class="section-note">Some location details are temporarily unavailable.</p>
          <div class="info-grid">
            <article v-for="location in locations" :key="location.role" class="design-card info-card">
              <h3>{{ location.name }}</h3>
              <p class="accent">{{ location.detail?.type || location.role }}</p>
              <p class="muted">{{ location.detail?.dimension || 'unknown' }}</p>
            </article>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.detail-hero { height: 432px; }
.profile { display: flex; align-items: center; gap: 48px; margin-top: 56px; }
.profile-image { display: block; width: 240px; height: 240px; flex: none; object-fit: cover; border-radius: 6px; background: #275459; }
.profile-copy { min-width: 0; overflow-wrap: anywhere; }
.profile-copy h1 { margin: 0 0 15px; font-size: 32px; line-height: 40px; font-weight: 700; }
.profile-copy p { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 16px; }
.detail-main { padding-top: 62px; padding-bottom: 64px; }
.detail-section h2 { display: flex; align-items: center; gap: 16px; margin: 0 0 24px; font-size: 24px; line-height: 30px; font-weight: 700; }
.section-icon { width: 22px; flex: none; color: #b2df1f; }
.episode-icon { display: grid; place-items: center; width: 20px; height: 18px; border-radius: 2px; background: #b2df1f; color: #2c2d2f; font-size: 18px; line-height: 1; font-weight: 800; }
.info-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
.info-card { min-width: 0; min-height: 126px; padding: 16px; overflow-wrap: anywhere; }
.info-card h3 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0 0 14px; font-size: 20px; line-height: 24px; font-weight: 800; }
.info-card p { margin: 0; font-size: 16px; line-height: 20px; }
.info-card .accent { margin-bottom: 16px; color: #00d8ec; font-weight: 600; }
.info-card .muted, .section-note { color: #a1a1a1; }
.locations-section { margin-top: 62px; }
.show-more { display: block; margin: 24px auto 0; padding: 10px 18px; border: 1px solid #b2df1f; border-radius: 6px; background: none; color: #b2df1f; }
.show-more:hover { background: #b2df1f; color: #202223; }
.detail-error { text-align: center; }
.detail-error a { color: #b2df1f; }
@media (max-width: 1100px) { .info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) {
  .detail-hero { min-height: 387px; height: auto; padding-bottom: 32px; }
  .profile { display: block; margin-top: 25px; }
  .profile-image { width: 180px; height: 180px; }
  .profile-copy { margin-top: 16px; }
  .profile-copy h1 { margin-bottom: 14px; font-size: 24px; line-height: 29px; }
  .detail-main { padding-top: 32px; }
  .detail-section h2 { margin-bottom: 20px; }
  .info-grid { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .locations-section { margin-top: 32px; }
}
</style>

