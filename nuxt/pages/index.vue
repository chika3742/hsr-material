<template>
  <div>
    <h1 style="font-size: 1.5em">
      {{ $t("common.appName") }}
    </h1>
    <v-list class="mt-4">
      <v-list-item :title="$t('pageTitles.tpCalc')" to="/tp-calc" prepend-icon="mdi-sphere" />
      <v-list-item :title="$t('pageTitles.warps')" to="/warps" prepend-icon="mdi-history" />
    </v-list>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "home",
})
</script>
