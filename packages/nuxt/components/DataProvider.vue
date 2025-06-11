<script setup lang="ts">
import gMaterialsMeta from "~/assets/data/genshin/materials-meta.yaml"
import gMaterials from "~/assets/data/genshin/materials.yaml"
import materialsMeta from "~/assets/data/materials-meta.yaml"
import materials from "~/assets/data/materials.yaml"
import type { Game } from "~/types/data/enums"

const props = defineProps<{
  game: Game
}>()

const gameMap: Record<Game, Record<string, any>> = {
  genshin: {
    materials: gMaterials,
    materialsMeta: gMaterialsMeta,
  },
  hsr: {
    materials: materials,
    materialsMeta: materialsMeta,
  },
}

for (const key in gameMap[props.game]) {
  provide(`data_${key}`, gameMap[props.game][key])
}
</script>

<template>
  <slot />
</template>
