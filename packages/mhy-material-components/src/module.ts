import { addComponentsDir, addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from "@nuxt/kit"
import yaml from "@rollup/plugin-yaml"
import type * as vite from "vite"
import { withCssExtension } from "./utils/with-css-extension"

// Module options TypeScript interface definition
export interface ModuleOptions {
  injectVuetify?: boolean
  theme?: {
    light: {
      primary: string
    }
    dark: {
      primary: string
    }
  }
  i18nKeys?: {
    equipment?: string
    extension?: string
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "mhy-material-components",
    configKey: "mhyMaterialComponents",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    injectVuetify: true,
    theme: {
      dark: {
        primary: "#80CBC4",
      },
      light: {
        primary: "#00796B",
      },
    },
    i18nKeys: {
      equipment: "weapons",
      extension: "artifacts",
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.mmc = {
      theme: options.theme!,
      i18nKeys: options.i18nKeys as Required<Required<ModuleOptions>["i18nKeys"]>,
    }

    nuxt.options.vite.plugins ||= []
    nuxt.options.vite.plugins.push(yaml({
      include: resolver.resolve("./runtime/locales/*.yaml"),
      exclude: "**",
    }) as vite.Plugin)

    nuxt.options.css.push(await withCssExtension(resolver.resolve("./runtime/styles/global")))

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    if (options.injectVuetify) {
      nuxt.options.build.transpile.push("vuetify")
      addPlugin(resolver.resolve("./runtime/plugins/vuetify"))
    }

    addPlugin(resolver.resolve("./runtime/plugins/is-touch-device"))
    addPlugin(resolver.resolve("./runtime/plugins/utils"))
    addPlugin(resolver.resolve("./runtime/plugins/directives/safe-area"))

    await addComponentsDir({
      path: resolver.resolve("./runtime/components"),
      watch: true,
    })

    addTypeTemplate({
      filename: "types/mmc.d.ts",
      src: resolver.resolve("./runtime/types/index.d.ts"),
    })

    addTypeTemplate({
      filename: "types/mmc-enums.d.ts",
      src: resolver.resolve("./runtime/types/enums.d.ts"),
    })

    addTypeTemplate({
      filename: "types/mmc-plugins.d.ts",
      src: resolver.resolve("./runtime/types/plugins.d.ts"),
    })
  },
  hooks: {
    async "i18n:registerModule"(registerModule) {
      const resolver = createResolver(import.meta.url)

      registerModule({
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
        langDir: resolver.resolve("./runtime/locales/"),
      })
    },
  },
})
