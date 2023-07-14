import {marked} from "marked"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      marked: ({gfm = true, strongColored = false}) => {
        const renderer = new marked.Renderer()

        renderer.link = (href, title, text) => {
          const pullMatch = href?.match(/^https:\/\/github\.com\/.+?\/.+?\/pull\/(\d+)/)
          if (pullMatch) {
            text = `#${pullMatch[1]}`
          }

          const compareMatch = href?.match(/^https:\/\/github\.com\/.+?\/.+?\/compare\/(.+?)\.\.\.(.+?)$/)
          if (compareMatch) {
            text = `${compareMatch[1]}...${compareMatch[2]}`
          }

          return `<a href="${href}" title="${title ?? ""}" target="_blank" rel="noopener noreferrer">${text}</a>`
        }

        if (strongColored) {
          renderer.strong = (text) => {
            return `<span class="text-light-blue font-weight-bold">${text}</span>`
          }
        } else {
          renderer.strong = (text) => {
            return `<span class="font-weight-bold">${text}</span>`
          }
        }

        marked.options({
          gfm,
          renderer,
          headerIds: false,
          mangle: false,
        })
        return marked
      },
    },
  }
})
