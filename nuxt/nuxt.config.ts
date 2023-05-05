import yaml from "@rollup/plugin-yaml"
import {generateSchemas} from "./scripts/generate-schemas"

export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: "scroll-y-reverse-transition",
      leaveActiveClass: "position-absolute d-none",
      duration: 200,
    },
    head: {
      link: [
        {
          rel: "shortcut icon",
          href: "/favicon.webp",
        },
      ],
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  css: ["assets/styles/global.sass"],
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [
      yaml({
        exclude: "locales/**",
      }),
    ],
  },
  nitro: {
    preset: "node-server",
  },
  alias: {
    "#shared": "../firebase/functions/src/types/shared",
  },
  hooks: {
    async "build:before"() {
      await generateSchemas()
    },
    async "builder:watch"(_, path) {
      if (path.startsWith("schemas/")) {
        await generateSchemas()
      }
    },
  },

  i18n: {
    locales: [
      {
        code: "ja",
        iso: "ja-JP",
        file: "ja.yaml",
      },
      {
        code: "en",
        iso: "en-US",
        file: "en.yaml",
      },
    ],
    langDir: "./locales/",
    defaultLocale: "ja",
    vueI18n: {
      legacy: false,
      fallbackLocale: "ja",
      datetimeFormats: {
        ja: {
          time: {
            hour12: false,
          },
        },
      },
    },
  },

  googleFonts: {
    families: {
      "M PLUS 2": [500, 700],
      "Kaisei Opti": [700],
      Cairo: [700],
      "Kiwi Maru": [500],
      "Material Symbols Outlined": true,
    },
  },

  piniaPersistedstate: {
    storage: "localStorage",
  },
})
