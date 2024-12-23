import pkgJson from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    shim: false,
  },

  appConfig: {
    appVersion: pkgJson.version,
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-security',
    '@morev/vue-transitions/nuxt',
    '@nuxtjs/critters',
  ],

  icon: {
    clientBundle: {
      scan: {
        globInclude: ['components/**/*.vue'],
        globExclude: ['node_modules', 'dist'],
      },
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
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
