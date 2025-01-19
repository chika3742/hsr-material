export const toCharacterId = (characterIdWithVariant: string): string => {
  return characterIdWithVariant.split("_")[0]
}

export const toVariant = (characterIdWithVariant: string): string | null => {
  return characterIdWithVariant.split("_")[1] ?? null
}
