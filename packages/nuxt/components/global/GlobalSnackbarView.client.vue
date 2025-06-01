<template>
  <v-snackbar
    v-model="snackbar.ref.value.displayed"
    :color="snackbar.ref.value.color ?? undefined"
  >
    <span>{{ snackbar.ref.value.message }}</span>

    <template #actions>
      <v-btn
        v-for="(action, i) in snackbar.ref.value.actions"
        :key="i"
        :text="action.text"
        color="primary"
        style="filter: invert(1)"
        variant="text"
        @click="action.onClick(); snackbar.ref.value.displayed = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const snackbar = useSnackbar()
const router = useRouter()

router.beforeEach(() => {
  // Close snackbar when navigating to a new page not to prevent the page navigation (bug?)
  snackbar.ref.value.displayed = false
})
</script>
