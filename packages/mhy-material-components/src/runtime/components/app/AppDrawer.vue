<script setup lang="ts">
import { useDisplay } from "vuetify"
import { onMounted } from "#imports"

defineProps<{
  modelValue: boolean
  drawerItems: DrawerItemOrDivider[]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const display = useDisplay()

onMounted(() => {
  if (!display.mobile.value) {
    setTimeout(() => {
      emit("update:modelValue", true)
    })
  }
})
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-safe-area="{ top: true, left: true }">
      <v-list nav>
        <template v-for="(item, i) in drawerItems">
          <v-list-item
            v-if="item !== '---'"
            :key="i"
            :href="item.href"
            :prepend-icon="item.icon"
            :target="item.target"
            :title="item.title ? $t(`navDrawer.${item.title}`) : $getPageTitle(item.to!)"
            :to="item.to ? localePath(item.to) : undefined"
            density="comfortable"
            @click="item.onClick?.(); isOpen = false"
          />
          <v-divider
            v-else
            :key="i * 2"
            class="mb-1"
          />
        </template>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
