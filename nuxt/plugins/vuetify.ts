import {createVuetify, IconProps} from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/lib/styles/main.sass"
import {FunctionalComponent} from "vue"

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      // TODO: Use the store to get the current theme
      themes: {
        dark: {
          dark: true,
          colors: {
            star: "#ffff00",
            "button-activated": "#d24700",
          },
        },
        light: {
          dark: false,
          colors: {
            star: "#ff8c00",
            "button-activated": "#ff5900",
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
