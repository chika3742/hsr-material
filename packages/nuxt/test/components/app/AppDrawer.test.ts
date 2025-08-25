import { describe, expect, it, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import AppDrawer from "../../../components/app/AppDrawer.vue"
import type { DrawerItemOrDivider } from "../../../components/app/AppDrawer.vue"

describe("AppDrawer.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Props and basic rendering", () => {
    it("should render with basic props", () => {
      const drawerItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/",
        },
      ]

      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems,
        },
      })

      expect(wrapper.find(".v-navigation-drawer").exists()).toBe(true)
      expect(wrapper.find(".v-list").exists()).toBe(true)
      expect(wrapper.find(".v-list-item").exists()).toBe(true)
    })

    it("should render multiple drawer items", () => {
      const drawerItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/",
        },
        {
          icon: "mdi-account",
          title: "Profile",
          to: "/profile",
        },
      ]

      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems,
        },
      })

      const listItems = wrapper.findAll(".v-list-item")
      expect(listItems).toHaveLength(2)
    })

    it("should render dividers for separator items", () => {
      const drawerItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/",
        },
        "---",
        {
          icon: "mdi-account",
          title: "Profile",
          to: "/profile",
        },
      ]

      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems,
        },
      })

      expect(wrapper.findAll(".v-list-item")).toHaveLength(2)
      expect(wrapper.find(".v-divider").exists()).toBe(true)
    })
  })

  describe("Item properties", () => {
    it("should handle drawer item with href", () => {
      const drawerItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-github",
          title: "GitHub",
          href: "https://github.com",
          target: "_blank",
        },
      ]

      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems,
        },
      })

      const listItem = wrapper.find(".v-list-item")
      expect(listItem.exists()).toBe(true)
    })

    it("should handle drawer item with onClick function", async () => {
      const onClickHandler = vi.fn()
      const drawerItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-settings",
          title: "Settings",
          onClick: onClickHandler,
        },
      ]

      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems,
        },
      })

      const listItem = wrapper.find(".v-list-item")
      await listItem.trigger("click")

      expect(onClickHandler).toHaveBeenCalledOnce()
    })
  })

  describe("Events", () => {
    it("should pass modelValue to navigation drawer", () => {
      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: [],
        },
      })

      const navigationDrawer = wrapper.find(".v-navigation-drawer")
      expect(navigationDrawer.exists()).toBe(true)
    })
  })

  describe("Edge cases", () => {
    it("should handle empty drawer items array", () => {
      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: [],
        },
      })

      expect(wrapper.find(".v-navigation-drawer").exists()).toBe(true)
      expect(wrapper.find(".v-list").exists()).toBe(true)
      expect(wrapper.findAll(".v-list-item")).toHaveLength(0)
    })

    it("should handle mixed item types", () => {
      const drawerItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/",
        },
        "---",
        {
          icon: "mdi-github",
          title: "GitHub",
          href: "https://github.com",
        },
        "---",
        {
          icon: "mdi-settings",
          title: "Settings",
          onClick: vi.fn(),
        },
      ]

      const wrapper = mount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems,
        },
      })

      expect(wrapper.findAll(".v-list-item")).toHaveLength(3)
      expect(wrapper.findAll(".v-divider")).toHaveLength(2)
    })
  })
})
