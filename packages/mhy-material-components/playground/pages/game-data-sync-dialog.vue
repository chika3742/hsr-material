<script setup lang="ts">
import { definePageMeta, ref } from "#imports"

definePageMeta({
  title: "GameDataSyncDialog",
})

const show = ref(false)
const loading = ref(false)
const uid = ref("")
const obtainedUser = ref<UserInfoResponse | undefined>(undefined)

const testShowcaseCharacter: ShowcaseCharacter = {
  nameJP: "三月なのか",
  variant: "fire",
  level: 80,
  rank: 3,
  promotion: 6,
  equipment: {
    nameJP: "",
    level: 80,
    promotion: 6,
  },
  skills: [
    {
      type: "Normal",
      iconUrl: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/1001_basic_atk.png",
      originalLevel: 7,
      extraLevel: 1,
    },
    {
      type: "BPSkill",
      iconUrl: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/1001_skill.png",
      originalLevel: 8,
      extraLevel: 0,
    },
    {
      type: "Talent",
      iconUrl: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/1001_talent.png",
      originalLevel: 9,
      extraLevel: 2,
    },
    {
      type: "Ultra",
      iconUrl: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/1001_ultimate.png",
      originalLevel: 10,
      extraLevel: 0,
    },
  ],
}

const exampleUser: UserInfoResponse = {
  uid: "123456789",
  nickname: "example",
  level: 66,
  characters: new Array(8).fill(testShowcaseCharacter),
}

const getters: DataSyncMapGetters = {
  getEquipmentId: () => "test_eq",
  getEquipmentImage: () => "/_nuxt/assets/img/test_small.webp",
  getCharacterId: () => "test",
  getCharacterImage: () => "/_nuxt/assets/img/test_small.webp",
}

const getData = (uid: string) => {
  loading.value = true
  setTimeout(() => {
    obtainedUser.value = exampleUser
    obtainedUser.value.uid = uid
    loading.value = false
  }, 1000)
}
</script>

<template>
  <div>
    <v-btn
      text="Show"
      @click="show = true"
    />
    <GameDataSyncDialog
      v-model="show"
      v-model:uid="uid"
      v-model:user="obtainedUser"
      :getters="getters"
      :loading="loading"
      @get-data="getData"
    >
      <template #help>
        <p>
          Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at neque sed sed ante
          imperdiet, dolor mauris cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo, augue in, duis
          erat proin condimentum in a eget, sed fermentum sed vestibulum varius ac, vestibulum volutpat orci ut elit
          eget tortor. Ultrices nascetur nulla gravida ante arcu. Pharetra rhoncus morbi ipsum, nunc tempor debitis,
          ipsum pellentesque, vitae id quam ut mauris dui tempor, aptent non. Quisque turpis. Phasellus quis lectus
          luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla aliquet, nibh praesent, elementum nulla.
          Sit lacus pharetra tempus magna neque pellentesque, nulla vel erat. Justo ex quisque nulla accusamus
          venenatis, sed quis. Nibh phasellus gravida metus in, fusce aenean ut erat commodo eros. Ut turpis, dui
          integer, nonummy pede placeat nec in sit leo. Faucibus porttitor illo taciti odio, amet viverra scelerisque
          quis quis et tortor, curabitur morbi a. Enim tempor at, rutrum elit condimentum, amet rutrum vitae tempor
          torquent nunc. Praesent vestibulum integer maxime felis. Neque aenean quia vitae nostra, tempus elit enim id
          dui, at egestas pulvinar. Integer libero vestibulum, quis blandit scelerisque mattis fermentum nulla, tortor
          donec vestibulum dolor amet eget, elit nullam. Aliquam leo phasellus aliquam curabitur metus a, nulla justo
          mattis duis interdum vel, mollis vitae et id, vestibulum erat ridiculus sit pulvinar justo sed. Vehicula
          convallis, et nulla wisi, amet vestibulum risus, quam ac egestas. Et vitae, nulla gravida erat scelerisque
          nullam nunc pellentesque, a dictumst cras augue, purus imperdiet non. Varius montes cursus varius vel tortor,
          nec leo a qui, magni cras, velit vel consectetuer lobortis vel. Nibh erat et wisi felis leo porttitor, sapien
          nibh sapien pede mi, sed eget porttitor, repellendus arcu ac quis. Luctus vulputate aut est sem magna,
          placerat accumsan nunc vestibulum ipsum ac auctor, maecenas lorem in ut nec mauris tortor, doloribus varius
          sem tortor vestibulum mollis, eleifend tortor felis tempus lacus eu eu. Eleifend vel eu, nullam maecenas
          mauris nec nunc euismod, tortor porta ridiculus potenti, massa tristique nam magna, et wisi placerat et erat
          ante. Eget pede erat in facilisis, fermentum venenatis sodales. Ac tortor sociis et non animi tristique,
          rhoncus malesuada, ut arcu volutpat scelerisque sollicitudin, elit curabitur dui pede purus dolor, integer
          aenean risus taciti nulla eleifend accumsan. At pulvinar diam parturient, interdum mi velit aliquet et a. Arcu
          at ac placerat eget justo semper, purus sociis curabitur mi ipsum consequat ut, mollis vestibulum, est ante
          ornare lacus sem. Neque magna mauris, commodo quisque, praesent semper suscipit lobortis nam. Justo malesuada
          cursus ac nunc litora nunc. Tellus ac, in lobortis nunc, montes lectus purus fermentum. Ac sit wisi. Sodales
          aliquam, sed vestibulum nullam arcu sit risus arcu, id luctus vitae lorem nibh, integer nec nullam class
          cursus mi, purus arcu lectus. Vel ante suscipit volutpat potenti mattis sed, wisi eu placerat aliquam erat,
          lectus morbi lobortis at assumenda. Consequat neque purus ipsum voluptas odio, netus vestibulum ut nec,
          suspendisse pellentesque nec enim in. Wisi dictum sed semper a, ipsum erat tellus habitasse est, erat sem
          ornare, vitae quisque ultricies. Dui sed blandit. Tempor et faucibus justo sed luctus, nec vitae vitae. Nunc
          nibh pede, ipsum vestibulum aenean leo ante ultricies, nam cras quis sed penatibus amet. In mauris a. Integer
          metus mauris tortor, et rutrum vestibulum ultricies, ut phasellus in ullamcorper ut mollit, eu justo. Cursus
          pretium venenatis. Cras pellentesque vel sodales accumsan aenean. Feugiat metus sit nec in aliquet amet,
          porttitor pretium vulputate massa. Consequat ipsum luctus quisque adipiscing libero. Wisi sollicitudin. Eget
          vitae ac lobortis, lorem natoque vestibulum et, aliquet faucibus at morbi nibh, vel condimentum. Massa unde
          orci sed id sed, odio donec congue nec praesent amet. Hymenaeos velit lacus, quis vivamus libero tempus duis,
          eu nisi eu, ipsum at accumsan pede justo morbi donec, massa et libero sit risus neque tortor. Ut sed sed etiam
          hendrerit dapibus, quis metus suspendisse nibh. Fringilla tempor felis augue magna. Cum arcu a, id vitae.
          Pellentesque pharetra in cras sociis adipiscing est. Nibh nec mattis at maecenas, nisl orci aliquam nulla
          justo egestas venenatis, elementum duis vel porta eros,
        </p>
      </template>
    </GameDataSyncDialog>
  </div>
</template>

<style scoped>

</style>
