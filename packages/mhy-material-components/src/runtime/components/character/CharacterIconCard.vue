<script lang="ts" setup>
import { toCharacterId, toVariant } from "../../utils/variant"
import { computed, useI18n, useNuxtApp } from "#imports"

const props = defineProps<{
  characterIdWithVariant: string
  imageUrl: string
}>()

const i18n = useI18n()
const { $isTouchDevice } = useNuxtApp()

const characterName = computed(() => {
  return i18n.t(`characterNames.${props.characterIdWithVariant}`)
})
</script>

<template>
  <v-card
    :to="localePath({
      path: `/characters/${toCharacterId(characterIdWithVariant)}`,
      query: { variant: toVariant(characterIdWithVariant) ?? undefined },
    })"
    color="card"
  >
    <div class="d-flex flex-column align-center">
      <v-img
        :src="imageUrl"
        aspect-ratio="1"
        width="80px"
      />

      <v-card-subtitle
        v-show="$isTouchDevice"
        class="px-2 py-1"
      >
        {{ characterName }}
      </v-card-subtitle>
    </div>

    <client-only>
      <v-tooltip
        :disabled="$isTouchDevice as boolean"
        activator="parent"
        location="bottom"
        open-delay="100"
      >
        <span>{{ characterName }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<style lang="sass" scoped>

</style>
