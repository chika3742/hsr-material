import type {FirebaseOptions} from "@firebase/app"
import {initializeApp} from "@firebase/app"
import {connectFunctionsEmulator, getFunctions} from "@firebase/functions"
import {connectAuthEmulator, getAuth} from "@firebase/auth"
import {initializeAppCheck, ReCaptchaV3Provider} from "@firebase/app-check"
import {connectFirestoreEmulator, initializeFirestore, persistentLocalCache} from "@firebase/firestore"
import {getAnalytics} from "@firebase/analytics"

export default defineNuxtPlugin(({$config}) => {
  const app = initializeApp($config.public.firebaseConfig as FirebaseOptions)

  if (process.dev) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider($config.public.recaptchaSiteKey),
  })

  const auth = getAuth(app)
  const functions = getFunctions(app, "asia-northeast1")
  const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache(),
  })

  if (process.dev && $config.public.useFirebaseEmulator) {
    connectAuthEmulator(auth, "http://localhost:9099")
    connectFunctionsEmulator(functions, "localhost", 3005)
    connectFirestoreEmulator(firestore, "localhost", 8080)
  }

  const analytics = getAnalytics(app)

  return {
    provide: {
      auth,
      functions,
      firestore,
      analytics,
    },
  }
})
