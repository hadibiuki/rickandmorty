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
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'کاوشگر ریک و مورتی',
      meta: [{ name: 'description', content: 'شخصیت‌های دنیای ریک و مورتی را جست‌وجو و کشف کنید.' }],
      link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap' }]
    }
  }
})
