import { dirname, relative, resolve } from "path"
import { createRequire } from "node:module"
import { execSync } from "child_process"
import { Readable } from "stream"
import fs from "node:fs/promises"
import yaml from "@rollup/plugin-yaml"
import { DateTime } from "luxon"
import type { SitemapItemLoose } from "sitemap"
import { EnumChangefreq, SitemapStream, streamToPromise } from "sitemap"
import type { FirebaseOptions } from "@firebase/app"
import { useNuxt } from "nuxt/kit"
import algoliaConfig from "./algolia.json"
import { generateSchemas } from "./scripts/generate-schemas"
import { generateLocType } from "./scripts/generate-loc-type"
import { workboxBuild } from "./scripts/workbox-build"

const prodBranch = "live"
const hostname = "https://hsr.matnote.app"
const routes: string[] = []

// With Nuxt 4 + bun, vue gets installed as multiple physical copies, which splits the
// `declare module "vue"` type augmentations (ComponentCustomProperties from vue-router/vuetify/i18n/own plugins).
// Pin vue resolution to a single copy to unify module identity (affects type-checking only, not runtime).
const vueDir = dirname(createRequire(import.meta.url).resolve("vue/package.json"))

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
    "@nuxt/fonts",
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
    ],
    optimizeDeps: {
      include: [
        "@vueuse/rxjs",
        "nuxt > @nuxt/devtools > @vitejs/devtools-kit/client",
        "nuxt > @nuxt/devtools > @vitejs/devtools/client/inject",
        "nuxt > @nuxt/devtools > @vue/devtools-core",
        "nuxt > @nuxt/devtools > @vue/devtools-kit",
        "nuxt > @nuxt/devtools > error-stack-parser-es",
        "nuxt > @nuxt/devtools > vite-plugin-vue-tracer/client/overlay",
        "sortablejs",
        "marked",
      ],
    },
  },

  typescript: {
    tsConfig: {
      // TODO: enable noUncheckedIndexedAccess (Nuxt 4 default) in the future and fix the resulting indexed-access type errors
      compilerOptions: {
        noUncheckedIndexedAccess: false,
        paths: {
          "vue": [vueDir],
          "vue/*": [`${vueDir}/*`],
        },
      },
      exclude: [
        "../functions",
      ],
    },
  },

  hooks: {
    async "build:before"() {
      await generateSchemas()
      generateLocType()
    },
    async "builder:watch"(_, _path) {
      const nuxt = useNuxt()
      // Nuxt 4's builder:watch emits absolute paths. Match them relative to both srcDir (app/) and rootDir.
      const absPath = resolve(nuxt.options.srcDir, _path)
      const srcRel = relative(nuxt.options.srcDir, absPath)
      const rootRel = relative(nuxt.options.rootDir, absPath)
      if (srcRel.startsWith("types/data/")) {
        await generateSchemas()
      }
      if (rootRel.startsWith("i18n/locales/")) {
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

  fonts: {
    families: [
      { name: "M PLUS 2", weights: [500, 700], provider: "google" },
      { name: "Kaisei Opti", weights: [700], provider: "google" },
      { name: "Cairo", weights: [700], provider: "google" },
      { name: "Kiwi Maru", weights: [500], provider: "google" },
      { name: "Material Symbols Outlined", provider: "googleicons" },
    ],
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
  },

  piniaPersistedstate: {
    storage: "localStorage",
  },
})
