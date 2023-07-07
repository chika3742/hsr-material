export const useDialog = () => {
  return {
    ref: useState("dialog", () => ({
      displayed: false,
      title: "",
      content: "",
      onOk: null as (() => void) | null,
      onCancel: null as (() => void) | null,
      persistent: false,
    })),
    show(title: string, content: string, onOk: () => void, onCancel: (() => void) | null = null, options: {
      persistent?: boolean
    } = {}) {
      this.ref.value.displayed = true
      this.ref.value.title = title
      this.ref.value.content = content
      this.ref.value.onOk = () => {
        onOk()
        this.hide()
      }
      this.ref.value.onCancel = () => {
        onCancel?.()
        this.hide()
      }
      this.ref.value.persistent = options.persistent ?? false
    },
    hide() {
      this.ref.value.displayed = false
      this.ref.value.onOk = null
      this.ref.value.onCancel = null
    },
  }
}
