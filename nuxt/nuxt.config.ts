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
import {workboxBuild} from "./scripts/workbox-build"

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
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
      ],
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  css: ["assets/styles/global.sass"],
  modules: [
    "mhy-material-components",
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
    preset: "cloudflare-pages-static",
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
      generateLocType()
    },
    async "builder:watch"(_, _path) {
      if (_path.startsWith(path.resolve("schemas/"))) {
        await generateSchemas()
      }
      if (_path.startsWith(path.resolve("locales/"))) {
        generateLocType()
      }
    },
    "nitro:build:public-assets"() {
      return workboxBuild()
    },
    async "build:done"() {
      if (process.env.NODE_ENV === "development") {
        await workboxBuild()
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
})
