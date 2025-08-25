import { describe, expect, it, vi } from "vitest"
import { mount } from "@vue/test-utils"
import AppDrawer from "../../../components/app/AppDrawer.vue"
import type { DrawerItemOrDivider } from "../../../components/app/AppDrawer.vue"

// Mock useDisplay composable before importing the component
vi.mock("vuetify", () => ({
  useDisplay: () => ({
    mobile: { value: false },
    xs: { value: false },
    sm: { value: false },
    md: { value: true },
    lg: { value: false },
    xl: { value: false },
    xxl: { value: false },
  }),
}))

describe("AppDrawer Component", () => {
  const defaultProps = {
    modelValue: true,
    drawerItems: [
      { icon: "mdi-home", title: "Home", to: "/home" },
      "---" as const,
      { icon: "mdi-settings", title: "Settings", to: "/settings" },
    ] satisfies DrawerItemOrDivider[],
  }

  const mountOptions = {
    global: {
      provide: {
        // Provide Vuetify display injection with correct symbol
        [Symbol.for('vuetify:display')]: {
          mobile: { value: false },
          xs: { value: false },
          sm: { value: false },
          md: { value: true },
          lg: { value: false },
          xl: { value: false },
          xxl: { value: false },
        },
      },
    },
  }

  describe("Component Mounting and Rendering", () => {
    it("should mount successfully", () => {
      const wrapper = mount(AppDrawer, {
        props: defaultProps,
        ...mountOptions,
      })

      expect(wrapper.exists()).toBe(true)
      // Test that the component renders some content
      expect(wrapper.html()).toContain('v-navigation-drawer')
    })

    it("should apply safe area directive", () => {
      const wrapper = mount(AppDrawer, {
        props: defaultProps,
        ...mountOptions,
      })

      const safeAreaDiv = wrapper.find("div")
      expect(safeAreaDiv.exists()).toBe(true)
      // The directive should be applied
      expect(safeAreaDiv.element.style.paddingTop).toBe("max(env(safe-area-inset-top), 0px)")
      expect(safeAreaDiv.element.style.paddingLeft).toBe("max(env(safe-area-inset-left), 0px)")
    })

    it("should render with modelValue", () => {
      const wrapper = mount(AppDrawer, {
        props: defaultProps,
        ...mountOptions,
      })

      // Check that modelValue is passed to the navigation drawer stub
      expect(wrapper.html()).toContain('model-value="true"')
    })
  })

  describe("Props Handling", () => {
    it("should handle different modelValue", () => {
      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, modelValue: false },
        ...mountOptions,
      })

      expect(wrapper.html()).toContain('model-value="false"')
    })

    it("should render drawer items in template", () => {
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-home", title: "Home", to: "/home" },
        { icon: "mdi-info", title: "About", href: "https://example.com", target: "_blank" },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      // Check that items are rendered in the template
      expect(wrapper.html()).toContain('mdi-home')
      expect(wrapper.html()).toContain('Home')
      expect(wrapper.html()).toContain('mdi-info')
      expect(wrapper.html()).toContain('About')
    })

    it("should handle dividers in template", () => {
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-home", title: "Home" },
        "---",
        { icon: "mdi-settings", title: "Settings" },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      // Should render items and dividers
      expect(wrapper.html()).toContain('mdi-home')
      expect(wrapper.html()).toContain('mdi-settings')
      expect(wrapper.html()).toContain('v-divider')
    })

    it("should handle empty drawer items", () => {
      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: [] },
        ...mountOptions,
      })

      // Should still render the basic structure
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.html()).toContain('v-navigation-drawer')
    })
  })

  describe("Event Handling", () => {
    it("should handle update:modelValue event", async () => {
      const wrapper = mount(AppDrawer, {
        props: defaultProps,
        ...mountOptions,
      })

      // Find the v-navigation-drawer stub and emit an event
      const navigationDrawer = wrapper.find('[model-value="true"]')
      await navigationDrawer.trigger('update:model-value', false)

      // Should emit the update:modelValue event
      expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    })

    it("should handle onClick for items", () => {
      const mockOnClick = vi.fn()
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-action", title: "Action", onClick: mockOnClick },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      // The component should have the onClick function in its props data
      expect(wrapper.vm.drawerItems[0]).toHaveProperty('onClick')
      expect(typeof (wrapper.vm.drawerItems[0] as any).onClick).toBe('function')
    })
  })

  describe("Component Lifecycle and Data", () => {
    it("should handle mounting correctly", () => {
      // Test that the component mounts without errors
      expect(() => {
        mount(AppDrawer, {
          props: defaultProps,
          ...mountOptions,
        })
      }).not.toThrow()
    })

    it("should access component data correctly", () => {
      const wrapper = mount(AppDrawer, {
        props: defaultProps,
        ...mountOptions,
      })

      // Test that component has expected props
      expect(wrapper.vm.modelValue).toBe(true)
      expect(wrapper.vm.drawerItems).toHaveLength(3)
      expect(wrapper.vm.drawerItems[0]).toEqual({ icon: "mdi-home", title: "Home", to: "/home" })
      expect(wrapper.vm.drawerItems[1]).toBe("---")
    })
  })

  describe("Drawer Item Types and Navigation", () => {
    it("should handle navigation items with $localePath", () => {
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-home", title: "Home", to: "/home" },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      // Should process the 'to' property through $localePath
      expect(wrapper.html()).toContain('/home')
    })

    it("should handle external links", () => {
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-link", title: "External", href: "https://example.com", target: "_blank" },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      expect(wrapper.html()).toContain('https://example.com')
      expect(wrapper.html()).toContain('_blank')
    })

    it("should handle action items", () => {
      const mockCallback = vi.fn()
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-action", title: "Action", onClick: mockCallback },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      expect(wrapper.vm.drawerItems[0]).toHaveProperty('onClick')
    })
  })

  describe("Edge Cases", () => {
    it("should handle items with special characters", () => {
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-test", title: "Special: éñü", to: "/special-chars_123" },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      expect(wrapper.html()).toContain('Special: éñü')
      expect(wrapper.html()).toContain('/special-chars_123')
    })

    it("should handle arrays with only dividers", () => {
      const testItems: DrawerItemOrDivider[] = ["---", "---", "---"]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      expect(wrapper.vm.drawerItems).toHaveLength(3)
      expect(wrapper.vm.drawerItems.every(item => item === "---")).toBe(true)
    })

    it("should handle mixed content patterns", () => {
      const testItems: DrawerItemOrDivider[] = [
        { icon: "mdi-start", title: "Start" },
        "---",
        { icon: "mdi-middle", title: "Middle" },
        "---",
        { icon: "mdi-end", title: "End" },
      ]

      const wrapper = mount(AppDrawer, {
        props: { ...defaultProps, drawerItems: testItems },
        ...mountOptions,
      })

      expect(wrapper.vm.drawerItems).toHaveLength(5)
      expect(wrapper.html()).toContain('mdi-start')
      expect(wrapper.html()).toContain('mdi-middle')
      expect(wrapper.html()).toContain('mdi-end')
      expect(wrapper.html()).toContain('v-divider')
    })
  })

  describe("Type Safety and Interface Validation", () => {
    it("should correctly type DrawerItem interface", () => {
      const validItem: DrawerItemOrDivider = {
        icon: "mdi-test",
        title: "Test Item",
        to: "/test",
        href: "https://test.com",
        target: "_blank",
        onClick: () => {},
      }

      expect(typeof validItem).toBe('object')
      if (typeof validItem === 'object') {
        expect(typeof validItem.icon).toBe('string')
        expect(typeof validItem.title).toBe('string')
        expect(typeof validItem.to).toBe('string')
        expect(typeof validItem.href).toBe('string')
        expect(typeof validItem.target).toBe('string')
        expect(typeof validItem.onClick).toBe('function')
      }
    })

    it("should correctly type divider strings", () => {
      const divider: DrawerItemOrDivider = "---"
      expect(typeof divider).toBe('string')
      expect(divider).toBe("---")
    })

    it("should handle mixed arrays correctly", () => {
      const mixedItems: DrawerItemOrDivider[] = [
        { icon: "mdi-home", title: "Home" },
        "---",
        { icon: "mdi-settings", title: "Settings" },
      ]

      expect(Array.isArray(mixedItems)).toBe(true)
      expect(mixedItems).toHaveLength(3)
      expect(typeof mixedItems[0]).toBe('object')
      expect(typeof mixedItems[1]).toBe('string')
      expect(typeof mixedItems[2]).toBe('object')
    })
  })
})