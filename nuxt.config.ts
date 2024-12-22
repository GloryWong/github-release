import htmlMinifier from 'vite-plugin-html-minifier'
import pkgJson from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  vite: {
    plugins: [
      htmlMinifier({
        minify: true,
      }),
    ],
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-security',
    '@morev/vue-transitions/nuxt',
    '@nuxtjs/critters',
  ],

  typescript: {
    shim: false,
  },

  appConfig: {
    appVersion: pkgJson.version,
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          '\'self\'',
          'data:',
          '*.githubusercontent.com/',
        ],
      },
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    },
  },

  compatibilityDate: '2024-07-12',
})
