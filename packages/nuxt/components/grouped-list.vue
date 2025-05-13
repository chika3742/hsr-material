<script lang="ts" setup>
const props = defineProps<{
  modelValue: number[]
  groups: GroupedListGroup[]
  items: GroupedListItem[]
  preserveQuery?: boolean
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

const groupedItems = computed(() => {
  const result: Record<string, GroupedListItem[]> = {}
  for (const e of props.groups) {
    result[e.groupKey] = []
  }

  for (const e of props.items) {
    result[e.groupKey].push(e)
  }

  return result
})
</script>

<script lang="ts">
export interface GroupedListItem {
  key: string
  name: string
  to: string
  imagePath: string
  groupKey: string
  rarity: number
  descContent?: string
}
export interface GroupedListGroup {
  groupKey: string
  title: string
}
</script>

<template>
  <v-list
    v-model:opened="opened"
    class="v-list--sticky-header"
    style="user-select: none"
  >
    <v-list-group
      v-for="group in groups"
      :key="group.groupKey"
      :value="group.groupKey"
    >
      <template #activator="{ props: _props }">
        <v-list-item
          :title="group.title"
          v-bind="_props"
        >
          <template #prepend>
            <v-img
              :src="groupedItems[group.groupKey][0].imagePath"
              class="mr-2"
              height="40px"
              width="40px"
            />
          </template>
        </v-list-item>
      </template>

      <ItemListItem
        v-for="item in groupedItems[group.groupKey]"
        :key="item.key"
        :name="item.name"
        :to="item.to"
        :image-path="item.imagePath"
        :rarity="item.rarity"
        :preserve-query="preserveQuery"
        :lines="item.descContent ? 'two' : 'one'"
      >
        <template #subtitle>
          <v-list-item-subtitle class="mt-1">
            <EmphasizedText
              v-if="item.descContent"
              :text="item.descContent"
            />
          </v-list-item-subtitle>
        </template>
      </ItemListItem>
    </v-list-group>
  </v-list>
</template>

<style lang="sass" scoped>

</style>
