export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: ["assets/styles/global.sass"],
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
  ],
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

  nitro: {
    preset: "node-server",
  },

  alias: {
    "#shared": "../firebase/functions/src/types/shared",
  },
})
