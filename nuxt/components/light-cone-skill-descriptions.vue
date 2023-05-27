<script lang="ts" setup>
defineProps<{
  lightConeId: string
}>()

const parseSkillDescriptions = (input: string) => {
  return input.replace(/<(.+?)>/, "<span class='hmn-desc-emphasis'>$1</span>")
}
</script>

<template>
  <div v-html="parseSkillDescriptions(tx(`lightConeSkillDescriptions.${lightConeId}`))" />
</template>

<style lang="sass">
.hmn-desc-emphasis
  color: rgb(var(--v-theme-secondary))
  font-weight: bold
</style>
