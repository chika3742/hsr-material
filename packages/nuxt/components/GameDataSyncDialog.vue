<script setup lang="ts">
export interface ShowcaseCharacter {
  id: string
  name: string
  imageUrl: string
  level: number
  rank: number
  promotion: number
  equipment: {
    name: string
    imageUrl: string
    level: number
    promotion: number
  } | null
  skills: {
    type: string
    iconUrl: string
    originalLevel: number
    extraLevel: number
  }[]
}

export interface ShowcaseContent {
  uid: string
  nickname: string
  level: number
  characters: ShowcaseCharacter[]
}

interface Props {
  modelValue: boolean
  showcase?: ShowcaseContent | null
  uid: string
  loading?: boolean | undefined
  fetchAvailableInSeconds?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  fetchAvailableInSeconds: null,
})

interface Emits {
  (e: "update:modelValue", value: boolean): void
  (e: "update:uid", value: string): void
  (e: "getData"): void
  (e: "import"): void
  (e: "clear"): void
}

const emit = defineEmits<Emits>()

const i18n = useI18n()

const validate = (v: string) => {
  return !!v.match(/^[0-9]*$/) || tx(i18n, "gameDataSync.invalidUid")
}

const disableExpandTransition = ref(false)

const emitGetData = () => {
  if (props.uid === "" || validate(props.uid) !== true) {
    return
  }

  // clear user data
  emit("clear")
  emit("getData")
}

watch(toRefs(props).modelValue, (value) => {
  if (value) {
    // clear obtained data when dialog is opened
    disableExpandTransition.value = true
    emit("clear")
    void nextTick(() => {
      disableExpandTransition.value = false
    })
  }
})

const showHelpDialog = ref(false)
</script>

<template>
  <div>
    <v-dialog
      :model-value="modelValue"
      max-width="500px"
      scrollable
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <v-card
        :title="tx('gameDataSync.title')"
        :subtitle="tx('gameDataSync.subtitle')"
      >
        <template #append>
          <v-btn
            icon
            variant="text"
            @click="showHelpDialog = true"
          >
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>

        <template #text>
          <p>{{ tx("gameDataSync.desc") }}</p>

          <!-- uid input field -->
          <v-text-field
            :model-value="uid"
            class="my-2"
            autofocus
            :disabled="loading"
            :rules="[validate]"
            label="UID"
            @keyup.enter="emitGetData"
            @update:model-value="$emit('update:uid', $event)"
          />

          <!-- fetch result -->
          <v-slide-x-transition
            :disabled="disableExpandTransition"
          >
            <div
              v-if="showcase"
              class="d-flex flex-column g-4"
            >
              <!-- userinfo -->
              <div class="d-flex align-center">
                <div>
                  <h4>{{ showcase.nickname }}</h4>
                  <p style="font-size: 0.8em">
                    <span>Lv.{{ showcase.level }}</span>
                    <span class="ml-4">UID: {{ showcase.uid }}</span>
                  </p>
                </div>
                <v-spacer />
                <span v-if="fetchAvailableInSeconds !== null">{{ fetchAvailableInSeconds }}s</span>
                <v-btn
                  icon="mdi-refresh"
                  variant="text"
                  :disabled="fetchAvailableInSeconds !== null"
                  @click="emitGetData"
                />
              </div>

              <!-- character container -->
              <div
                v-for="character in showcase.characters"
                :key="character.id"
                class="d-flex flex-column g-2"
              >
                <!-- header -->
                <div class="d-flex g-2 align-center">
                  <v-img
                    :src="character.imageUrl"
                    max-width="50px"
                    height="50px"
                  />
                  <div class="d-flex flex-column">
                    <h4>{{ character.name }}</h4>
                    <p>
                      <span style="font-size: 0.8em">Lv.</span>
                      <span class="font-weight-bold">{{ character.level }}</span>
                    </p>
                  </div>
                </div>

                <!-- skill levels -->
                <div class="d-flex g-2 flex-wrap">
                  <div
                    v-for="skill in character.skills"
                    :key="skill.type"
                    class="d-flex align-center g-1"
                  >
                    <div class="skill-icon-container">
                      <v-img
                        :src="skill.iconUrl"
                        width="25px"
                        height="25px"
                      />
                    </div>
                    <div class="text-no-wrap">
                      <span style="font-size: 0.8em">Lv.</span>
                      <span class="font-weight-bold">{{ skill.originalLevel }}</span>
                      <span
                        v-if="skill.extraLevel > 0"
                        style="font-size: 0.8em"
                      >
                        <span>+</span>
                        <span>{{ skill.extraLevel }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- equipment -->
                <div
                  v-if="character.equipment"
                  class="ml-8 d-flex align-center g-2"
                >
                  <v-img
                    :src="character.equipment.imageUrl"
                    max-width="45px"
                    height="45px"
                  />
                  <div class="d-flex flex-column">
                    <h4>{{ character.equipment.name }}</h4>
                    <p>
                      <span style="font-size: 0.8em">Lv.</span>
                      <span class="font-weight-bold">{{ character.equipment.level }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </v-slide-x-transition>
        </template>

        <template #actions>
          <v-spacer />
          <v-btn
            variant="text"
            :text="tx('common.cancel')"
            @click="$emit('update:modelValue', false)"
          />
          <v-btn
            variant="text"
            :text="showcase?.uid !== uid ? tx('gameDataSync.next') : tx('gameDataSync.import')"
            color="primary"
            :disabled="uid === '' || validate(uid) !== true"
            :loading="loading"
            @click="showcase?.uid !== uid ? emitGetData() : $emit('import')"
          />
        </template>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showHelpDialog"
      max-width="500px"
      scrollable
    >
      <v-card :title="tx('gameDataSync.help')">
        <template #text>
          <slot name="help" />
        </template>
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showHelpDialog = false"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="sass" scoped>
.skill-icon-container
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 85%, rgba(0, 0, 0, 0))
  padding: 2px
</style>
