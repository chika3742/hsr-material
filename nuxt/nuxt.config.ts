import {execSync} from "child_process"
import {Readable} from "stream"
import fs from "fs"
import * as path from "path"
import yaml from "@rollup/plugin-yaml"
import {DateTime} from "luxon"
import dsv from "@rollup/plugin-dsv"
import {EnumChangefreq, SitemapItemLoose, SitemapStream, streamToPromise} from "sitemap"
import algoliaConfig from "./algolia.json"
import {generateSchemas} from "./scripts/generate-schemas"
import {generateLocType} from "./scripts/generate-loc-type"

const hostname = "https://hsr.matnote.app"
const routes: string[] = []

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
      dsv({
        // @ts-ignore: https://github.com/rollup/plugins/pull/1493
        processRow(row) {
          const result: Record<string, unknown> = {}
          for (const key of Object.keys(row)) {
            const value = row[key]!
            if (value !== "") {
              result[key] = isNaN(+value) ? value : +value
            }
          }

          return result
        },
      }),
    ],
  },
  nitro: {
    preset: "node-server",
    hooks: {
      "prerender:route"(route) {
        routes.push(route.route)
      },
      close() {
        if (routes.length > 0) {
          const links: SitemapItemLoose[] = routes.map(route => ({
            url: route,
            changefreq: EnumChangefreq.MONTHLY,
          }))

          const stream = new SitemapStream({
            hostname,
          })

          return streamToPromise(Readable.from(links).pipe(stream))
            .then((sm) => {
              return fs.writeFileSync("dist/sitemap.xml", sm.toString())
            })
        }
      },
    },
  },
  alias: {
    "#shared": "../firebase/functions/src/types/shared",
  },
  typescript: {
    tsConfig: {
      exclude: ["functions"],
    },
  },
  hooks: {
    async "build:before"() {
      await generateSchemas()
      await generateLocType()
    },
    async "builder:watch"(_, _path) {
      if (_path.startsWith(path.resolve("schemas/"))) {
        await generateSchemas()
      }
      if (_path.startsWith(path.resolve("locales/"))) {
        await generateLocType()
      }
    },
  },
  experimental: {
    payloadExtraction: false,
  },
  runtimeConfig: {
    public: {
      isProdBranch: process.env.CF_PAGES_BRANCH === "live",
      useFirebaseEmulator: process.env.USE_FIREBASE_EMULATOR === "true",
      firebaseConfigDev: {
        apiKey: "AIzaSyDNEmiGxBoKLpT0Tf9SNR16sjPBacIoTic",
        authDomain: "www.chikach.net",
        projectId: "hsr-material-dev",
        storageBucket: "hsr-material-dev.appspot.com",
        messagingSenderId: "599812122174",
        appId: "1:599812122174:web:6f0365509fa6cb15c1536f",
      },
      firebaseConfigProd: {
        apiKey: "AIzaSyA1OsOCOJLXJRTweW380HjVPij87mY8weI",
        authDomain: "www.chikach.net",
        projectId: "hsr-material",
        storageBucket: "hsr-material.appspot.com",
        messagingSenderId: "14422071885",
        appId: "1:14422071885:web:1120af7eab909844861a04",
      },
      recaptchaSiteKey: "6Le1pOIlAAAAAJk7pXcslkL7zaEUsPPxnMGmXyOx",
      algolia: {
        appId: algoliaConfig.appId,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
        indexName: algoliaConfig.indexName,
      },
      funcVersion: execSync("git describe --tags --match=\"v[0-9]*\" --always HEAD", {stdio: "pipe"}).toString().trim(),
      dataVersion: execSync("git describe --tags --match=\"D[0-9]*\" --always HEAD", {stdio: "pipe"}).toString().trim(),
      pagesCommitSha: process.env.CF_PAGES_COMMIT_SHA ?? execSync("git rev-parse HEAD", {stdio: "pipe"}).toString().trim(),
      builtAt: DateTime.now().toISO()!,
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
    },
  },

  googleFonts: {
    download: false,
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
