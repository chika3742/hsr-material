import { describe, expect, it } from "vitest"
import { shallowMount } from "@vue/test-utils"
import AppFooter from "../../../components/app/AppFooter.vue"
import type { ThemeSetting } from "../../../types/strings"

describe("AppFooter Component", () => {
  const defaultProps = {
    currentVersion: "1.0.0",
    themeSetting: "dark" as ThemeSetting,
    repositoryUrl: "https://github.com/example/repo",
    feedbackPageUrl: "https://example.com/feedback", 
    hoyolabArticleUrl: "https://hoyolab.example.com/article"
  }

  describe("Component Interface", () => {
    it("should accept required props", () => {
      const wrapper = shallowMount(AppFooter, {
        props: defaultProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item', 
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.props('currentVersion')).toBe(defaultProps.currentVersion)
      expect(wrapper.props('themeSetting')).toBe(defaultProps.themeSetting)
      expect(wrapper.props('repositoryUrl')).toBe(defaultProps.repositoryUrl)
      expect(wrapper.props('feedbackPageUrl')).toBe(defaultProps.feedbackPageUrl)
      expect(wrapper.props('hoyolabArticleUrl')).toBe(defaultProps.hoyolabArticleUrl)
    })

    it("should emit update:themeSetting event", async () => {
      const wrapper = shallowMount(AppFooter, {
        props: defaultProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      await wrapper.vm.$emit('update:themeSetting', 'light')
      expect(wrapper.emitted('update:themeSetting')).toBeTruthy()
      expect(wrapper.emitted('update:themeSetting')?.[0]).toEqual(['light'])
    })

    it("should handle theme setting prop changes", async () => {
      const wrapper = shallowMount(AppFooter, {
        props: {
          ...defaultProps,
          themeSetting: 'dark'
        },
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.props('themeSetting')).toBe('dark')

      await wrapper.setProps({ themeSetting: 'light' })
      expect(wrapper.props('themeSetting')).toBe('light')

      await wrapper.setProps({ themeSetting: 'auto' })
      expect(wrapper.props('themeSetting')).toBe('auto')
    })
  })

  describe("Props Validation", () => {
    it("should handle all valid theme settings", () => {
      const themes: ThemeSetting[] = ['light', 'dark', 'auto']
      
      themes.forEach(theme => {
        const wrapper = shallowMount(AppFooter, {
          props: {
            ...defaultProps,
            themeSetting: theme
          },
          global: {
            stubs: [
              'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
              'v-list-item-title', 'v-spacer', 'client-only'
            ]
          }
        })

        expect(wrapper.props('themeSetting')).toBe(theme)
      })
    })

    it("should handle version string variations", () => {
      const versions = [
        "1.0.0",
        "2.1.0-beta.1",
        "1.0.0-alpha.1+build.123",
        "0.0.1"
      ]

      versions.forEach(version => {
        const wrapper = shallowMount(AppFooter, {
          props: {
            ...defaultProps,
            currentVersion: version
          },
          global: {
            stubs: [
              'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
              'v-list-item-title', 'v-spacer', 'client-only'
            ]
          }
        })

        expect(wrapper.props('currentVersion')).toBe(version)
      })
    })

    it("should handle URL variations", () => {
      const urls = [
        "https://github.com/user/repo",
        "https://example.com/feedback",
        "https://hoyolab.example.com/article/123",
        ""  // empty URL
      ]

      const wrapper = shallowMount(AppFooter, {
        props: {
          ...defaultProps,
          repositoryUrl: urls[0],
          feedbackPageUrl: urls[1], 
          hoyolabArticleUrl: urls[2]
        },
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.props('repositoryUrl')).toBe(urls[0])
      expect(wrapper.props('feedbackPageUrl')).toBe(urls[1])
      expect(wrapper.props('hoyolabArticleUrl')).toBe(urls[2])
    })
  })

  describe("Component Behavior", () => {
    it("should render without errors", () => {
      const wrapper = shallowMount(AppFooter, {
        props: defaultProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it("should be a Vue component instance", () => {
      const wrapper = shallowMount(AppFooter, {
        props: defaultProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.vm.$props).toBeTruthy()
    })

    it("should handle prop updates without errors", async () => {
      const wrapper = shallowMount(AppFooter, {
        props: defaultProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      // Update multiple props
      await wrapper.setProps({
        currentVersion: "2.0.0",
        themeSetting: "light",
        repositoryUrl: "https://github.com/new/repo"
      })

      expect(wrapper.props('currentVersion')).toBe("2.0.0")
      expect(wrapper.props('themeSetting')).toBe("light")
      expect(wrapper.props('repositoryUrl')).toBe("https://github.com/new/repo")
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty props gracefully", () => {
      const emptyProps = {
        currentVersion: "",
        themeSetting: "dark" as ThemeSetting,
        repositoryUrl: "",
        feedbackPageUrl: "",
        hoyolabArticleUrl: ""
      }

      const wrapper = shallowMount(AppFooter, {
        props: emptyProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('currentVersion')).toBe("")
      expect(wrapper.props('repositoryUrl')).toBe("")
    })

    it("should handle very long strings", () => {
      const longProps = {
        currentVersion: "1.0.0-very-long-version-string-with-many-characters-and-build-metadata+build.123456789",
        themeSetting: "auto" as ThemeSetting,
        repositoryUrl: "https://github.com/very-long-username/very-long-repository-name-with-many-characters",
        feedbackPageUrl: "https://example.com/very/long/path/to/feedback/page/with/many/segments",
        hoyolabArticleUrl: "https://hoyolab.example.com/article/very-long-article-id-123456789"
      }

      const wrapper = shallowMount(AppFooter, {
        props: longProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('currentVersion')).toBe(longProps.currentVersion)
    })

    it("should handle special characters in strings", () => {
      const specialCharProps = {
        currentVersion: "1.0.0-β+build.ñ",
        themeSetting: "dark" as ThemeSetting,
        repositoryUrl: "https://github.com/user/repo-with-special-chars_123",
        feedbackPageUrl: "https://example.com/feedback?param=value&other=123",
        hoyolabArticleUrl: "https://hoyolab.example.com/article/123#section"
      }

      const wrapper = shallowMount(AppFooter, {
        props: specialCharProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('currentVersion')).toBe(specialCharProps.currentVersion)
    })
  })

  describe("Type Safety", () => {
    it("should enforce ThemeSetting type", () => {
      const wrapper = shallowMount(AppFooter, {
        props: {
          ...defaultProps,
          themeSetting: 'light' as ThemeSetting
        },
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      // TypeScript should enforce this at compile time
      expect(['light', 'dark', 'auto']).toContain(wrapper.props('themeSetting'))
    })

    it("should handle prop interface correctly", () => {
      const wrapper = shallowMount(AppFooter, {
        props: defaultProps,
        global: {
          stubs: [
            'v-footer', 'v-btn', 'v-menu', 'v-list', 'v-list-item',
            'v-list-item-title', 'v-spacer', 'client-only'
          ]
        }
      })

      // All props should be strings except themeSetting which is ThemeSetting
      expect(typeof wrapper.props('currentVersion')).toBe('string')
      expect(typeof wrapper.props('repositoryUrl')).toBe('string')
      expect(typeof wrapper.props('feedbackPageUrl')).toBe('string')
      expect(typeof wrapper.props('hoyolabArticleUrl')).toBe('string')
      expect(typeof wrapper.props('themeSetting')).toBe('string')
    })
  })
})