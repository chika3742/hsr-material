<script lang="ts" setup>
import type { RelicSet } from "~/types/data/src/decoration-sets"

withDefaults(defineProps<{
  relicSet: RelicSet
  show2pcOnly?: boolean
}>(), {
  show2pcOnly: false,
})
</script>

<template>
  <div>
    <section>
      <h4 class="c-subheader">
        {{ tx("common.2pcEffect") }}
      </h4>
      <EmphasizedText
        :class="['pl-4', show2pcOnly ? '' : 'my-1']"
        :text="localize(relicSet.effects['2pc'])"
      />
    </section>
    <section
      v-if="relicSet.effects['4pc']"
      v-show="!show2pcOnly"
    >
      <h4 class="c-subheader">
        {{ tx("common.4pcEffect") }}
      </h4>
      <EmphasizedText
        :text="localize(relicSet.effects['4pc'])"
        class="pl-4 my-1"
      />
    </section>
  </div>
</template>

<style lang="sass" scoped>
div.v-list-item.v-list-item--active h4
  color: inherit
  opacity: 0.8
</style>
