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
            primary: "#ee8411",
            star: "#ffff00",
            "button-activated": "#d24700",
            rank5: "#f1931d",
            rank4: "#c488fd",
            rank3: "#3193e3",
            rank2: "#38ab31",
            card: "#3a3a3a",
          },
        },
        light: {
          dark: false,
          colors: {
            primary: "#008cff",
            star: "#ff8c00",
            "button-activated": "#ff5900",
            rank5: "#f1931d",
            rank4: "#c488fd",
            rank3: "#1593f6",
            rank2: "#3db236",
            card: "#ececec",
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
