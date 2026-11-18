<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-surface text-center text-white">
    <div>
      <p class="m-0 text-7xl font-extrabold text-lime">{{ error.statusCode }}</p>
      <h1>{{ error.statusCode === 404 ? 'Character not found' : 'Something went wrong' }}</h1>
      <NuxtLink to="/" class="mt-7 inline-block rounded-md bg-lime px-5 py-3 text-ink-soft no-underline">Back to characters</NuxtLink>
    </div>
  </div>
</template>
