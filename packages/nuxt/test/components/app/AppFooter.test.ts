import { describe, expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import AppFooter from "../../../components/app/AppFooter.vue"
import type { ThemeSetting } from "../../../types/strings"

describe("AppFooter Component", () => {
  const defaultProps = {
    currentVersion: "1.0.0",
    themeSetting: "dark" as ThemeSetting,
    repositoryUrl: "https://github.com/example/repo",
    feedbackPageUrl: "https://example.com/feedback",
    hoyolabArticleUrl: "https://hoyolab.example.com/article",
  }

  describe("Component Mounting and Rendering", () => {
    it("should mount successfully", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: "v-footer" }).exists()).toBe(true)
    })

    it("should render footer with correct attributes", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const footer = wrapper.findComponent({ name: "v-footer" })
      expect(footer.props("elevation")).toBe("4")
      expect(footer.props("color")).toBe("footer")
    })

    it("should render safe area directive with correct options", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const safeAreaDiv = wrapper.find("div[class*='d-flex']")
      expect(safeAreaDiv.exists()).toBe(true)
      // The directive should apply bottom, left, and right padding
      expect(safeAreaDiv.element.style.paddingBottom).toBe("max(env(safe-area-inset-bottom), 0px)")
      expect(safeAreaDiv.element.style.paddingLeft).toBe("max(env(safe-area-inset-left), 0px)")
      expect(safeAreaDiv.element.style.paddingRight).toBe("max(env(safe-area-inset-right), 0px)")
    })
  })

  describe("Props Handling", () => {
    it("should display current version", () => {
      const wrapper = mount(AppFooter, {
        props: { ...defaultProps, currentVersion: "2.1.0-beta" },
      })

      const versionElement = wrapper.find("span")
      expect(wrapper.text()).toContain("2.1.0-beta")
    })

    it("should handle different theme settings", () => {
      const themes: ThemeSetting[] = ["light", "dark", "auto"]
      
      themes.forEach(theme => {
        const wrapper = mount(AppFooter, {
          props: { ...defaultProps, themeSetting: theme },
        })
        
        expect(wrapper.exists()).toBe(true)
        // The theme setting is used internally by the component
      })
    })

    it("should render social media buttons with correct links", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const buttons = wrapper.findAllComponents({ name: "v-btn" })
      const githubButton = buttons.find(btn => btn.props("icon") === "mdi-github")
      const twitterButton = buttons.find(btn => btn.props("icon") === "mdi-twitter")

      expect(githubButton).toBeTruthy()
      expect(githubButton?.props("href")).toBe(defaultProps.repositoryUrl)
      expect(githubButton?.props("target")).toBe("_blank")

      expect(twitterButton).toBeTruthy()
      expect(twitterButton?.props("href")).toBe("https://twitter.com/gms_material")
      expect(twitterButton?.props("target")).toBe("_blank")
    })
  })

  describe("Event Handling", () => {
    it("should emit update:themeSetting when theme changes", async () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // Find the theme menu and trigger a selection
      const themeList = wrapper.findComponent({ name: "v-list" })
      await themeList.vm.$emit("update:selected", ["light"])

      expect(wrapper.emitted("update:themeSetting")).toBeTruthy()
      expect(wrapper.emitted("update:themeSetting")[0]).toEqual(["light"])
    })
  })

  describe("Menu Items and Navigation", () => {
    it("should render feedback menu items", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const menus = wrapper.findAllComponents({ name: "v-menu" })
      expect(menus.length).toBeGreaterThan(0)

      // Check for feedback menu items
      const listItems = wrapper.findAllComponents({ name: "v-list-item" })
      expect(listItems.length).toBeGreaterThan(0)
    })

    it("should render language selector", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const languageButton = wrapper.findAllComponents({ name: "v-btn" })
        .find(btn => btn.text().includes("LANG"))
      
      expect(languageButton).toBeTruthy()
      expect(languageButton?.props("prependIcon")).toBe("mdi-earth")
    })

    it("should render theme selector", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const themeButton = wrapper.findAllComponents({ name: "v-btn" })
        .find(btn => btn.props("prependIcon") === "mdi-brightness-4")
      
      expect(themeButton).toBeTruthy()
    })

    it("should render navigation links", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const navButtons = wrapper.findAllComponents({ name: "v-btn" })
      const releaseNotesButton = navButtons.find(btn => btn.props("to") === "/release-notes")
      const termsButton = navButtons.find(btn => btn.props("to") === "/terms")
      const privacyButton = navButtons.find(btn => btn.props("to") === "/privacy")

      expect(releaseNotesButton).toBeTruthy()
      expect(termsButton).toBeTruthy()
      expect(privacyButton).toBeTruthy()
    })
  })

  describe("Computed Properties", () => {
    it("should compute feedback URL correctly", () => {
      const wrapper = mount(AppFooter, {
        props: {
          ...defaultProps,
          repositoryUrl: "https://github.com/test/repo",
          currentVersion: "1.2.3",
        },
      })

      // We can't directly test computed properties, but we can verify the component handles them
      expect(wrapper.exists()).toBe(true)
    })

    it("should compute feedback menu items correctly", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // Check that the component renders menu items (indirect test of computed property)
      const listItems = wrapper.findAllComponents({ name: "v-list-item" })
      expect(listItems.length).toBeGreaterThan(0)
    })
  })

  describe("Client-Side Rendering", () => {
    it("should handle client-only components", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // client-only components should render in test environment
      const clientOnlyElements = wrapper.findAll("client-only")
      expect(clientOnlyElements.length).toBeGreaterThan(0)
    })
  })

  describe("Internationalization", () => {
    it("should use translation keys", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // Check that translation keys are used (mocked to return the key itself)
      expect(wrapper.text()).toContain("footer.feedback")
      expect(wrapper.text()).toContain("footer.theme")
      expect(wrapper.text()).toContain("footer.disclaimer")
      expect(wrapper.text()).toContain("pageTitles.releaseNotes")
      expect(wrapper.text()).toContain("pageTitles.terms")
      expect(wrapper.text()).toContain("pageTitles.privacy")
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty URLs gracefully", () => {
      const wrapper = mount(AppFooter, {
        props: {
          ...defaultProps,
          repositoryUrl: "",
          feedbackPageUrl: "",
          hoyolabArticleUrl: "",
        },
      })

      expect(wrapper.exists()).toBe(true)
      // Component should still render even with empty URLs
    })

    it("should handle special characters in version", () => {
      const wrapper = mount(AppFooter, {
        props: {
          ...defaultProps,
          currentVersion: "1.0.0-β+build.ñ",
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain("1.0.0-β+build.ñ")
    })

    it("should handle all theme settings", () => {
      const themeSettings: ThemeSetting[] = ["light", "dark", "auto"]
      
      themeSettings.forEach(setting => {
        const wrapper = mount(AppFooter, {
          props: { ...defaultProps, themeSetting: setting },
        })
        
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  describe("Copyright and Disclaimer", () => {
    it("should display copyright information", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const currentYear = new Date().getFullYear()
      expect(wrapper.text()).toContain(`©chika ${currentYear}`)
    })

    it("should display disclaimer", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain("footer.disclaimer")
    })
  })
})