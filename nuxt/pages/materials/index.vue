<script lang="ts" setup>
import materials from "~/assets/data/materials.csv"
import {splitByField} from "#imports"

definePageMeta({
  title: "materials",
})

const groups = computed(() => {
  return splitByField(materials, "category")
})
</script>

<template>
  <v-list style="user-select: none">
    <v-list-group v-for="group in groups" :key="group[0].id">
      <template #activator="{props}">
        <v-list-item
          :title="tx(`materialCategories.${group[0].category}`)"
          v-bind="props"
        >
          <template #prepend>
            <v-img :src="getMaterialImage(group[0].id)" aspect-ratio="1" class="mr-2" width="35px" />
          </template>
        </v-list-item>
      </template>

      <v-list-item
        v-for="material in group"
        :key="material.id"
        :title="tx(`materialNames.${material.id}`)"
        :to="localePath(`/materials/${material.id}`)"
      >
        <template #prepend>
          <v-img :src="getMaterialImage(material.id)" aspect-ratio="1" class="mr-2" width="35px" />
        </template>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<style lang="sass" scoped>

</style>
