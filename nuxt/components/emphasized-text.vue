<script lang="ts" setup>
defineProps<{
  /**
   * The text surrounded by `<` and `>` will be emphasized.
   */
  text: string
}>()

const parseSkillDescriptions = (input: string) => {
  return input.replaceAll(/<(.+?)>/g, "<span class='hmn-desc-emphasis'>$1</span>")
}
</script>

<template>
  <div v-html="parseSkillDescriptions(text)" />
</template>

<style lang="sass">
.hmn-desc-emphasis
  color: rgb(var(--v-theme-secondary))
  font-weight: bold
</style>
