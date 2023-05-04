<template>
  <div>
    <NuxtLoadingIndicator
      :duration="3000"
      color="linear-gradient(to right, #4FC3F7, #D4E157, #FFA726)"
    />

    <v-app>
      <AppDrawer v-model="isDrawerOpenOnMobile" />

      <v-app-bar>
        <template #prepend>
          <v-app-bar-nav-icon
            v-show="$vuetify.display.mobile"
            @click="isDrawerOpenOnMobile = true"
          />
        </template>

        <v-app-bar-title>{{ title }}</v-app-bar-title>
      </v-app-bar>

      <NuxtPage :page-key="$route.fullPath" keepalive />
    </v-app>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const i18n = useI18n()

const isDrawerOpenOnMobile = ref(false)

const title = computed(() => {
  if (!route.meta.title) {
    throw new Error("No title found in route meta")
  }
  const [base, paramName] = route.meta.title.split("__")
  if (paramName) {
    return i18n.t(`pageTitles.${base}`, {name: i18n.t(`${base}.${route.params[paramName]}`)})
  } else {
    return i18n.t(`pageTitles.${base}`)
  }
})
</script>
