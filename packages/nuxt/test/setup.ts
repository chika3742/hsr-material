import { vi } from "vitest"
import { config } from "@vue/test-utils"

// Type declarations for global mocks using proper interface augmentation
declare global {
  interface GlobalThis {
    onMounted: typeof vi.fn
    computed: typeof vi.fn
    useI18n: typeof vi.fn
  }
}

// Mock global composables for Nuxt auto-imports
globalThis.onMounted = vi.fn((callback: () => void) => {
  queueMicrotask(callback)
})

globalThis.computed = vi.fn((fn: () => any) => {
  const result = fn()
  if (Array.isArray(result)) {
    return { value: result, ...result }
  }
  return { value: result }
})

globalThis.useI18n = vi.fn(() => ({
  t: vi.fn((key: string) => key),
  setLocale: vi.fn(),
  locale: { value: "en" },
}))

// Mock Vuetify
vi.mock("vuetify", () => ({
  useDisplay: () => ({
    mobile: { value: false },
  }),
}))

// Configure Vue Test Utils with minimal mocks
config.global.mocks = {
  $localePath: (path: string) => path,
  $t: (key: string) => key,
  $i18n: {
    locale: "en",
    setLocale: vi.fn(),
    t: vi.fn((key: string) => key),
  },
}

config.global.stubs = {
  "v-navigation-drawer": {
    template: "<div class=\"v-navigation-drawer\" v-bind=\"$attrs\"><slot /></div>",
    props: ["modelValue"],
    emits: ["update:modelValue"],
  },
  "v-footer": {
    template: "<footer class=\"v-footer\" v-bind=\"$attrs\"><slot /></footer>",
    props: ["elevation", "color"],
  },
  "v-list": {
    template: "<div class=\"v-list\" v-bind=\"$attrs\"><slot /></div>",
    props: ["nav", "selected"],
    emits: ["update:selected"],
  },
  "v-list-item": {
    template: "<div class=\"v-list-item\" v-bind=\"$attrs\" @click=\"$emit('click')\"><slot /></div>",
    props: ["href", "prependIcon", "target", "title", "to", "density", "subtitle", "lines", "active", "value"],
    emits: ["click"],
  },
  "v-list-item-title": {
    template: "<div class=\"v-list-item-title\"><slot /></div>",
  },
  "v-divider": {
    template: "<div class=\"v-divider\" v-bind=\"$attrs\"></div>",
  },
  "v-btn": {
    template: "<button class=\"v-btn\" v-bind=\"$attrs\" @click=\"$emit('click')\"><slot /></button>",
    props: ["icon", "href", "target", "variant", "density", "to", "color", "prependIcon"],
    emits: ["click"],
  },
  "v-menu": {
    template: "<div class=\"v-menu\"><slot /></div>",
    props: ["activator"],
  },
  "v-spacer": {
    template: "<div class=\"v-spacer\"></div>",
  },
  "client-only": {
    template: "<div class=\"client-only\"><slot /></div>",
  },
}

config.global.directives = {
  "safe-area": {},
}
