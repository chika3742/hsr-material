<template>
  <AppFooter
    v-model:theme-setting="config.theme"
    :current-version="getCurrentVersionText()"
    :feedback-page-url="feedbackPageUrl"
    :hoyolab-article-url="hoyolabArticleUrl"
    :repository-url="repositoryUrl"
  />
</template>

<script lang="ts" setup>
const config = useConfigStore()

const repositoryUrl = "https://github.com/chika3742/hsr-material"
const feedbackPageUrl = "https://www.chikach.net/hsr-material-fb"
const hoyolabArticleUrl = "https://www.hoyolab.com/article/18406761"
</script>
