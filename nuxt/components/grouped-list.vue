<script lang="ts" setup>
const props = defineProps<{
  modelValue: number[]
  items: (Record<string, unknown> & { id: string, rarity: number })[]
  categoryField: string
  imageFunc: (id: string) => string
  categoryI18nKey: string
  itemI18nKey: string
  linkBasePath: string
}>()

const emit = defineEmits<{
  (event: "update:modelValue", value: number[]): void
}>()

const opened = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit("update:modelValue", v)
  },
})
</script>

<template>
  <v-list v-model:opened="opened" style="user-select: none">
    <v-list-group v-for="(group, i) in splitByField(items, categoryField)" :key="group[0].id" :value="i">
      <template #activator="{props: _props}">
        <v-list-item
          :title="tx(`${categoryI18nKey}.${group[0][categoryField]}`)"
          v-bind="_props"
        >
          <template #prepend>
            <v-img :src="imageFunc(group[0].id)" aspect-ratio="1" class="mr-2" width="35px" />
          </template>
        </v-list-item>
      </template>

      <ItemListItem
        v-for="item in group"
        :key="item.id"
        :image-func="imageFunc"
        :item="item"
        :item-i18n-key="itemI18nKey"
        :link-base-path="linkBasePath"
      />
    </v-list-group>
  </v-list>
</template>

<style lang="sass" scoped>

</style>
