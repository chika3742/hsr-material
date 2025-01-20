<script setup lang="ts">
import { tx } from "../../utils/i18n"

interface Props {
  filter: { [key in "possessionStatus" | "rarity" | string]: string[] }
  extraFilterOptions: FilterOption[]
}

const props = defineProps<Props>()

interface Emits {
  (e: "update:filter", value: Props["filter"]): void
}

const emit = defineEmits<Emits>()

const setFilter = (key: keyof Props["filter"], value: string[]) => {
  emit("update:filter", {
    ...props.filter,
    [key]: value,
  })
}
</script>

<template>
  <v-menu
    activator="parent"
    :close-on-content-click="false"
    max-width="400px"
  >
    <v-card>
      <section>
        <!-- filter by possession status -->
        <h4>{{ tx("characterFilterMenu.possessionStatus") }}</h4>
        <v-list
          :selected="filter['possessionStatus']"
          color="primary"
          @update:selected="setFilter('possessionStatus', $event as string[])"
        >
          <v-row no-gutters>
            <!-- filter option items -->
            <v-list-item
              :title="tx('characterFilterMenu.owned')"
              prepend-icon="mdi-check"
              value="owned"
            />
            <v-list-item
              :title="tx('characterFilterMenu.notOwned')"
              prepend-icon="mdi-close"
              value="notOwned"
            />
          </v-row>
        </v-list>
      </section>
      <v-divider />
      <!-- filter by rarity -->
      <section>
        <h4>{{ tx("characterFilterMenu.rarity") }}</h4>
        <v-list
          :selected="filter.rarity"
          color="primary"
          @update:selected="setFilter('rarity', $event as string[])"
        >
          <v-row no-gutters>
            <!-- filter option items -->
            <v-list-item
              v-for="rarity in [4, 5]"
              :key="rarity"
              :value="rarity"
            >
              <v-icon
                v-for="i of rarity"
                :key="i"
                :class="i !== 1 ? 'ml-n1' : ''"
                size="18"
                color="star"
              >
                mdi-star
              </v-icon>
            </v-list-item>
          </v-row>
        </v-list>
      </section>

      <!-- extra filtering options -->
      <section
        v-for="option in extraFilterOptions"
        :key="option.key"
      >
        <v-divider />
        <h4>{{ tx(option.titleI18nKey) }}</h4>
        <v-list
          :selected="filter[option.key]"
          color="primary"
          @update:selected="setFilter(option.key, $event as string[])"
        >
          <v-row no-gutters>
            <!-- filter option items -->
            <v-list-item
              v-for="item in option.items"
              :key="item.value"
              class="flex-grow-1"
              :title="tx(item.textI18nKey)"
              :value="item.value"
            >
              <template #prepend>
                <v-img
                  class="mr-2"
                  :src="item.icon"
                  width="25"
                  aspect-ratio="1"
                  :style="!$vuetify.theme.global.current.dark && item.invertIconColor ? 'filter: brightness(0)' : ''"
                />
              </template>
            </v-list-item>
          </v-row>
        </v-list>
      </section>
    </v-card>
  </v-menu>
</template>

<style lang="sass" scoped>
h4
  padding: 4px 16px 0
  margin-top: 8px
  font-weight: bold
</style>
