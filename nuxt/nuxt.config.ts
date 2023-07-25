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

const prodBranch = "live"
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
    "@vite-pwa/nuxt",
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
      isProdBranch: process.env.CF_PAGES_BRANCH === prodBranch,
      useFirebaseEmulator: process.env.USE_FIREBASE_EMULATOR === "true",
      firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG ?? "{}"),
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      algolia: {
        appId: algoliaConfig.appId,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
        indexName: algoliaConfig.indexName,
      },
      pagesCommitSha: process.env.CF_PAGES_COMMIT_SHA ?? execSync("git rev-parse HEAD").toString().trim(),
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
    compilation: {
      strictMessage: false,
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

  pwa: {
    registerType: "autoUpdate",
    devOptions: {
      enabled: process.env.NODE_ENV !== "production",
      type: "module",
      navigateFallbackAllowlist: [/^\/$/],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: [
        "**/*.{js,css,html,webp}",
      ],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
          handler: "StaleWhileRevalidate",
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
          handler: "StaleWhileRevalidate",
        },
      ],
    },
    manifest: {
      name: "崩壊：スターレイル 素材ノート",
      short_name: "スタレ素材",
      theme_color: "#b5f68b",
      background_color: "#888888",
      icons: [
        {
          src: "/pwa-x192.webp",
          size: "192x192",
          type: "image/webp",
          purpose: "any",
        },
        {
          src: "/pwa-maskable-x192.webp",
          size: "192x192",
          type: "image/webp",
          purpose: "maskable",
        },
      ],
      lang: "ja",
    },
  },
})
