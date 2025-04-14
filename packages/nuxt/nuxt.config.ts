import { relative, resolve } from "path"
import { execSync } from "child_process"
import { Readable } from "stream"
import fs from "node:fs/promises"
import yaml from "@rollup/plugin-yaml"
import { DateTime } from "luxon"
import dsv from "@rollup/plugin-dsv"
import type { SitemapItemLoose } from "sitemap"
import { EnumChangefreq, SitemapStream, streamToPromise } from "sitemap"
import type { FirebaseOptions } from "@firebase/app"
import { useNuxt } from "@nuxt/kit"
import algoliaConfig from "./algolia.json"
import { generateSchemas } from "./scripts/generate-schemas"
import { generateLocType } from "./scripts/generate-loc-type"
import { workboxBuild } from "./scripts/workbox-build"

const prodBranch = "live"
const hostname = "https://hsr.matnote.app"
const routes: string[] = []

export default defineNuxtConfig({
  modules: [
    "@hsr-material/mhy-material-components",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
  ],
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

  css: ["assets/styles/global.sass"],

  runtimeConfig: {
    public: {
      isProdBranch: process.env.CF_PAGES_BRANCH === prodBranch,
      useFirebaseEmulator: process.env.USE_FIREBASE_EMULATOR === "true",
      // @ts-ignore
      firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG ?? "null") as FirebaseOptions | null,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      algolia: {
        appId: algoliaConfig.appId,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
        indexName: algoliaConfig.indexName,
      },
      pagesCommitSha: process.env.CF_PAGES_COMMIT_SHA ?? execSync("git rev-parse HEAD").toString().trim(),
      builtAt: DateTime.now().toISO(),
    },
  },

  alias: {
    // TODO: https://github.com/nuxt/nuxt/issues/22994
    "#shared": "../../firebase/functions/src/types/shared",
  },

  build: {
    transpile: ["vuetify"],
  },

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: "2025-01-19",

  nitro: {
    preset: "cloudflare-pages-static",
    hooks: {
      "prerender:route"(route) {
        routes.push(route.route)
      },
      async close() {
        // create sitemap
        if (routes.length > 0) {
          const links: SitemapItemLoose[] = routes.map(route => ({
            url: route,
            changefreq: EnumChangefreq.MONTHLY,
          }))

          const stream = new SitemapStream({
            hostname,
          })
          const sitemap = await streamToPromise(Readable.from(links).pipe(stream))
          await fs.writeFile("dist/sitemap.xml", sitemap.toString())
        }

        // copy Cloudflare Pages Functions
        await fs.cp("functions", "../../functions", { recursive: true })
      },
    },
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [
      // @ts-ignore
      yaml({
        exclude: "**/locales/**",
      }),
      // @ts-ignore
      dsv({
        processRow(row) {
          const result: Record<string, unknown> = {}
          for (const key of Object.keys(row)) {
            const value = row[key]
            if (value !== "") {
              result[key] = isNaN(+value) ? value : +value
            }
          }

          return result
        },
      }),
    ],
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
      const nuxt = useNuxt()
      _path = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, _path))
      if (_path.startsWith("types/data/")) {
        await generateSchemas()
      }
      if (_path.startsWith("locales/")) {
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

  eslint: {
    config: {
      stylistic: true,
    },
  },

  googleFonts: {
    download: false,
    families: {
      "M PLUS 2": [500, 700],
      "Kaisei Opti": [700],
      "Cairo": [700],
      "Kiwi Maru": [500],
      "Material Symbols Outlined": true,
    },
  },

  i18n: {
    locales: [
      {
        code: "ja",
        language: "ja-JP",
        file: "ja.yaml",
      },
      {
        code: "en",
        language: "en-US",
        file: "en.yaml",
      },
    ],
    langDir: "./locales/",
    defaultLocale: "ja",
    compilation: {
      strictMessage: false,
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  mhyMaterialComponents: {
    i18nKeys: {
      equipment: "lightConeNames",
    },
  },

  piniaPersistedstate: {
    storage: "localStorage",
  },
})
