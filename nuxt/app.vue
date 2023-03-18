<template>
  <div>
    <NuxtLoadingIndicator
      :duration="3000"
      color="linear-gradient(to right, #4FC3F7, #D4E157, #FFA726)"
    />

    <v-app>
      <v-app-bar>
        <template #prepend>
          <v-app-bar-nav-icon
            v-show="$vuetify.display.mobile"
            @click="isDrawerOpenOnMobile = true"
          />
        </template>

        <v-app-bar-title>{{ title }}</v-app-bar-title>

        <template #append>
          <v-btn
            icon
            @click="isShowingSearchDialog = true"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-app-bar>

      <NuxtPage :page-key="$route.fullPath" keepalive />
    </v-app>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "#imports"

const route = useRoute()
const i18n = useI18n()

const isDrawerOpenOnMobile = ref(false)
const isShowingSearchDialog = ref(false)

const title = computed(() => {
  if (!route.meta.title) {
    throw new Error("No title found in route meta")
  }
  const [base, paramName] = route.meta.title.split("__")
  if (paramName) {
    return i18n.t(`pageTitle.${base}`, {name: i18n.t(`${base}.${route.params[paramName]}`)})
  } else {
    return i18n.t(`pageTitle.${base}`)
  }
})
</script>
