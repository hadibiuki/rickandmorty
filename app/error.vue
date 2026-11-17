<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-[#08131c] px-5 text-center text-white"><div><p class="text-7xl font-extrabold text-lime-300">{{ error.statusCode }}</p><h1 class="mt-4 text-2xl font-bold">{{ error.statusCode === 404 ? 'این شخصیت پیدا نشد' : 'مشکلی پیش آمد' }}</h1><NuxtLink to="/" class="mt-7 inline-block rounded-xl bg-lime-300 px-6 py-3 font-bold text-[#08131c]">بازگشت به صفحهٔ اصلی</NuxtLink></div></div>
</template>
