<script setup lang="ts">
import type { CharacterPage } from '~/types/rick'
import { characterUrl } from '~/utils/api'

const route = useRoute()
const router = useRouter()
const queryName = computed(() => typeof route.query.name === 'string' ? route.query.name.trim() : '')
const page = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const input = ref(queryName.value)
watch(queryName, value => { input.value = value })
const url = computed(() => characterUrl(queryName.value, page.value))
const { data, error, status, refresh } = await useFetch<CharacterPage>(url, { retry: 0, dedupe: 'defer', key: () => `characters:${queryName.value}:${page.value}` })
const noResults = computed(() => error.value && 'statusCode' in error.value && error.value.statusCode === 404)
const pages = computed(() => data.value?.info.pages ?? 0)
const pageItems = computed(() => {
  const count = pages.value
  const start = Math.max(1, Math.min(page.value - 2, count - 4))
  return Array.from({ length: Math.min(count, 5) }, (_, index) => start + index)
})
function goToPage(target: number) {
  if (target < 1 || target > pages.value || target === page.value) return
  router.push({ query: { name: queryName.value || undefined, page: target === 1 ? undefined : String(target) } })
}
function search() {
  router.push({ query: { name: input.value.trim() || undefined, page: undefined } })
}
useSeoMeta({ title: 'Characters | Rick and Morty', description: 'Search Rick and Morty characters and explore their episodes and locations.' })
</script>

<template>
  <div>
    <div class="design-hero list-hero">
      <AppHeader />
      <form class="search-form page-shell" role="search" @submit.prevent="search">
        <label class="sr-only" for="character-search">Search for characters</label>
        <input id="character-search" v-model="input" type="search" autocomplete="off" placeholder="Search for characters...">
        <button type="submit" aria-label="Search characters">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
          <span>Search</span>
        </button>
      </form>
    </div>

    <main class="page-shell list-main">
      <h1 class="sr-only">Rick and Morty characters</h1>
      <div v-if="status === 'pending'" class="character-grid" aria-label="Loading characters">
        <div v-for="i in 12" :key="i" class="loading-card"><div class="placeholder-image" /><div class="loading-line" /><div class="loading-line short" /></div>
      </div>
      <div v-else-if="noResults" class="state-message"><h2>No characters found</h2><p>Try another search.</p></div>
      <div v-else-if="error" class="state-message"><h2>Could not load characters</h2><p>Please check your connection and try again.</p><button @click="refresh()">Retry</button></div>
      <div v-else-if="data" class="character-grid"><CharacterCard v-for="(character, index) in data.results" :key="character.id" :character="character" :priority="index < 4" /></div>

      <nav v-if="data && pages > 1" class="pagination" aria-label="Character pages">
        <button :disabled="page === 1" aria-label="First page" @click="goToPage(1)">«</button>
        <button :disabled="page === 1" aria-label="Previous page" @click="goToPage(page - 1)">‹</button>
        <button v-for="item in pageItems" :key="item" :aria-current="item === page ? 'page' : undefined" :class="{ active: item === page }" @click="goToPage(item)">{{ item }}</button>
        <span v-if="pages > pageItems.at(-1)!" aria-hidden="true">...</span>
        <button :disabled="page === pages" aria-label="Next page" @click="goToPage(page + 1)">›</button>
        <button :disabled="page === pages" aria-label="Last page" @click="goToPage(pages)">»</button>
      </nav>
    </main>
  </div>
</template>

<style scoped>
.list-hero { height: 192px; }
.search-form { display: flex; gap: 16px; height: 80px; padding: 16px; margin-top: 16px; background: #2c2d2f; border-radius: 9px; }
.search-form input { flex: 1; min-width: 0; height: 48px; padding: 0 16px; background: #3a3b3d; border: 0; border-radius: 4px; outline: none; color: #fff; font-size: 14px; }
.search-form input::placeholder { color: #fff; opacity: 1; }
.search-form input:focus-visible { outline: 2px solid #b3e11b; }
.search-form button { display: flex; align-items: center; justify-content: center; gap: 8px; width: 102px; border: 0; border-radius: 5px; background: #b2df1f; color: #151a16; font-size: 14px; font-weight: 600; }
.search-form button:hover { background: #c5f035; }
.list-main { padding-top: 64px; padding-bottom: 40px; }
.character-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
.loading-card { padding: 16px; }
.placeholder-image { width: 100%; aspect-ratio: 1; border-radius: 8px; }
.loading-line { width: 65%; height: 20px; margin-top: 18px; border-radius: 4px; background: #505254; }
.loading-line.short { width: 45%; height: 16px; margin-top: 12px; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 55px auto 0; color: #999; }
.pagination button { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%; background: none; color: inherit; font-weight: 700; }
.pagination button:first-child, .pagination button:nth-child(2), .pagination button:nth-last-child(2), .pagination button:last-child { font-size: 28px; font-weight: 400; line-height: 1; color: #eee; }
.pagination button:disabled { opacity: .5; }
.pagination button.active { background: #b2df1f; color: #192016; }
.pagination button:not(:disabled):hover { color: #b2df1f; }
.pagination button.active:hover { color: #192016; }
.pagination span { font-weight: 700; }
.state-message { padding: 60px 16px; text-align: center; }
.state-message h2 { font-size: 22px; }
.state-message p { color: #999; }
.state-message button { padding: 10px 20px; border: 0; border-radius: 5px; background: #b2df1f; }
@media (max-width: 1100px) { .character-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 750px) { .character-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) {
  .list-hero { height: 176px; }
  .search-form { margin-top: 0; gap: 16px; }
  .search-form button { width: 48px; flex: none; }
  .search-form button span { display: none; }
  .list-main { padding-top: 32px; }
  .character-grid { grid-template-columns: 1fr; gap: 24px; }
  .pagination { gap: 8px; margin-top: 24px; }
}
</style>


