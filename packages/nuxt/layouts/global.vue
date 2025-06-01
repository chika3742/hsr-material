<template>
  <v-app>
    <GlobalAppBar
      nav-icon="mdi-arrow-left"
      hide-search-icon
      @nav-icon-clicked="handleNavIconClicked"
    />

    <v-main class="h-100">
      <GlobalPageLoadIndicator />

      <div class="d-flex flex-column h-100">
        <v-container v-safe-area="{ left: 16, right: 16 }">
          <slot />
        </v-container>

        <v-spacer />

        <GlobalFooter />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const router = useRouter()

function handleNavIconClicked(): void {
  const state = router.options.history.state
  if (state && state.back === null) {
    // move to home if back destination does not exist
    // (e.g. search traffic, direct URL)
    router.replace("/")
  } else {
    router.back()
  }
}
</script>
