<script setup lang="ts">
defineProps<{ status: string; detail?: string }>()
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span class="size-3 shrink-0 rounded-full" :class="status.toLowerCase() === 'alive' ? 'bg-alive' : status.toLowerCase() === 'dead' ? 'bg-dead' : 'bg-unknown'" aria-hidden="true" />
    <span>{{ status }}<template v-if="detail">-{{ detail }}</template></span>
  </span>
</template>
