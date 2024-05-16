import type {RouterConfig} from "@nuxt/schema"

export default <RouterConfig>{
  scrollBehavior(_, __, savedPosition) {
    return savedPosition ?? {
      top: 0,
    }
  },
}
