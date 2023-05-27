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

<style lang="sass" scoped>

</style>
