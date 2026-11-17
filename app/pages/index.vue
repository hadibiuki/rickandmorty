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
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(input, value => {
  clearTimeout(searchTimer)
  if (value.trim() === queryName.value) return
  searchTimer = setTimeout(() => router.replace({ query: { name: value.trim() || undefined, page: undefined } }), 350)
})
onBeforeUnmount(() => clearTimeout(searchTimer))

const url = computed(() => characterUrl(queryName.value, page.value))
const { data, error, status, refresh } = await useFetch<CharacterPage>(url, { key: () => `characters:${queryName.value}:${page.value}` })
const noResults = computed(() => error.value && 'statusCode' in error.value && error.value.statusCode === 404)
const pages = computed(() => data.value?.info.pages ?? 0)
function goToPage(target: number) {
  if (target < 1 || target > pages.value) return
  router.push({ query: { name: queryName.value || undefined, page: target === 1 ? undefined : String(target) } })
}
useSeoMeta({ title: 'شخصیت‌ها | کاوشگر ریک و مورتی', description: 'شخصیت‌های ریک و مورتی را جست‌وجو کنید و درباره آن‌ها بیشتر بدانید.' })
</script>

<template>
  <div>
    <AppHeader />
    <main>
      <section class="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
        <div class="portal-glow pointer-events-none absolute inset-0" />
        <div class="page-shell relative z-10 text-center">
          <span class="mb-5 inline-flex rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-1.5 text-xs font-bold text-lime-300">به چندجهانی خوش آمدید</span>
          <h1 class="mx-auto max-w-3xl text-4xl leading-tight font-extrabold sm:text-6xl">همهٔ شخصیت‌های <span class="text-lime-300">ریک و مورتی</span></h1>
          <p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">از میان جهان‌های بی‌پایان بگردید و شخصیت محبوبتان را پیدا کنید.</p>
          <label class="glass mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-2xl px-5 py-4 text-right shadow-xl shadow-black/20 focus-within:border-lime-300/70">
            <svg class="h-5 w-5 shrink-0 text-lime-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            <span class="sr-only">جست‌وجوی نام شخصیت</span>
            <input v-model="input" type="search" autocomplete="off" placeholder="نام شخصیت را جست‌وجو کنید..." class="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" dir="auto">
          </label>
        </div>
      </section>

      <section class="page-shell py-10 sm:py-14" aria-live="polite">
        <div class="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p class="mb-2 text-xs font-bold text-lime-300">کاوش در چندجهانی</p><h2 class="text-2xl font-extrabold sm:text-3xl">{{ queryName ? `نتایج «${queryName}»` : 'همهٔ شخصیت‌ها' }}</h2></div><span v-if="data" class="text-sm text-slate-400">{{ data.info.count.toLocaleString('fa-IR') }} شخصیت</span></div>
        <div v-if="status === 'pending'" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"><div v-for="i in 10" :key="i" class="glass aspect-[.78] animate-pulse rounded-2xl" /></div>
        <div v-else-if="noResults" class="glass rounded-2xl p-12 text-center"><p class="text-xl font-bold">شخصیتی پیدا نشد</p><p class="mt-2 text-slate-400">نام دیگری را امتحان کنید.</p></div>
        <div v-else-if="error" class="glass rounded-2xl p-12 text-center"><p class="text-xl font-bold">دریافت اطلاعات ممکن نشد</p><p class="mt-2 text-slate-400">اتصال خود را بررسی کنید و دوباره تلاش کنید.</p><button class="mt-5 rounded-xl bg-lime-300 px-5 py-2 font-bold text-[#08131c]" @click="refresh()">تلاش دوباره</button></div>
        <div v-else-if="data" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"><CharacterCard v-for="character in data.results" :key="character.id" :character="character" /></div>
        <nav v-if="data && pages > 1" class="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label="صفحه‌بندی شخصیت‌ها"><button :disabled="page <= 1" class="glass rounded-xl px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 hover:border-lime-300/50" @click="goToPage(page - 1)">قبلی</button><span class="px-3 text-sm text-slate-300">صفحهٔ {{ page.toLocaleString('fa-IR') }} از {{ pages.toLocaleString('fa-IR') }}</span><button :disabled="page >= pages" class="glass rounded-xl px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 hover:border-lime-300/50" @click="goToPage(page + 1)">بعدی</button></nav>
      </section>
    </main>
    <footer class="border-t border-white/10 py-7 text-center text-xs text-slate-500">داده‌ها از Rick and Morty API</footer>
  </div>
</template>
