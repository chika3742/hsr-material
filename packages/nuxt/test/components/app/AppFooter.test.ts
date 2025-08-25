import { describe, expect, it, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import AppFooter from "../../../components/app/AppFooter.vue"

describe("AppFooter.vue", () => {
  const defaultProps = {
    currentVersion: "v1.0.0",
    themeSetting: "auto" as const,
    repositoryUrl: "https://github.com/test/repo",
    feedbackPageUrl: "https://feedback.example.com",
    hoyolabArticleUrl: "https://hoyolab.example.com",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Props and basic rendering", () => {
    it("should render with all props", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.find("footer").exists()).toBe(true)
      expect(wrapper.find(".v-footer").exists()).toBe(true)
    })

    it("should display current version", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain("v1.0.0")
    })

    it("should display copyright notice", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      const currentYear = new Date().getFullYear()
      expect(wrapper.text()).toContain(`©chika ${currentYear}`)
    })
  })

  describe("Social and external links", () => {
    it("should render social media buttons", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // Check that social buttons are rendered
      const buttons = wrapper.findAll(".v-btn")
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe("Navigation links", () => {
    it("should render release notes link", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // The $localePath should be called with '/release-notes'
      expect(wrapper.text()).toContain("pageTitles.releaseNotes")
    })

    it("should render terms link", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain("pageTitles.terms")
    })

    it("should render privacy link", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain("pageTitles.privacy")
    })
  })

  describe("Language selector", () => {
    it("should render language selector button", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain("LANG")
    })
  })

  describe("Theme selector", () => {
    it("should render theme selector button", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain("footer.theme")
    })

    it("should render component without throwing errors", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // This test ensures the component renders without errors
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe("Component integration", () => {
    it("should handle all props correctly", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // Test that the component can access its props
      expect(wrapper.props().currentVersion).toBe(defaultProps.currentVersion)
      expect(wrapper.props().themeSetting).toBe(defaultProps.themeSetting)
      expect(wrapper.props().repositoryUrl).toBe(defaultProps.repositoryUrl)
      expect(wrapper.props().feedbackPageUrl).toBe(defaultProps.feedbackPageUrl)
      expect(wrapper.props().hoyolabArticleUrl).toBe(defaultProps.hoyolabArticleUrl)
    })
  })

  describe("Responsive behavior", () => {
    it("should handle client-only sections", () => {
      const wrapper = mount(AppFooter, {
        props: defaultProps,
      })

      // The component should render without errors even with client-only sections
      expect(wrapper.find(".v-footer").exists()).toBe(true)
    })
  })

  describe("Props validation", () => {
    it("should handle different theme settings", () => {
      const themes = ["light", "dark", "auto"] as const

      themes.forEach((theme) => {
        const wrapper = mount(AppFooter, {
          props: {
            ...defaultProps,
            themeSetting: theme,
          },
        })

        expect(wrapper.exists()).toBe(true)
      })
    })

    it("should handle different version formats", () => {
      const versions = ["v1.0.0", "1.2.3-beta", "dev-build-123"]

      versions.forEach((version) => {
        const wrapper = mount(AppFooter, {
          props: {
            ...defaultProps,
            currentVersion: version,
          },
        })

        expect(wrapper.text()).toContain(version)
      })
    })
  })
})
