<script setup lang="ts">
import type { Character, Episode, Location } from '~/types/rick'
import { characterByIdUrl, getEpisodes, getLocation } from '~/utils/api'

const route = useRoute()
const id = Number(route.params.id)
if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 404, statusMessage: 'شخصیت پیدا نشد' })

const { data: character, error } = await useFetch<Character>(characterByIdUrl(id), { key: `character:${id}` })
if (error.value?.statusCode === 404) throw createError({ statusCode: 404, statusMessage: 'شخصیت پیدا نشد' })

const { data: extra, status: extraStatus } = await useAsyncData(`character-extra:${id}`, async () => {
  if (!character.value) return { episodes: [] as Episode[], location: null as Location | null, episodesUnavailable: false, locationUnavailable: false }
  const [episodes, location] = await Promise.allSettled([
    getEpisodes(character.value.episode),
    getLocation(character.value.location.url)
  ])
  return {
    episodes: episodes.status === 'fulfilled' ? episodes.value : [],
    location: location.status === 'fulfilled' ? location.value : null,
    episodesUnavailable: episodes.status === 'rejected',
    locationUnavailable: location.status === 'rejected'
  }
})

const showAllEpisodes = ref(false)
const visibleEpisodes = computed(() => showAllEpisodes.value ? extra.value?.episodes ?? [] : extra.value?.episodes.slice(0, 12) ?? [])

const statusLabel = computed(() => ({ Alive: 'زنده', Dead: 'مرده', unknown: 'نامشخص' })[character.value?.status || 'unknown'])
useSeoMeta({ title: () => character.value ? `${character.value.name} | کاوشگر ریک و مورتی` : 'جزئیات شخصیت', description: () => character.value ? `اطلاعات و قسمت‌های حضور ${character.value.name} در ریک و مورتی.` : 'جزئیات شخصیت ریک و مورتی' })
</script>

<template>
  <div>
    <AppHeader />
    <main class="page-shell py-8 sm:py-12">
      <NuxtLink to="/" class="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-lime-300 hover:text-lime-200">→ بازگشت به شخصیت‌ها</NuxtLink>
      <div v-if="error" class="glass rounded-2xl p-12 text-center"><h1 class="text-2xl font-bold">دریافت اطلاعات ممکن نشد</h1><p class="mt-3 text-slate-400">لطفاً دوباره تلاش کنید.</p><button class="mt-5 rounded-xl bg-lime-300 px-5 py-2 font-bold text-[#08131c]" @click="reloadNuxtApp()">تلاش دوباره</button></div>
      <template v-else-if="character">
        <div class="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div><NuxtImg :src="character.image" :alt="`تصویر ${character.name}`" width="300" height="300" sizes="100vw lg:320px" format="webp" class="w-full rounded-3xl border border-lime-300/20 object-cover shadow-[0_0_55px_#a3e63518]" /></div>
          <div class="flex flex-col justify-center"><span class="mb-4 w-fit rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-1 text-xs font-bold text-lime-300">پروندهٔ شخصیت</span><h1 class="text-4xl leading-tight font-extrabold sm:text-5xl" dir="auto">{{ character.name }}</h1><p class="mt-4 text-slate-400">نگاهی نزدیک‌تر به یکی از ساکنان چندجهانی ریک و مورتی.</p><div class="mt-8 grid gap-3 sm:grid-cols-2"><div v-for="item in [{ label: 'وضعیت', value: statusLabel }, { label: 'گونه', value: character.species }, { label: 'نوع', value: character.type || 'ثبت نشده' }, { label: 'جنسیت', value: character.gender }]" :key="item.label" class="glass rounded-xl p-4"><span class="block text-xs text-slate-400">{{ item.label }}</span><strong class="mt-1 block text-base" dir="auto">{{ item.value }}</strong></div></div></div>
        </div>
        <div class="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section class="glass rounded-2xl p-6"><h2 class="text-xl font-extrabold">مکان‌ها</h2><p v-if="extra?.locationUnavailable" class="mt-4 text-sm text-amber-300">جزئیات مکان فعلاً در دسترس نیست.</p><div class="mt-6 space-y-5"><div><span class="text-xs text-slate-400">آخرین مکان شناخته‌شده</span><p class="mt-1 font-bold" dir="auto">{{ character.location.name }}</p></div><div><span class="text-xs text-slate-400">مکان مبدأ</span><p class="mt-1 font-bold" dir="auto">{{ character.origin.name }}</p></div><template v-if="extra?.location"><div><span class="text-xs text-slate-400">نوع مکان</span><p class="mt-1 font-bold" dir="auto">{{ extra.location.type }}</p></div><div><span class="text-xs text-slate-400">بُعد</span><p class="mt-1 font-bold" dir="auto">{{ extra.location.dimension }}</p></div></template></div></section>
          <section class="glass rounded-2xl p-6"><div class="flex flex-wrap items-center justify-between gap-2"><h2 class="text-xl font-extrabold">قسمت‌های حضور</h2><span class="text-xs text-slate-400">{{ character.episode.length.toLocaleString('fa-IR') }} قسمت</span></div><p v-if="extraStatus === 'pending'" class="mt-6 text-slate-400">در حال دریافت قسمت‌ها...</p><ul v-else-if="extra?.episodes.length" class="mt-5 max-h-[410px] space-y-2 overflow-y-auto pl-2"><li v-for="episode in visibleEpisodes" :key="episode.id" class="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3"><span class="font-semibold" dir="auto">{{ episode.name }}</span><span class="shrink-0 text-xs text-lime-300" dir="ltr">{{ episode.episode }}</span></li></ul><p v-else-if="!extra?.episodesUnavailable" class="mt-6 text-slate-400">اطلاعات قسمت‌ها در دسترس نیست.</p><p v-if="extra?.episodesUnavailable" class="mt-4 text-sm text-amber-300">جزئیات قسمت‌ها فعلاً در دسترس نیست.</p><button v-else-if="extra && extra.episodes.length > 12" class="mt-4 text-sm font-bold text-lime-300" @click="showAllEpisodes = !showAllEpisodes">{{ showAllEpisodes ? 'نمایش کمتر' : 'نمایش همهٔ قسمت‌ها' }}</button></section>
        </div>
      </template>
    </main>
  </div>
</template>
