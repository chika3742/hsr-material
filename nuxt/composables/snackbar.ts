export const useSnackbar = () => {
  return {
    ref: useState("snackbar", () => ({
      displayed: false,
      message: "",
      color: null as string | null,
      actions: [] as { text: string, onClick: () => void }[],
    })),
    show(message: string, color: string | null = null, ...actions: { text: string, onClick: () => void }[]) {
      this.ref.value.displayed = true
      this.ref.value.message = message
      this.ref.value.color = color
      this.ref.value.actions = actions
    },
  }
}
