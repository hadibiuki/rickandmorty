<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
</script>

<template>
  <div class="error-page">
    <div>
      <p class="error-code">{{ error.statusCode }}</p>
      <h1>{{ error.statusCode === 404 ? 'Character not found' : 'Something went wrong' }}</h1>
      <NuxtLink to="/">Back to characters</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.error-page { min-height: 100vh; display: grid; place-items: center; background: #2c2d2f; color: white; text-align: center; }
.error-code { margin: 0; color: #b2df1f; font-size: 72px; font-weight: 800; }
a { display: inline-block; margin-top: 28px; padding: 12px 20px; border-radius: 5px; background: #b2df1f; color: #202223; text-decoration: none; }
</style>
