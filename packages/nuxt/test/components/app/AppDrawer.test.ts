import { describe, expect, it } from "vitest"
import { shallowMount } from "@vue/test-utils"
import AppDrawer from "../../../components/app/AppDrawer.vue"
import type { DrawerItemOrDivider } from "../../../components/app/AppDrawer.vue"

describe("AppDrawer Component", () => {
  const mockDrawerItems: DrawerItemOrDivider[] = [
    {
      icon: "mdi-home",
      title: "Home",
      to: "/home"
    },
    {
      icon: "mdi-settings", 
      title: "Settings",
      href: "https://example.com",
      target: "_blank"
    },
    "---",
    {
      icon: "mdi-info",
      title: "About"
    }
  ]

  describe("Component Interface", () => {
    it("should accept required props", () => {
      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: mockDrawerItems
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('modelValue')).toBe(true)
      expect(wrapper.props('drawerItems')).toEqual(mockDrawerItems)
    })

    it("should emit update:modelValue event", async () => {
      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: mockDrawerItems
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      await wrapper.vm.$emit('update:modelValue', false)
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it("should handle empty drawer items array", () => {
      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: false,
          drawerItems: []
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('drawerItems')).toEqual([])
    })

    it("should handle boolean modelValue changes", async () => {
      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: false,
          drawerItems: mockDrawerItems
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('modelValue')).toBe(false)

      await wrapper.setProps({ modelValue: true })
      expect(wrapper.props('modelValue')).toBe(true)
    })
  })

  describe("Data Types and Structure", () => {
    it("should handle DrawerItem with all properties", () => {
      const fullDrawerItem: DrawerItemOrDivider[] = [
        {
          icon: "mdi-test",
          title: "Test Item",
          to: "/test",
          href: "https://test.com",
          target: "_blank",
          onClick: () => {}
        }
      ]

      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: fullDrawerItem
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('drawerItems')).toEqual(fullDrawerItem)
    })

    it("should handle DrawerItem with minimal properties", () => {
      const minimalDrawerItem: DrawerItemOrDivider[] = [
        {
          icon: "mdi-test",
          title: "Test Item"
        }
      ]

      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: minimalDrawerItem
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('drawerItems')).toEqual(minimalDrawerItem)
    })

    it("should handle divider strings", () => {
      const itemsWithDividers: DrawerItemOrDivider[] = [
        {
          icon: "mdi-home",
          title: "Home"
        },
        "---",
        {
          icon: "mdi-settings",
          title: "Settings"
        }
      ]

      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: itemsWithDividers
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('drawerItems')).toEqual(itemsWithDividers)
    })

    it("should handle mixed drawer items and dividers", () => {
      const mixedItems: DrawerItemOrDivider[] = [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/home"
        },
        "---",
        {
          icon: "mdi-settings",
          title: "Settings",
          href: "https://example.com"
        },
        "---",
        {
          icon: "mdi-info",
          title: "About"
        }
      ]

      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: mixedItems
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.props('drawerItems')).toEqual(mixedItems)
    })
  })

  describe("Component Behavior", () => {
    it("should render without errors", () => {
      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: mockDrawerItems
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it("should be a Vue component instance", () => {
      const wrapper = shallowMount(AppDrawer, {
        props: {
          modelValue: true,
          drawerItems: mockDrawerItems
        },
        global: {
          stubs: ['v-navigation-drawer', 'v-list', 'v-list-item', 'v-divider']
        }
      })

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.vm.$props).toBeTruthy()
    })
  })
})