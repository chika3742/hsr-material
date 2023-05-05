import {initializeApp} from "@firebase/app"
import {connectFunctionsEmulator, getFunctions} from "@firebase/functions"
import {connectAuthEmulator, getAuth} from "@firebase/auth"
import {initializeAppCheck, ReCaptchaV3Provider} from "@firebase/app-check"
import {connectFirestoreEmulator, getFirestore} from "@firebase/firestore"

export default defineNuxtPlugin(({$config}) => {
  const app = initializeApp($config.public.isFirebaseDev
    ? $config.public.firebaseConfigDev
    : $config.public.firebaseConfigProd)

  if (process.dev) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider($config.public.recaptchaSiteKey),
  })

  const auth = getAuth(app)
  const functions = getFunctions(app, "asia-northeast1")
  const firestore = getFirestore(app)

  if (process.dev && $config.public.useFirebaseEmulator) {
    connectAuthEmulator(auth, "http://localhost:9099")
    connectFunctionsEmulator(functions, "localhost", 3005)
    connectFirestoreEmulator(firestore, "localhost", 8080)
  }

  return {
    provide: {
      auth,
      functions,
      firestore,
    },
  }
})
