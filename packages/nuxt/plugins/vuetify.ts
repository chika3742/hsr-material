import type { IconProps } from "vuetify"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/lib/styles/main.sass"
import type { FunctionalComponent } from "vue"
import { h } from "vue"
import invert from "invert-color"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  const darkBase = {
    "star": "#ffff00",
    "button-activated": "#d24700",
    "rarity-5": "#f1931d",
    "rarity-4": "#c488fd",
    "rarity-3": "#3193e3",
    "rarity-2": "#38ab31",
    "card": "#3a3a3a",
    "slight-heading": "#bebebe",
    "bookmarked": "#ff8c00",
    "partially-bookmarked": "#90d31f",
  }

  const lightBase = {
    "star": "#ff8c00",
    "button-activated": "#ff5900",
    "rarity-5": "#f1931d",
    "rarity-4": "#c488fd",
    "rarity-3": "#1593f6",
    "rarity-2": "#3db236",
    "card": "#ececec",
    "slight-heading": "#757575",
    "bookmarked": "#ff2600",
    "partially-bookmarked": "#66a200",
  }

  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: "defaultDark",
      themes: {
        defaultDark: {
          dark: true,
          colors: {
            "primary": "#809acb",
            "inverse-primary": invert("#809acb"),
            ...darkBase,
          },
        },
        defaultLight: {
          dark: false,
          colors: {
            "primary": "#014cd5",
            "inverse-primary": invert("#014cd5"),
            ...lightBase,
          },
        },
        genshinDark: {
          dark: true,
          colors: {
            "primary": "#cba880",
            "inverse-primary": invert("#cba880"),
            ...darkBase,
          },
        },
        genshinLight: {
          dark: false,
          colors: {
            "primary": "#b54500",
            "inverse-primary": invert("#b54500"),
            ...lightBase,
          },
        },
        hsrDark: {
          dark: true,
          colors: {
            "primary": "#80CBC4",
            "inverse-primary": invert("#80CBC4"),
            ...darkBase,
          },
        },
        hsrLight: {
          dark: false,
          colors: {
            "primary": "#00796B",
            "inverse-primary": invert("#00796B"),
            ...lightBase,
          },
        },
      },
    },
    icons: {
      defaultSet: "mdi",
      sets: {
        ms: {
          component: ((params) => {
            return h("i", {
              class: ["font-material-symbols-outlined"],
              textContent: params.icon,
            })
          }) as FunctionalComponent<IconProps>,
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
