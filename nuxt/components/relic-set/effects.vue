<script lang="ts" setup>
withDefaults(defineProps<{
  relicId: string
  show2pcOnly?: boolean
}>(), {
  show2pcOnly: false,
})
</script>

<template>
  <div>
    <section>
      <h4>{{ tx("common.2pcEffect") }}</h4>
      <EmphasizedText :class="['pl-4', show2pcOnly ? '' : 'my-1']" :text="tx(`relicSetEffects.${relicId}.2pc`)" />
    </section>
    <section v-if="$te(`relicSetEffects.${relicId}.4pc`)" v-show="!show2pcOnly">
      <h4>{{ tx("common.4pcEffect") }}</h4>
      <EmphasizedText :text="tx(`relicSetEffects.${relicId}.4pc`)" class="pl-4 my-1" />
    </section>
  </div>
</template>

<style lang="sass" scoped>
h4
  color: rgb(var(--v-theme-slight-heading))
  font-weight: normal
  font-size: 0.9em

div.v-list-item.v-list-item--active h4
  color: inherit
  opacity: 0.8
</style>
