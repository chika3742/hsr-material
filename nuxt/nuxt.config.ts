import {execSync} from "child_process"
import {Readable} from "stream"
import fs from "fs"
import * as path from "path"
import yaml from "@rollup/plugin-yaml"
import {DateTime} from "luxon"
import dsv from "@rollup/plugin-dsv"
import type {SitemapItemLoose} from "sitemap"
import {EnumChangefreq, SitemapStream, streamToPromise} from "sitemap"
import type {FirebaseOptions} from "@firebase/app"
import algoliaConfig from "./algolia.json"
import {generateSchemas} from "./scripts/generate-schemas"
import {generateLocType} from "./scripts/generate-loc-type"
import {workboxBuild} from "./scripts/workbox-build"

const prodBranch = "live"
const hostname = "https://hsr.matnote.app"
const routes: string[] = []

export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
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
      meta: [
        {
          name: "viewport",
          content: "viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
      ],
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  css: ["assets/styles/global.sass"],
  modules: [
    "@chika3742/mhy-material-components",
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
        exclude: "**/locales/**",
      }),
      dsv({
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
    // TODO: https://github.com/nuxt/nuxt/issues/22994
    "#shared": "../../firebase/functions/src/types/shared",
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
      firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG ?? "{}") as FirebaseOptions,
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
