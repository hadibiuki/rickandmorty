<template>
  <header class="site-header page-shell">
    <NuxtLink to="/" aria-label="Rick and Morty home" class="logo-link">
      <img src="/rick-and-morty.svg" alt="Rick and Morty" width="116" height="36">
    </NuxtLink>
  </header>
</template>

<style scoped>
.site-header { height: 72px; display: flex; align-items: flex-start; padding-top: 13px; position: relative; z-index: 1; }
.logo-link { display: inline-block; width: 116px; }
.logo-link img { display: block; width: 116px; height: 36px; object-fit: contain; }
@media (max-width: 600px) { .site-header { height: 72px; } }
</style>
