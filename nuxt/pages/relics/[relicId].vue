<script lang="ts" setup>
import relicSets from "assets/data/relic-sets.csv"
import relicPieces from "assets/data/relic-pieces.csv"
import type {RelicPiece, RelicSet} from "~/types/data/relics"

definePageMeta({
  title: "relicDetails",
  itemI18nKey: "relicSetTitles",
})

const route = useRoute()

const expandedPanels = ref(0)
onMounted(() => {
  if (!isNaN(Number(route.query.expansion_index))) {
    expandedPanels.value = Number(route.query.expansion_index)
  }
})

const chooseRelicSetDialog = ref(false)

const relicSetBookmarkDialog = reactive({
  show: false,
  relicSets: null as RelicSet[] | null,
  relicPiece: null as RelicPiece | null,
})

if (!relicSets.some(e => e.id === route.params.relicId)) {
  throw createError({statusCode: 404, message: "Page not found", fatal: true})
}

const relicSet = relicSets.find(e => e.id === route.params.relicId)!

const bookmarkBtnText = computed(() => {
  switch (relicSet.type) {
    case "cavern":
      return tx("relicDetailsPage.bookmark4Pcs")
    case "planar":
      return tx("relicDetailsPage.bookmark2Pcs")
  }
})

const bookmarkSets = (secondarySet?: RelicSet) => {
  relicSetBookmarkDialog.relicPiece = null
  relicSetBookmarkDialog.relicSets = [
    relicSet,
    ...(secondarySet ? [secondarySet] : []),
  ]

  relicSetBookmarkDialog.show = true
}

const bookmarkPiece = (piece: RelicPiece) => {
  relicSetBookmarkDialog.relicPiece = piece
  relicSetBookmarkDialog.relicSets = null
  relicSetBookmarkDialog.show = true
}

</script>

<template>
  <div class="d-flex flex-column" style="gap: 8px">
    <v-row align="center" no-gutters>
      <v-img :src="getRelicSetImage(relicSet.id)" max-width="60px" width="60px" />
      <div class="ml-2 d-flex" style="gap: 8px">
        <span class="text-surface-variant">{{ tx("common.kind") }}</span>
        <span>{{ tx(`relicTypes.${relicSet.type}`) }}</span>
      </div>
    </v-row>

    <RelicSetEffects :relic-id="relicSet.id" />

    <v-expansion-panels v-model="expandedPanels">
      <v-expansion-panel :title="tx('relicDetailsPage.bookmarkInSets')">
        <template #text>
          <div class="d-flex flex-column" style="gap: 16px">
            <v-row no-gutters>
              <v-btn
                v-show="relicSet.type === 'cavern'"
                :text="tx('relicDetailsPage.bookmark2PcsEach')"
                prepend-icon="mdi-bookmark-multiple"
                variant="text"
                @click="chooseRelicSetDialog = true"
              />
              <v-btn
                :text="bookmarkBtnText"
                prepend-icon="mdi-bookmark"
                variant="text"
                @click="bookmarkSets()"
              />
            </v-row>
          </div>
        </template>
      </v-expansion-panel>
      <v-expansion-panel :title="tx('relicDetailsPage.bookmarkPerLocation')">
        <template #text>
          <v-list>
            <v-list-item
              v-for="item in relicPieces.filter(e => e.setId === relicSet.id)"
              :key="item.id"
              :prepend-avatar="getRelicPieceImage(item.id)"
              :subtitle="tx(`relicLocations.${item.type}`)"
              :title="tx(`relicPieceNames.${item.id}`)"
            >
              <template #append>
                <v-btn
                  :density="$vuetify.display.smAndDown ? 'comfortable' : 'default'"
                  :icon="$vuetify.display.smAndDown ? 'mdi-bookmark' : undefined"
                  :prepend-icon="$vuetify.display.mdAndUp ? 'mdi-bookmark' : ''"
                  :text="$vuetify.display.mdAndUp ? tx('relicDetailsPage.bookmark') : undefined"
                  variant="text"
                  @click="bookmarkPiece(item)"
                />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </v-expansion-panel>
      <v-expansion-panel :title="tx('relicDetailsPage.recommendedCharacters')" text="Coming soon..." />
    </v-expansion-panels>

    <RelicSetChooseDialog
      v-model="chooseRelicSetDialog"
      :current-set-id="relicSet.id"
      @ok-pressed="bookmarkSets($event)"
    />

    <RelicBookmarkDialog
      v-model="relicSetBookmarkDialog.show"
      :relic-piece="relicSetBookmarkDialog.relicPiece"
      :relic-sets="relicSetBookmarkDialog.relicSets"
    />
  </div>
</template>

<style lang="sass" scoped>

</style>
