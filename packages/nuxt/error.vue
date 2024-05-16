<script setup>
const error = useError()

const statusMessage = computed(() => {
  switch (error.value.statusCode) {
    case 404:
      return "Not Found"
    case 500:
      return "Internal Server Error"
  }
})
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h2>{{ error.statusCode }} {{ statusMessage }}</h2>
            <p>{{ tx(`errors.${error.statusCode}`) }}</p>
          </v-col>
          <v-col>
            <v-btn @click="clearError({redirect: localePath('/')})">
              {{ tx("common.backToHome") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="sass" scoped>

</style>
