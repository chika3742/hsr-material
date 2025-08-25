import { beforeEach } from "vitest"
import { config } from "@vue/test-utils"
import type { Directive } from "vue"
import { clone, defaults } from "lodash-es"

// Mock safe-area directive for testing
const safeAreaDirective: Directive = {
  mounted(el, binding) {
    const params = clone(binding.value || {})
    defaults(params, {
      top: false,
      right: false,
      bottom: false,
      left: false,
    })
    
    // Apply mock styles for testing
    if (params.top !== false) {
      el.style.paddingTop = `max(env(safe-area-inset-top), ${typeof params.top === "number" ? params.top : 0}px)`
    }
    if (params.right !== false) {
      el.style.paddingRight = `max(env(safe-area-inset-right), ${typeof params.right === "number" ? params.right : 0}px)`
    }
    if (params.bottom !== false) {
      el.style.paddingBottom = `max(env(safe-area-inset-bottom), ${typeof params.bottom === "number" ? params.bottom : 0}px)`
    }
    if (params.left !== false) {
      el.style.paddingLeft = `max(env(safe-area-inset-left), ${typeof params.left === "number" ? params.left : 0}px)`
    }
  },
}

// Register global directives for all tests
beforeEach(() => {
  config.global.directives = {
    'safe-area': safeAreaDirective,
  }
})

// Mock Nuxt/Vue router functions and composables
config.global.mocks = {
  $localePath: (path: string) => path,
  $t: (key: string) => key,
  $i18n: {
    locale: 'en',
    setLocale: () => {},
    t: (key: string) => key,
  },
}

// Mock Vuetify components as simple stubs
config.global.stubs = {
  'client-only': {
    template: '<div><slot /></div>',
  },
  'v-navigation-drawer': {
    template: '<div><slot /></div>',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
  'v-list': {
    template: '<div><slot /></div>',
    props: ['nav'],
  },
  'v-list-item': {
    template: '<div></div>',
    props: ['href', 'prependIcon', 'target', 'title', 'to', 'density'],
    emits: ['click'],
  },
  'v-divider': {
    template: '<hr>',
    props: ['class'],
  },
  'v-footer': {
    template: '<footer><slot /></footer>',
    props: ['elevation', 'color', 'class'],
  },
  'v-btn': {
    template: '<button><slot /></button>',
    props: ['icon', 'href', 'target', 'variant', 'density', 'to', 'color', 'prependIcon'],
  },
  'v-menu': {
    template: '<div><slot /></div>',
    props: ['activator'],
  },
  'v-list-item-title': {
    template: '<div><slot /></div>',
  },
  'v-spacer': {
    template: '<div></div>',
  },
}

// Mock Vuetify provide/inject system
config.global.provide = {
  // Mock Vuetify display injection
  'Symbol(vuetify:display)': {
    mobile: { value: false },
    xs: { value: false },
    sm: { value: false },
    md: { value: true },
    lg: { value: false },
    xl: { value: false },
    xxl: { value: false },
  },
}

// Mock Nuxt auto-imports
global.useI18n = () => ({
  locale: { value: 'en' },
  setLocale: () => {},
  t: (key: string) => key,
})

global.onMounted = () => {}
global.computed = (fn: () => any) => ({ value: fn() })

// Mock Vuetify composables
global.useDisplay = () => ({
  mobile: { value: false },
  xs: { value: false },
  sm: { value: false },
  md: { value: true },
  lg: { value: false },
  xl: { value: false },
  xxl: { value: false },
})

// Mock import.meta for client-side checks
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      client: true,
    },
  },
})