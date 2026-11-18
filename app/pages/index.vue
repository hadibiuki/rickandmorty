<script setup lang="ts">
import type { Character, CharacterPage } from '~/types/rick'
import { characterUrl } from '~/utils/api'

const route = useRoute()
const router = useRouter()
const queryName = computed(() => typeof route.query.name === 'string' ? route.query.name.trim() : '')
const page = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const url = computed(() => characterUrl(queryName.value, page.value))
const { data, error, status, refresh } = await useFetch<CharacterPage>(url, { retry: 0, dedupe: 'defer', key: () => `characters:${queryName.value}:${page.value}` })
const characterPreviews = useState<Record<number, Character>>('character-previews', () => ({}))
if (import.meta.client) {
  watch(data, value => {
    if (value) characterPreviews.value = Object.fromEntries(value.results.map(character => [character.id, character]))
  }, { immediate: true })
}
const noResults = computed(() => error.value && 'statusCode' in error.value && error.value.statusCode === 404)
const pages = computed(() => data.value?.info.pages ?? 0)
function goToPage(target: number) {
  router.push({ query: { name: queryName.value || undefined, page: target === 1 ? undefined : String(target) } })
}
function search(name: string) {
  router.push({ query: { name: name || undefined, page: undefined } })
}
useSeoMeta({ title: 'Characters | Rick and Morty', description: 'Search Rick and Morty characters and explore their episodes and locations.' })
</script>

<template>
  <div>
    <LayoutHero class="h-48 max-[600px]:h-44">
      <LayoutHeader />
      <CharacterSearch :name="queryName" @search="search" />
    </LayoutHero>

    <main class="page-shell pt-16 pb-10 max-[600px]:pt-8">
      <h1 class="sr-only">Rick and Morty characters</h1>
      <div v-if="status === 'pending'" class="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-3 max-[750px]:grid-cols-2 max-[600px]:grid-cols-1" aria-label="Loading characters">
        <div v-for="i in 12" :key="i" class="p-4"><div class="aspect-square w-full rounded-lg bg-placeholder" /><div class="mt-[18px] h-5 w-[65%] rounded-sm bg-placeholder" /><div class="mt-3 h-4 w-[45%] rounded-sm bg-placeholder" /></div>
      </div>
      <div v-else-if="noResults" class="px-4 py-[60px] text-center"><h2 class="text-[22px]">No characters found</h2><p class="text-unknown">Try another search.</p></div>
      <div v-else-if="error" class="px-4 py-[60px] text-center"><h2 class="text-[22px]">Could not load characters</h2><p class="text-unknown">Please check your connection and try again.</p><UiButton @click="refresh()">Retry</UiButton></div>
      <div v-else-if="data" class="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-3 max-[750px]:grid-cols-2 max-[600px]:grid-cols-1"><CharacterCard v-for="(character, index) in data.results" :key="character.id" :character="character" :priority="index === 0" /></div>

      <UiPagination v-if="data" :page="page" :pages="pages" aria-label="Character pages" @change="goToPage" />
    </main>
  </div>
</template>
