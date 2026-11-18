<script setup lang="ts">
defineProps<{ title: string; accent: string; detail: string }>()
</script>

<template>
  <article class="min-h-[126px] min-w-0 rounded-2xl bg-card p-4 [overflow-wrap:anywhere]">
    <h3 class="mb-3.5 truncate text-xl leading-6 font-extrabold">{{ title }}</h3>
    <p class="mb-4 text-base leading-5 font-semibold text-cyan">{{ accent }}</p>
    <p class="m-0 text-base leading-5 text-muted">{{ detail }}</p>
  </article>
</template>
