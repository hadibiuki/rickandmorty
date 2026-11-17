import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-16',
  modules: ['@nuxt/eslint', '@nuxt/image'],
  image: { domains: ['rickandmortyapi.com'] },
  routeRules: {
    '/': { swr: 3600 },
    '/characters/**': { swr: 3600 }
  },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      title: 'Rick and Morty Characters',
      meta: [{ name: 'description', content: 'Explore Rick and Morty characters, episodes, and locations.' }],
      link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' }]
    }
  }
})
