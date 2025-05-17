type SupportedLanguage = "ja" | "en"

export interface LocalizedText {
  locales: Record<SupportedLanguage, string>
}
