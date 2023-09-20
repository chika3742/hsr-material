import {Marked, Renderer} from "marked"

const toPartial = <T>(obj: T) => {
  return obj as Partial<T>
}

export class CustomMarked extends Marked {
  constructor(options = toPartial({
    gfm: true,
  })) {
    super()

    const renderer = new Renderer()

    renderer.link = (href, title, text) => {
      return `<a href="${href}" title="${title ?? ""}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }

    renderer.strong = (text) => {
      return `<span class="font-weight-bold">${text}</span>`
    }

    this.setOptions({
      gfm: options.gfm,
      renderer: new Renderer(),
    })
  }
}
