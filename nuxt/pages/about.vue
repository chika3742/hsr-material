<script setup lang="ts">
definePageMeta({
  title: "about",
})

const {$marked} = useNuxtApp()

const marked = $marked({})

const hoyolabUrl = "https://www.hoyolab.com/article/18406761"
</script>

<template>
  <div class="doc-container">
    <section>
      <div v-html="marked.parse(tx('aboutPage.feedback', {hoyolabUrl}))" />
    </section>

    <section>
      <div v-html="marked.parse(tx('aboutPage.support'))" />

      <a href="https://ko-fi.com/F2F26RSKD" target="_blank"><img
        alt="Buy Me a Coffee at ko-fi.com"
        height="36"
        src="https://storage.ko-fi.com/cdn/kofi5.png?v=3"
        style="border:0;height:36px;"
      ></a>
    </section>

    <section>
      <div v-html="marked.parse(tx('aboutPage.developer'))" />
      <v-row no-gutters style="gap: 16px">
        <v-btn icon="mdi-web" href="https://chikach.net/about" target="_blank" />
        <v-btn icon="mdi-twitter" href="https://twitter.com/chikavoid" target="_blank" />
      </v-row>
    </section>
  </div>
</template>

<style scoped lang="sass">

</style>
