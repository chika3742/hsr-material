<script setup lang="ts">
import { useDisplay } from "vuetify"
import genshinIcon from "~/assets/img/icon_genshin.png"
import hsrIcon from "~/assets/img/icon_hsr.png"

export interface DrawerItem {
  icon: string
  title: string
  to?: string
  href?: string
  target?: string
  onClick?: () => void
}

type Divider = "---"

export type DrawerItemOrDivider = DrawerItem | Divider

defineProps<{
  modelValue: boolean
  drawerItems: DrawerItemOrDivider[]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const display = useDisplay()
const i18n = useI18n()
const localePath = useLocalePath()
const router = useRouter()

const availableGames = computed(() => ([
  {
    title: tx(i18n, "games.genshin"),
    value: "genshin",
    to: localePath("/genshin"),
    props: {
      iconUrl: genshinIcon,
    },
  },
  {
    title: tx(i18n, "games.hsr"),
    value: "hsr",
    to: localePath("/hsr"),
    props: {
      iconUrl: hsrIcon,
    },
  },
]))

const navigateToGame = (game: string) => {
  if (game === "genshin") {
    router.push(localePath("/genshin"))
  } else if (game === "hsr") {
    router.push(localePath("/hsr"))
  }
}

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
        <v-select
          class="mb-4"
          :model-value="getCurrentGame()"
          :items="availableGames"
          hide-details
          density="comfortable"
          @update:model-value="navigateToGame($event)"
        >
          <template #selection="{ item }">
            <div class="d-flex ga-2 align-center">
              <v-img
                :src="item.props.iconUrl"
                width="30"
                height="30"
              />
              <span style="font-size: 0.9rem;">{{ item.title }}</span>
            </div>
          </template>
          <template #item="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-img
                  :src="props.iconUrl as string"
                  width="30"
                  height="30"
                  class="mr-4"
                />
              </template>
            </v-list-item>
          </template>
        </v-select>
        <template v-for="(item, i) in drawerItems">
          <v-list-item
            v-if="item !== '---'"
            :key="i"
            :href="item.href"
            :prepend-icon="item.icon"
            :target="item.target"
            :title="item.title"
            :to="item.to ? $localePath(item.to) : undefined"
            density="comfortable"
            @click="item.onClick?.()"
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
