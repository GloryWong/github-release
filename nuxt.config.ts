import pkgJson from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-security',
    '@morev/vue-transitions/nuxt',
  ],

  app: {
    head: {
      link: [{
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css',
      }],
    },
  },

  typescript: {
    shim: false,
  },

  imports: {
    dirs: ['./constants'],
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