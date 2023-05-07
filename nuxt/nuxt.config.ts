import {execSync} from "child_process"
import yaml from "@rollup/plugin-yaml"
import {DateTime} from "luxon"
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
  experimental: {
    payloadExtraction: false,
  },
  runtimeConfig: {
    public: {
      isProdBranch: process.env.CF_PAGES_BRANCH === "main",
      useFirebaseEmulator: process.env.USE_FIREBASE_EMULATOR === "true",
      firebaseConfigDev: {
        apiKey: "AIzaSyDNEmiGxBoKLpT0Tf9SNR16sjPBacIoTic",
        authDomain: "chikach.net",
        projectId: "hsr-material-dev",
        storageBucket: "hsr-material-dev.appspot.com",
        messagingSenderId: "599812122174",
        appId: "1:599812122174:web:6f0365509fa6cb15c1536f",
      },
      firebaseConfigProd: {
        apiKey: "AIzaSyA1OsOCOJLXJRTweW380HjVPij87mY8weI",
        authDomain: "chikach.net",
        projectId: "hsr-material",
        storageBucket: "hsr-material.appspot.com",
        messagingSenderId: "14422071885",
        appId: "1:14422071885:web:1120af7eab909844861a04",
      },
      recaptchaSiteKey: "6Le1pOIlAAAAAJk7pXcslkL7zaEUsPPxnMGmXyOx",
      pagesCommitSha: process.env.CF_PAGES_COMMIT_SHA ?? execSync("git rev-parse HEAD").toString().trim(),
      builtAt: DateTime.now().toISO(),
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
