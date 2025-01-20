export default defineNuxtConfig({
  modules: ["../src/module", "@nuxtjs/i18n", "@nuxt/eslint"],
  devtools: { enabled: true },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true,
    },
  },
  i18n: {
    locales: [
      {
        code: "ja",
        language: "ja-JP",
        file: "ja.yaml",
      },
    ],
    langDir: "./locales/",
    defaultLocale: "ja",
  },
  mhyMaterialComponents: {},
})
