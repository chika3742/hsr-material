<template>
  <v-dialog
    v-model="dialog.ref.value.displayed"
    :persistent="dialog.ref.value.persistent"
    max-width="500px"
    @close="dialog.ref.value.onCancel"
  >
    <v-card :title="dialog.ref.value.title">
      <template #text>
        <p class="text-pre-wrap">
          {{ dialog.ref.value.content }}
        </p>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn @click="dialog.ref.value.onCancel">
          {{ $t("common.cancel") }}
        </v-btn>
        <v-btn @click="dialog.ref.value.onOk">
          {{ $t("common.ok") }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = useDialog()
</script>
