export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@nuxtjs/i18n",
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

  nitro: {
    preset: "node-server",
  },
})
