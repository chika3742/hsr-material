<script lang="ts" setup>
import {AuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup, User} from "@firebase/auth"
import {FirebaseError} from "@firebase/util"

definePageMeta({
  title: "sync",
})

const {$auth} = useNuxtApp()
const dialog = useDialog()
const snackbar = useSnackbar()
const i18n = useI18n()

interface SignInMethod {
  title: string
  icon: string
  iconFilter?: boolean
  provider: AuthProvider
}

const signInMethods: SignInMethod[] = [
  {
    title: tx("syncPage.signInWith.google"),
    icon: getVector("google"),
    provider: new GoogleAuthProvider(),
  },
  {
    title: tx("syncPage.signInWith.apple"),
    icon: getVector("apple"),
    iconFilter: true,
    provider: new OAuthProvider("apple.com"),
  },
]

const currentUser = ref<User | null>(null)
const loadingCurrentUser = ref(true)
const fetchingUser = ref(false)
const deletingUser = ref(false)
let unsubscribe: (() => void) | undefined

onMounted(() => {
  unsubscribe = $auth.onAuthStateChanged((user) => {
    currentUser.value = user
    loadingCurrentUser.value = false
  })
})
onUnmounted(() => {
  unsubscribe?.()
})

const signedInWith = computed(() => {
  if (!currentUser.value) {
    return null
  }

  const provider = currentUser.value.providerData[0]
  if (!provider) {
    return null
  }

  switch (provider.providerId) {
    case "google.com":
      return "Google"
    case "apple.com":
      return "Apple"
    default:
      return null
  }
})

const signIn = (provider: AuthProvider) => {
  signInWithPopup($auth, provider)
    .then((result) => {
      // TODO: init user
      return null
    })
    .catch((error: FirebaseError) => {
      switch (error.code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          // do nothing (user canceled)
          break
        case "auth/popup-blocked":
          snackbar.show(tx(i18n, "syncPage.signInErrorPopupBlocked"), "error")
          break
        default:
          console.error(error)
          snackbar.show(tx(i18n, "syncPage.signInError", {code: error.code}), "error")
      }
    })
}

const signOut = () => {
  dialog.show(tx(i18n, "syncPage.signOut"), tx(i18n, "syncPage.signOutConfirm"), () => {
    $auth.signOut().then(() => {
      snackbar.show(tx(i18n, "syncPage.signOutSuccess"))
      return null
    }).catch((error) => {
      console.error(error)
      snackbar.show(tx(i18n, "syncPage.signOutError", {code: error.code}), "error")
    })
  })
}

const deleteUser = () => {
  dialog.show(tx(i18n, "syncPage.deleteUser"), tx(i18n, "syncPage.deleteUserConfirm"), () => {
    if (!currentUser.value) {
      return
    }

    deletingUser.value = true

    currentUser.value.delete().then(() => {
      snackbar.show(tx(i18n, "syncPage.deleteUserSuccess"))
      return null
    }).finally(() => {
      deletingUser.value = false
    }).catch((error) => {
      console.error(error)
      snackbar.show(tx(i18n, "syncPage.deleteUserError", {code: error.code}), "error")
    })
  })
}
</script>

<template>
  <div class="doc-container">
    <!-- user loading indicator -->
    <v-row v-if="loadingCurrentUser" align="center" no-gutters>
      <v-progress-circular indeterminate />
      <span class="ml-2">{{ tx("syncPage.loading") }}</span>
    </v-row>

    <!-- sign in screen -->
    <section v-else-if="!currentUser">
      <p>{{ tx("syncPage.desc") }}</p>

      <h2>{{ tx("syncPage.signIn") }}</h2>

      <v-list class="mt-4">
        <v-list-item
          v-for="method in signInMethods"
          :key="method.title"
          :title="method.title"
          @click="signIn(method.provider)"
        >
          <template #prepend>
            <v-img
              :class="{filter: method.iconFilter && $vuetify.theme.current.dark, 'mr-3': true}"
              :src="method.icon"
              height="30px"
              width="30px"
            />
          </template>
        </v-list-item>
      </v-list>
    </section>

    <!-- account info screen -->
    <section v-else>
      <h2>{{ tx("syncPage.accountInfo") }}</h2>

      <v-table class="mt-2">
        <tbody>
          <tr>
            <td>{{ tx("syncPage.signedInWith") }}</td>
            <td>{{ signedInWith }}</td>
          </tr>
          <tr>
            <td>{{ tx("syncPage.email") }}</td>
            <td>{{ currentUser.email }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-row class="mt-4" no-gutters style="gap: 16px">
        <v-btn :disabled="deletingUser" @click="signOut">
          {{ tx("syncPage.signOut") }}
        </v-btn>

        <v-btn :loading="deletingUser" color="red" variant="text" @click="deleteUser">
          {{ tx("syncPage.deleteUser") }}
        </v-btn>
      </v-row>
    </section>

    <client-only>
      <v-overlay :model-value="fetchingUser" style="display: grid; place-items: center">
        <v-row align="center" no-gutters>
          <v-progress-circular indeterminate size="32" />
          <span class="ml-4">{{ tx("syncPage.fetchingUserInfo") }}</span>
        </v-row>
      </v-overlay>
    </client-only>
  </div>
</template>

<style lang="sass" scoped>
.filter
  filter: invert(1)
</style>
