<script lang="ts" setup>
import type {AuthProvider, User} from "@firebase/auth"
import {GoogleAuthProvider, OAuthProvider, reauthenticateWithPopup, signInWithPopup} from "@firebase/auth"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"
import {_db} from "~/dexie/db"

definePageMeta({
  title: "sync",
})

const {$auth, $firestore} = useNuxtApp()
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
const overlayLoading = reactive({
  show: false,
  message: "",
})
const deletingUser = ref(false)
let unsubscribe: (() => void) | undefined

onMounted(() => {
  // init current user
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
  FirestoreProvider.blockListening = true

  signInWithPopup($auth, provider).then((result) => {
    overlayLoading.message = tx(i18n, "syncPage.fetchingUserInfo")
    overlayLoading.show = true
    FirestoreProvider.instance = new FirestoreProvider(result.user, $firestore, _db)
    return FirestoreProvider.instance.initUser()
  }).then(() => {
    FirestoreProvider.instance?.listen({cancelBlocking: true})
    snackbar.show(tx(i18n, "syncPage.signInSuccess"))
    return null
  }).finally(() => {
    overlayLoading.show = false
  }).catch((error) => {
    switch (error.code) {
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        // do nothing (user canceled)
        break
      case "auth/popup-blocked":
        snackbar.show(tx(i18n, "syncPage.signInErrorPopupBlocked"), "error")
        break
      case "mnt/schema-version-mismatch":
        snackbar.show(tx(i18n, "syncPage.schemaMismatchError"), "error")
        break
      case "mnt/conflict":
        dialog.show(
          tx(i18n, "syncPage.conflictDialogTitle"),
          tx(i18n, "syncPage.conflictDialogMessage"),
          sendLocalDataToResolveConflict,
          () => {
            FirestoreProvider.instance?.listen({cancelBlocking: true})
          },
          {persistent: true},
        )

        return // do not sign out
      default:
        console.error(error)
        snackbar.show(tx(i18n, "syncPage.signInError", {code: error.code}), "error")
    }

    // sign out to prevent data corruption
    if ($auth.currentUser) {
      void $auth.signOut()
    }
  })
}

const sendLocalDataToResolveConflict = () => {
  if (!currentUser.value || !FirestoreProvider.instance) {
    return
  }

  overlayLoading.message = tx(i18n, "syncPage.sendingLocalData")
  overlayLoading.show = true
  FirestoreProvider.instance.sendLocalData().then(() => {
    FirestoreProvider.instance?.listen({cancelBlocking: true})
    return null
  }).finally(() => {
    overlayLoading.show = false
  }).catch((error) => {
    console.error(error)
    snackbar.show(tx(i18n, "errors.failedToSync"), "error")

    // sign out to prevent data corruption
    if ($auth.currentUser) {
      void $auth.signOut()
    }
  })
}

const signOutWithConfirmation = () => {
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

    // find provider
    const provider = signInMethods.find((method) => {
      return method.provider.providerId === currentUser.value?.providerData[0].providerId
    })?.provider
    if (!provider) {
      throw new Error("unknown provider")
    }

    deletingUser.value = true

    // reauthenticate
    reauthenticateWithPopup(currentUser.value, provider).then((result) => {
      if (!currentUser.value) {
        throw new Error("not signed in")
      }
      if (result.operationType !== "reauthenticate") {
        throw new Error("unexpected operation type")
      }
      // execute user deletion
      return currentUser.value.delete()
    }).then(() => {
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
              aspect-ratio="1"
              width="30px"
            />
          </template>
        </v-list-item>
      </v-list>
    </section>

    <!-- account info screen -->
    <section v-else>
      <h2>{{ tx("syncPage.accountInfo") }}</h2>

      <v-table class="mt-2 text-no-wrap">
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
        <v-btn :disabled="deletingUser" @click="signOutWithConfirmation">
          {{ tx("syncPage.signOut") }}
        </v-btn>

        <v-btn :loading="deletingUser" color="red" variant="text" @click="deleteUser">
          {{ tx("syncPage.deleteUser") }}
        </v-btn>
      </v-row>
    </section>

    <client-only>
      <v-overlay :model-value="overlayLoading.show" style="display: grid; place-items: center">
        <v-row align="center" no-gutters>
          <v-progress-circular indeterminate size="32" />
          <span class="ml-4">{{ overlayLoading.message }}</span>
        </v-row>
      </v-overlay>
    </client-only>
  </div>
</template>

<style lang="sass" scoped>
.filter
  filter: invert(1)
</style>
