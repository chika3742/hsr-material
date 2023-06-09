type I18nExtractedObject<T extends object, D extends string> = T & {
  [key in D]: string | undefined
}

export const extractI18n = <T extends Record<string, unknown>, D extends string>(input: T[], i18nField: string, destField: D, parentKey: string): I18nExtractedObject<T, D>[] => {
  const _input = [...input] as I18nExtractedObject<T, D>[]
  for (const element of _input) {
    element[destField] = tx(`${parentKey}.${element[i18nField]}`) as I18nExtractedObject<T, D>[D]
  }

  return _input
}
