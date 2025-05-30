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
  const primaryDark = "#80CBC4"
  const primaryLight = "#00796B"

  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          dark: true,
          colors: {
            "primary": primaryDark,
            "inverse-primary": invert(primaryDark),
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
          },
        },
        light: {
          dark: false,
          colors: {
            "primary": primaryLight,
            "inverse-primary": invert(primaryLight),
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
