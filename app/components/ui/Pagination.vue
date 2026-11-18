<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number
  pages: number
  ariaLabel?: string
}>(), { ariaLabel: 'Pagination' })
const emit = defineEmits<{ change: [page: number] }>()

const pageItems = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, props.pages - 4))
  return Array.from({ length: Math.min(props.pages, 5) }, (_, index) => start + index)
})

function changePage(target: number) {
  if (target >= 1 && target <= props.pages && target !== props.page) emit('change', target)
}
</script>

<template>
  <nav v-if="pages > 1" class="mx-auto mt-[55px] flex items-center justify-center gap-2.5 text-unknown max-[600px]:mt-6 max-[600px]:gap-2" :aria-label="ariaLabel">
    <button class="grid size-6 cursor-pointer place-items-center rounded-full text-[28px] leading-none text-white disabled:cursor-default disabled:opacity-50 hover:text-lime" :disabled="page === 1" aria-label="First page" @click="changePage(1)">«</button>
    <button class="grid size-6 cursor-pointer place-items-center rounded-full text-[28px] leading-none text-white disabled:cursor-default disabled:opacity-50 hover:text-lime" :disabled="page === 1" aria-label="Previous page" @click="changePage(page - 1)">‹</button>
    <button v-for="item in pageItems" :key="item" class="grid size-6 cursor-pointer place-items-center rounded-full font-bold hover:text-lime" :class="item === page ? 'bg-lime text-ink-soft hover:text-ink-soft' : ''" :aria-current="item === page ? 'page' : undefined" @click="changePage(item)">{{ item }}</button>
    <span v-if="pages > pageItems.at(-1)!" class="font-bold" aria-hidden="true">...</span>
    <button class="grid size-6 cursor-pointer place-items-center rounded-full text-[28px] leading-none text-white disabled:cursor-default disabled:opacity-50 hover:text-lime" :disabled="page === pages" aria-label="Next page" @click="changePage(page + 1)">›</button>
    <button class="grid size-6 cursor-pointer place-items-center rounded-full text-[28px] leading-none text-white disabled:cursor-default disabled:opacity-50 hover:text-lime" :disabled="page === pages" aria-label="Last page" @click="changePage(pages)">»</button>
  </nav>
</template>
