export const useSnackbar = () => {
  return {
    ref: useState("snackbar", () => ({
      displayed: false,
      message: "",
      color: null as string | null,
    })),
    show(message: string, color: string | null = null) {
      this.ref.value.displayed = true
      this.ref.value.message = message
      this.ref.value.color = color
    },
  }
}
