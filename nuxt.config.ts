import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-16',
  devtools: { enabled: false },
  runtimeConfig: {
    public: { apiBase: 'https://rickandmortyapi.com/api' }
  },
  nitro: { compressPublicAssets: true },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      title: 'Rick and Morty Characters',
      meta: [{ name: 'description', content: 'Explore Rick and Morty characters, episodes, and locations.' }],
      link: [
        { rel: 'preload', href: '/fonts/inter-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
      ]
    }
  }
})
